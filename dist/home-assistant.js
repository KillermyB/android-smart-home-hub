/* Direct Home Assistant WebSocket client, Chrome/WebView 106+.
 * Protocol: https://developers.home-assistant.io/docs/api/websocket/
 * Credentials are in memory unless explicitly remembered. Commands are never retried.
 */
(function (root) {
  'use strict';
  function failure(code, message) { var e = new Error(message); e.code = code; return e; }
  function endpoint(value) {
    var url;
    try { url = new URL(String(value || '').trim()); } catch (_) { throw failure('invalid_url', 'Adresse Home Assistant invalide.'); }
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash) throw failure('invalid_url', 'Utilise une adresse HTTP(S), sans identifiants, paramètres ni fragment.');
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = url.pathname.replace(/\/+$/, '').replace(/\/api\/websocket$/, '') + '/api/websocket';
    return url.href;
  }
  function normalizeURL(value) { var url = new URL(endpoint(value)); url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:'; url.pathname = url.pathname.replace(/\/api\/websocket$/, '') || '/'; return url.href.replace(/\/$/, ''); }
  function credentials(value) {
    if (!value || typeof value.token !== 'string' || !value.token.trim() || value.token.length > 8192 || /[\r\n]/.test(value.token)) throw failure('invalid_token','Jeton Home Assistant invalide.');
    return {url:normalizeURL(value.url),token:value.token.trim()};
  }
  function saved() { try { var value=root.localStorage.getItem('hub.ha.connection'); return value?credentials(JSON.parse(value)):null; } catch (_) { return null; } }
  function remember(value) { value=credentials(value); try { root.localStorage.setItem('hub.ha.connection',JSON.stringify(value)); } catch (_) { throw failure('storage_unavailable','Connexion établie, mais mémorisation impossible sur cet appareil.'); } }
  function forget() { try { root.localStorage.removeItem('hub.ha.connection'); } catch (_) {} }
  function group(value) {
    if(!validState(value))return '';
    var domain=value.entity_id.split('.')[0],attr=value.attributes;
    // Hide generic Tuya shortcuts, including numbered copies, without deleting HA scenes.
    if(domain==='scene'){var sceneName=String(attr.friendly_name||value.entity_id.slice(6)).trim().replace(/[_-]+/g,' ');return /^turn\s*(?:on|off)(?:\s+\d+)?$/i.test(sceneName)?'':'scene';}
    if(domain==='light')return 'lighting';
    if(domain!=='switch')return ['media_player','vacuum','script'].includes(domain)?domain:'';
    var name=String(attr.friendly_name||value.entity_id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return attr.device_class==='outlet'||/lamp|light|eclair|prise|socket|plug/.test(name+' '+String(attr.icon||''))?'lighting':'switch';
  }
  // Home Assistant core vacuum/const.py: START=8192, PAUSE=4, STOP=8, RETURN_HOME=16.
  function supports(value, service) {
    if (!validState(value) || value.state === 'unavailable') return false;
    var domain = value.entity_id.split('.')[0];
    if(value.state==='unknown'&&domain!=='scene')return false;
    if (domain === 'light' || domain === 'switch') return ['turn_on','turn_off','toggle'].indexOf(service) >= 0;
    if (domain === 'scene' || domain === 'script') return service === 'turn_on';
    if(domain==='media_player'){var media={media_pause:1,volume_set:4,media_previous_track:16,media_next_track:32,turn_on:128,turn_off:256,media_stop:4096,media_play:16384};return Object.prototype.hasOwnProperty.call(media,service)&&(Number(value.attributes.supported_features)&media[service])===media[service];}
    var bits = {start:8192, pause:4, stop:8, return_to_base:16}, bit = Object.prototype.hasOwnProperty.call(bits,service) ? bits[service] : 0;
    return domain === 'vacuum' && bit > 0 && (Number(value.attributes.supported_features) & bit) === bit;
  }
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function entity(value) { return typeof value === 'string' && /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(value); }
  function validState(value) { return value && entity(value.entity_id) && typeof value.state === 'string' && value.attributes && typeof value.attributes === 'object' && !Array.isArray(value.attributes); }
  // Dreame exposes rooms per map; never merge IDs from different floor plans.
  function roomList(value) {
    if(!validState(value)||value.entity_id.split('.')[0]!=='vacuum')return {map:'',rooms:[]};
    var attrs=value.attributes,raw=attrs.rooms,selected=typeof attrs.selected_map==='string'?attrs.selected_map:'',list=[];
    if(Array.isArray(raw))list=raw;
    else if(raw&&typeof raw==='object'){
      var maps=Object.keys(raw).filter(function(key){return Array.isArray(raw[key]);});
      if(selected&&maps.includes(selected))list=raw[selected];
      else if(!selected&&maps.length===1){selected=maps[0];list=raw[selected];}
    }
    var seen=new Set(),rooms=[];
    list.slice(0,200).forEach(function(room){
      if(!room||typeof room!=='object')return;
      var id=Number(room.id),name=typeof room.name==='string'?room.name.trim():'';
      if(!Number.isInteger(id)||id<1||id>9999||seen.has(id)||!name)return;
      seen.add(id);rooms.push({id:id,name:name.slice(0,100)});
    });
    return {map:selected,rooms:rooms};
  }
  function create(options) {
    options = options || {};
    var address = endpoint(options.url), token = String(options.token || '').trim(), WS = options.WebSocket || root.WebSocket;
    if (!token || /[\r\n]/.test(token)) throw failure('invalid_token', 'Ajoute un jeton Home Assistant valide.');
    if (typeof WS !== 'function') throw failure('unsupported', 'WebSocket est indisponible dans ce navigateur.');
    var confirmMs=Math.min(15000,Math.max(30,Number(options.confirmMs)||8000)),settleMs=Math.min(1500,confirmMs/2),timeout = Number(options.timeoutMs) || 12000;
    options = null;
    if (!Number.isFinite(timeout) || timeout < 1 || timeout > 60000) throw failure('invalid_timeout', 'Délai de connexion invalide.');
    var serviceCache = Object.create(null), serviceLoading = null;
    var socket = null, phase = 'disconnected', lastError = null, listeners = new Set(), cache = Object.create(null), pending = new Map(), sequence = 0, subscription = null, loading = false, queued = [], authTimer, connecting = null, resolveConnect, rejectConnect;
    function states() { return copy(Object.keys(cache).sort().map(function (id) { return cache[id]; })); }
    function status() { return {status:phase, error:lastError}; }
    function emit() { listeners.forEach(function (listener) { try { listener(states(), status()); } catch (_) { /* A view callback must not break the connection. */ } }); }
    function close(error, nextPhase, forget) {
      var previous = socket; socket = null; clearTimeout(authTimer);
      pending.forEach(function (request) { clearTimeout(request.timer); request.reject(error || failure('disconnected', 'Connexion Home Assistant fermée.')); }); pending.clear();
      if (rejectConnect) rejectConnect(error || failure('disconnected', 'Connexion Home Assistant fermée.'));
      connecting = null; resolveConnect = rejectConnect = null; subscription = null; loading = false; queued = []; cache = Object.create(null); serviceCache=Object.create(null); serviceLoading=null;
      phase = nextPhase || 'disconnected'; lastError = error || null; if (forget) token = '';
      if (previous) { previous.onmessage = previous.onerror = previous.onclose = null; try { previous.close(); } catch (_) {} }
      emit();
    }
    function send(type, fields) {
      return new Promise(function (resolve, reject) {
        if (!socket || socket.readyState !== 1) { reject(failure('not_connected', 'Reconnecte Home Assistant avant cette commande.')); return; }
        var id = ++sequence, message = Object.assign({id:id, type:type}, fields || {});
        var timer = setTimeout(function () { pending.delete(id); reject(failure('timeout', type === 'call_service' ? 'Réponse non reçue. Vérifie l’appareil avant de réessayer la commande.' : 'Home Assistant ne répond pas.')); }, timeout);
        pending.set(id, {resolve:resolve, reject:reject, timer:timer});
        try { socket.send(JSON.stringify(message)); } catch (_) { clearTimeout(timer); pending.delete(id); reject(failure('connection_failed', 'Impossible de communiquer avec Home Assistant.')); }
      });
    }
    function applyEvent(event) {
      if (!event || event.event_type !== 'state_changed' || !event.data || !entity(event.data.entity_id)) return;
      var data = event.data;
      if (data.new_state === null) delete cache[data.entity_id];
      else if (validState(data.new_state) && data.new_state.entity_id === data.entity_id) cache[data.entity_id] = copy(data.new_state);
      else return;
      if (phase === 'connected') emit();
    }
    async function initialize(current) {
      try {
        loading = true; subscription = sequence + 1;
        await send('subscribe_events', {event_type:'state_changed'});
        if (socket !== current) return;
        var initial = await send('get_states');
        if (socket !== current) return;
        if (!Array.isArray(initial) || !initial.every(validState)) throw failure('protocol_error', 'Les états Home Assistant reçus sont invalides.');
        cache = Object.create(null); initial.forEach(function (value) { cache[value.entity_id] = copy(value); });
        queued.forEach(applyEvent); queued = []; loading = false; phase = 'connected'; lastError = null;
        var resolve = resolveConnect; connecting = null; resolveConnect = rejectConnect = null; if (resolve) resolve(states()); emit();
      } catch (error) { if (socket === current) close(error, 'error'); }
    }
    function receive(current, event) {
      if (socket !== current) return;
      var message;
      try { message = JSON.parse(event.data); } catch (_) { close(failure('protocol_error', 'Réponse Home Assistant illisible.'), 'error'); return; }
      if (!message || typeof message !== 'object' || Array.isArray(message)) { close(failure('protocol_error', 'Réponse Home Assistant invalide.'), 'error'); return; }
      if (message.type === 'auth_required' && phase === 'connecting') {
        try { current.send(JSON.stringify({type:'auth', access_token:token})); } catch (_) { close(failure('connection_failed', 'Impossible de joindre Home Assistant.'), 'error'); }
      } else if (message.type === 'auth_invalid') close(failure('auth_invalid', 'Jeton Home Assistant refusé. Vérifie son accès.'), 'error');
      else if (message.type === 'auth_ok' && phase === 'connecting' && !loading) { clearTimeout(authTimer); initialize(current); }
      else if (message.type === 'result' && pending.has(message.id)) {
        var request = pending.get(message.id); clearTimeout(request.timer); pending.delete(message.id);
        if (message.success === true) request.resolve(message.result);
        else { var error = failure('service_error', 'Home Assistant a refusé cette demande.'); error.serverCode = message.error && typeof message.error.code === 'string' ? message.error.code.slice(0,80) : 'unknown_error'; request.reject(error); }
      } else if (message.type === 'event' && message.id === subscription) { if (loading) queued.push(message.event); else applyEvent(message.event); }
    }
    function connect() {
      if (phase === 'connected') return Promise.resolve(states());
      if (connecting) return connecting;
      if (!token) return Promise.reject(failure('invalid_token', 'Renseigne à nouveau ton jeton pour te reconnecter.'));
      phase = 'connecting'; lastError = null; cache = Object.create(null);
      var promise = new Promise(function (resolve, reject) { resolveConnect = resolve; rejectConnect = reject; }); connecting = promise;
      try {
        var current = new WS(address); socket = current;
        current.onmessage = function (event) { receive(current, event); };
        current.onerror = function () { if (socket === current) close(failure('connection_failed', 'Home Assistant est inaccessible. Vérifie l’adresse, le réseau et HTTPS.'), 'error'); };
        current.onclose = function () { if (socket === current) close(failure('connection_closed', 'Connexion Home Assistant interrompue. Reconnecte-la pour retrouver les appareils.'), 'disconnected'); };
        authTimer = setTimeout(function () { if (socket === current) close(failure('auth_timeout', 'Home Assistant ne répond pas à la connexion.'), 'error'); }, timeout);
      } catch (_) { close(failure('connection_failed', 'Impossible d’ouvrir la connexion Home Assistant.'), 'error'); }
      emit(); return promise;
    }
    async function call(domain, service, target, data) {
      if (phase !== 'connected') throw failure('not_connected', 'Reconnecte Home Assistant avant cette commande.');
      if (!/^[a-z][a-z0-9_]*$/.test(domain) || !/^[a-z][a-z0-9_]*$/.test(service)) throw failure('invalid_service', 'Commande Home Assistant invalide.');
      if (!target || typeof target !== 'object' || Array.isArray(target) || Object.keys(target).some(function (key) { return key !== 'entity_id'; })) throw failure('invalid_target', 'Choisis un appareil précis de cette connexion.');
      var ids = Array.isArray(target.entity_id) ? target.entity_id.slice() : [target.entity_id];
      if (!ids.length || ids.some(function (id) { return !entity(id) || id.split('.')[0] !== domain || !Object.prototype.hasOwnProperty.call(cache,id); })) throw failure('invalid_target', 'Cet appareil n’appartient pas aux états Home Assistant chargés.');
      if (ids.some(function (id) { return cache[id].state === 'unavailable' || cache[id].state === 'unknown' && domain !== 'scene'; })) throw failure('unavailable', 'Cet appareil est actuellement indisponible.');
      if (ids.some(function (id) { return !supports(cache[id],service); })) throw failure('unsupported_service', 'Cette commande n’est pas disponible pour cet appareil.');
      data = data == null ? {} : data;
      if (typeof data !== 'object' || Array.isArray(data) || ['entity_id','device_id','area_id','floor_id','label_id'].some(function (key) { return Object.prototype.hasOwnProperty.call(data,key); })) throw failure('invalid_data', 'Les paramètres ne peuvent pas changer les appareils ciblés.');
      var payload; try { payload = copy(data); } catch (_) { throw failure('invalid_data', 'Paramètres Home Assistant invalides.'); }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload) || ['entity_id','device_id','area_id','floor_id','label_id'].some(function (key) { return Object.prototype.hasOwnProperty.call(payload,key); })) throw failure('invalid_data', 'Paramètres Home Assistant invalides.');
      if(domain==='media_player'&&(Object.keys(payload).some(function(k){return service!=='volume_set'||k!=='volume_level';})||(service==='volume_set'&&(!Number.isFinite(payload.volume_level)||payload.volume_level<0||payload.volume_level>1))))throw failure('invalid_data','Volume attendu entre 0 et 1.');
      return send('call_service', {domain:domain, service:service, target:{entity_id:ids.length === 1 ? ids[0] : ids}, service_data:payload});
    }
    function services(){return copy(serviceCache);}
    async function loadServices(){
      if(phase!=='connected')throw failure('not_connected','Reconnecte Home Assistant avant cette demande.');
      if(serviceLoading)return serviceLoading;
      var current=socket,job=send('get_services').then(function(result){
        if(socket!==current||phase!=='connected')throw failure('not_connected','La connexion Home Assistant a changé.');
        if(!result||typeof result!=='object'||Array.isArray(result))throw failure('protocol_error','La liste des services est invalide.');
        serviceCache=copy(result);return services();
      }).finally(function(){if(serviceLoading===job)serviceLoading=null;});
      serviceLoading=job;return job;
    }
    function vacuumRooms(id){
      var value=cache[id],result=roomList(value),available=!!(serviceCache.dreame_vacuum&&serviceCache.dreame_vacuum.vacuum_clean_segment&&serviceCache.dreame_vacuum.vacuum_clean_segment.fields&&serviceCache.dreame_vacuum.vacuum_clean_segment.fields.segments);
      result.serviceAvailable=available;
      result.reason=!available?'Le service de nettoyage par pièce n’est pas annoncé par Home Assistant.':!result.rooms.length?'Aucune pièce de la carte active n’est disponible.':'';
      return result;
    }
    async function cleanRooms(id,segments){
      if(phase!=='connected')throw failure('not_connected','Reconnecte Home Assistant avant cette commande.');
      var value=cache[id];
      if(!entity(id)||!value||id.split('.')[0]!=='vacuum')throw failure('invalid_target','Choisis un robot de cette connexion.');
      if(['unavailable','unknown'].includes(value.state))throw failure('unavailable','Ce robot est actuellement indisponible.');
      if(!['docked','idle','paused'].includes(value.state))throw failure('busy','Arrête le nettoyage en cours avant de choisir une pièce.');
      var info=vacuumRooms(id);
      if(!info.serviceAvailable)throw failure('unsupported_service',info.reason);
      if(!Array.isArray(segments)||!segments.length||segments.length>30||segments.some(function(segment){return !Number.isInteger(segment)||!info.rooms.some(function(room){return room.id===segment;});})||new Set(segments).size!==segments.length)throw failure('invalid_data','Choisis uniquement des pièces de la carte active.');
      // Bounded service and exact target; an acknowledgement does not prove physical cleaning.
      await send('call_service',{domain:'dreame_vacuum',service:'vacuum_clean_segment',target:{entity_id:id},service_data:{segments:segments.slice()}});
      return {accepted:true,confirmed:false};
    }
    async function confirmedCall(domain,service,target,data){
      var id=target&&target.entity_id,expected={turn_off:'off',turn_on:'on',media_pause:'paused',media_play:'playing',media_stop:'idle',start:'cleaning',pause:'paused',return_to_base:'returning',stop:'idle'}[service];
      if(typeof id!=='string')throw failure('invalid_target','Choisis un seul appareil.');
      // Resolve toggles once; a second tap cannot invert an in-flight request.
      if(service==='toggle'){service=cache[id]&&cache[id].state==='on'?'turn_off':'turn_on';expected=service==='turn_off'?'off':'on';}
      await call(domain,service,target,data);
      if(!expected||domain==='scene'||domain==='script'||service==='volume_set')return {confirmed:false,accepted:true};
      return new Promise(function(resolve,reject){
        var done=false,deadline,refresh,early,reading=false,fallback=false;
        function matches(){var value=cache[id]&&cache[id].state;return value===expected||domain==='media_player'&&expected==='on'&&['playing','paused','idle','standby','buffering'].includes(value)||domain==='media_player'&&expected==='off'&&value==='standby'||domain==='vacuum'&&expected==='returning'&&value==='docked';}
        function finish(error,confirmed){if(done)return;done=true;clearTimeout(deadline);clearTimeout(refresh);clearTimeout(early);listeners.delete(check);if(error)reject(error);else resolve({confirmed:confirmed,accepted:true,state:cache[id]&&cache[id].state});}
        function check(){if(phase!=='connected')finish(failure('not_connected','Connexion interrompue pendant la vérification.'));else if(matches())finish(null,true);}
        listeners.add(check);deadline=setTimeout(function(){finish(null,matches());},confirmMs);
        async function readback(){if(done)return;if(reading){fallback=true;return;}reading=true;var before=cache[id];try{var values=await send('get_states');if(done)return;var latest=Array.isArray(values)&&values.find(function(value){return value.entity_id===id&&validState(value);});if(latest&&cache[id]===before){cache[id]=copy(latest);emit();}check();}catch(error){if(!done)finish(error);}finally{reading=false;if(fallback&&!done){fallback=false;readback();}}}
        early=setTimeout(readback,Math.min(300,settleMs/2));
        refresh=setTimeout(readback,settleMs);
        check();
      });
    }
    return {url:normalizeURL(address.replace(/^ws:/,'http:').replace(/^wss:/,'https:')), connect:connect, states:states, status:status, services:services, loadServices:loadServices, vacuumRooms:vacuumRooms, cleanRooms:cleanRooms, call:call, confirmedCall:confirmedCall, subscribe:function (listener) { if (typeof listener !== 'function') throw failure('invalid_listener','Écouteur Home Assistant invalide.'); listeners.add(listener); try { listener(states(),status()); } catch (_) {} return function () { listeners.delete(listener); }; }, disconnect:function () { close(null,'disconnected',true); }};
  }
  var api = {roomList:roomList, create:create, endpoint:endpoint, normalizeURL:normalizeURL, supports:supports, group:group, credentials:credentials, saved:saved, remember:remember, forget:forget};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.HubHA = api;
})(typeof window !== 'undefined' ? window : globalThis);
