/* Small LRCLIB client and LRC reader, written for Hub. No lyrics are bundled.
 * Protocol: https://lrclib.net/docs · LRCLIB server: https://github.com/tranxuanthang/lrclib (MIT).
 * That software license does not grant a license to the lyrics returned by the service.
 */
(function(root){
  'use strict';
  var ENDPOINT='https://lrclib.net/api/get',SOURCE='https://lrclib.net',MAX_RESPONSE=262144,MAX_TEXT=64000,MAX_LRC=128000,MAX_CUES=1500;
  function fail(kind,message){var e=new Error(message);e.kind=kind;return e;}
  function aborted(){return fail('cancelled','Chargement des paroles annulé.');}
  function clean(value,max,required){if(typeof value!=='string'||value.length>max)throw fail('metadata','Informations du morceau incomplètes.');var s=value.normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();if(required&&!s)throw fail('metadata','Informations du morceau incomplètes.');return s;}
  function normalized(value){return String(value||'').normalize('NFKC').replace(/\s+/g,' ').trim().toLocaleLowerCase('en');}
  function track(item){
    if(!item||typeof item!=='object'||item.type&&item.type!=='track')throw fail('metadata','Les paroles sont disponibles pour les morceaux musicaux.');
    var title=clean(item.title||item.name,300,true),artist=clean(item.artist||(item.artists&&item.artists[0]&&item.artists[0].name),300,true),album=clean(typeof item.album==='string'?item.album:item.album&&item.album.name,300,true);
    var duration=typeof item.durationMs==='number'?Math.round(item.durationMs/1000):typeof item.duration_ms==='number'?Math.round(item.duration_ms/1000):Number(item.duration);
    if(!Number.isFinite(duration)||duration<1||duration>3600)throw fail('metadata','La durée de ce morceau ne permet pas cette recherche de paroles.');
    return {title:title,artist:artist,album:album,duration:duration};
  }
  function keyFor(t){return JSON.stringify([normalized(t.title),normalized(t.artist),normalized(t.album),t.duration]);}
  function parseLRC(input){
    if(typeof input!=='string'||input.length>MAX_LRC)throw fail('response','Le fichier de paroles est trop volumineux.');
    var rows=input.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').split('\n'),offset=0,raw=[];
    rows.forEach(function(row){var m=row.match(/^\s*\[offset:\s*([+-]?\d+)\s*\]\s*$/i);if(m&&Math.abs(Number(m[1]))<=300000)offset=Number(m[1]);});
    rows.forEach(function(row){
      var re=/\[(\d{1,3}):([0-5]\d)(?:[.:](\d{1,3}))?\]/g,times=[],match,end=0;
      // Only leading timestamp tags are cues. Metadata and stray tags are not sung text.
      while((match=re.exec(row))&&row.slice(end,match.index).trim()===''){times.push((Number(match[1])*60+Number(match[2]))*1000+Number((match[3]||'').padEnd(3,'0')));end=re.lastIndex;}
      if(!times.length)return;
      var text=row.slice(end).replace(/<\d{1,3}:[0-5]\d(?:[.:]\d{1,3})?>/g,'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim();
      if(text.length>1000)throw fail('response','Une ligne de paroles est trop longue.');
      times.forEach(function(time){if(raw.length>=MAX_CUES)throw fail('response','Le fichier de paroles contient trop de lignes.');raw.push({timeMs:Math.max(0,time-offset),text:text,order:raw.length});});
    });
    // A positive LRC offset advances the words: subtract it from their timestamp.
    raw.sort(function(a,b){return a.timeMs-b.timeMs||a.order-b.order;});
    var lines=[];
    raw.forEach(function(cue){var previous=lines[lines.length-1];if(previous&&previous.timeMs===cue.timeMs){if(cue.text&&previous.text.split('\n').indexOf(cue.text)<0)previous.text+=(previous.text?'\n':'')+cue.text;}else lines.push({timeMs:cue.timeMs,text:cue.text});});
    return lines;
  }
  function lineAt(lines,progressMs){
    if(!Array.isArray(lines)||!lines.length||!Number.isFinite(progressMs)||progressMs<0)return -1;
    var lo=0,hi=lines.length-1,found=-1;
    while(lo<=hi){var mid=(lo+hi)>>1;if(lines[mid].timeMs<=progressMs){found=mid;lo=mid+1;}else hi=mid-1;}
    return found;
  }
  function result(raw,t){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw fail('response','Réponse de paroles non reconnue.');
    if(normalized(raw.trackName)!==normalized(t.title)||normalized(raw.artistName)!==normalized(t.artist)||normalized(raw.albumName)!==normalized(t.album)||!Number.isFinite(Number(raw.duration))||Math.abs(Number(raw.duration)-t.duration)>2)return empty(t);
    var base={source:'LRCLIB',sourceURL:SOURCE,track:t,id:Number.isSafeInteger(raw.id)&&raw.id>0?raw.id:null,lines:[],plainText:''};
    if(raw.instrumental===true)return Object.assign(base,{status:'instrumental'});
    if(raw.plainLyrics!=null&&(typeof raw.plainLyrics!=='string'||raw.plainLyrics.length>MAX_TEXT)||raw.syncedLyrics!=null&&(typeof raw.syncedLyrics!=='string'||raw.syncedLyrics.length>MAX_LRC))throw fail('response','Les paroles reçues sont trop volumineuses.');
    var plain=(raw.plainLyrics||'').replace(/\r\n?/g,'\n').trim(),lines=raw.syncedLyrics?parseLRC(raw.syncedLyrics):[];
    base.plainText=plain;base.lines=lines;
    if(lines.some(function(x){return !!x.text;}))return Object.assign(base,{status:'synced'});
    if(plain)return Object.assign(base,{status:'plain'});
    return empty(t);
  }
  function empty(t){return {status:'not-found',source:'LRCLIB',sourceURL:SOURCE,track:t,id:null,lines:[],plainText:''};}
  async function limitedBody(response){
    var length=Number(response.headers&&response.headers.get('Content-Length'));
    if(Number.isFinite(length)&&length>MAX_RESPONSE)throw fail('response','La réponse de paroles est trop volumineuse.');
    if(response.body&&typeof response.body.getReader==='function'){
      var reader=response.body.getReader(),decoder=new TextDecoder(),parts=[],size=0;
      try{while(true){var chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>MAX_RESPONSE)throw fail('response','La réponse de paroles est trop volumineuse.');parts.push(decoder.decode(chunk.value,{stream:true}));}parts.push(decoder.decode());return parts.join('');}catch(e){try{await reader.cancel();}catch(_){}throw e;}finally{reader.releaseLock();}
    }
    var text=await response.text();if(text.length>MAX_RESPONSE)throw fail('response','La réponse de paroles est trop volumineuse.');return text;
  }
  function create(options){
    options=options||{};var fetcher=options.fetch||root.fetch,client=options.client||'Hub. v0.6.0 (https://github.com/KillermyB/smart-hub)',cache=new Map(),queue=Promise.resolve(),controller=null,generation=0,pending=0,retryAt=0,nextAt=0;
    if(typeof fetcher!=='function')throw fail('network','La recherche de paroles est indisponible dans ce navigateur.');
    var timeoutMs=Math.min(20000,Math.max(1000,Number(options.timeoutMs)||12000)),now=options.now||Date.now;
    function remember(key,value){cache.delete(key);cache.set(key,{value:value,expires:now()+(value.status==='not-found'?600000:3600000)});while(cache.size>12)cache.delete(cache.keys().next().value);}
    function pause(ms,signal){return new Promise(function(resolve,reject){if(signal.aborted){reject(aborted());return;}var timer=setTimeout(done,Math.max(0,ms));function cancel(){clearTimeout(timer);signal.removeEventListener('abort',cancel);reject(aborted());}function done(){signal.removeEventListener('abort',cancel);resolve();}signal.addEventListener('abort',cancel,{once:true});});}
    async function run(t,key,signal,revision){
      if(revision!==generation||signal&&signal.aborted)throw aborted();
      var hit=cache.get(key);if(hit&&hit.expires>now()){cache.delete(key);cache.set(key,hit);return hit.value;}if(hit)cache.delete(key);
      if(now()<retryAt){var waiting=fail('rate-limit','LRCLIB demande de patienter avant de réessayer.');waiting.retryAt=retryAt;throw waiting;}
      controller=new AbortController();var current=controller,timedOut=false,timer;
      function cancel(){current.abort();}if(signal)signal.addEventListener('abort',cancel,{once:true});
      try{
        await pause(nextAt-now(),current.signal);if(revision!==generation||signal&&signal.aborted)throw aborted();
        timer=setTimeout(function(){timedOut=true;current.abort();},timeoutMs);
        var query=new URLSearchParams({track_name:t.title,artist_name:t.artist,album_name:t.album,duration:String(t.duration)});
        var response=await fetcher(ENDPOINT+'?'+query.toString(),{method:'GET',headers:{Accept:'application/json','Lrclib-Client':client},signal:current.signal,credentials:'omit',referrerPolicy:'no-referrer',redirect:'error'});
        if(current.signal.aborted||revision!==generation)throw aborted();
        if(response.status===429||response.status===503){var header=response.headers&&response.headers.get('Retry-After'),seconds=Number(header),wait=header&&Number.isFinite(seconds)&&seconds>=0?seconds*1000:header?Date.parse(header)-now():0;retryAt=now()+Math.max(1000,Number.isFinite(wait)&&wait>0?wait:response.status===429?60000:5000);var rate=fail('rate-limit','LRCLIB est temporairement occupé. Réessaie plus tard.');rate.retryAt=retryAt;throw rate;}
        if(response.status===404){var missing=empty(t);remember(key,missing);return missing;}
        if(!response.ok)throw fail('network','Les paroles sont indisponibles pour le moment.');
        var contentType=response.headers&&response.headers.get('Content-Type');if(contentType&&!/application\/(?:[\w.+-]*\+)?json\b/i.test(contentType))throw fail('response','Le service de paroles a renvoyé une réponse inattendue.');
        var text=await limitedBody(response),raw;try{raw=JSON.parse(text);}catch(_){throw fail('response','La réponse de paroles est illisible.');}
        if(current.signal.aborted||revision!==generation)throw aborted();var value=result(raw,t);remember(key,value);return value;
      }catch(e){if(timedOut)throw fail('timeout','La recherche de paroles a pris trop de temps. Réessaie plus tard.');if(current.signal.aborted||revision!==generation||signal&&signal.aborted)throw aborted();if(e.kind)throw e;throw fail('network','Impossible de joindre LRCLIB. Vérifie la connexion puis réessaie.');}
      finally{clearTimeout(timer);if(signal)signal.removeEventListener('abort',cancel);if(controller===current)controller=null;nextAt=now()+300;}
    }
    return {
      load:function(item,options){var t;try{t=track(item);}catch(e){return Promise.reject(e);}if(pending>=8)return Promise.reject(fail('busy','Une recherche de paroles est déjà en attente.'));var key=keyFor(t),revision=generation,signal=options&&options.signal;pending++;var work=queue.then(function(){return run(t,key,signal,revision);});queue=work.catch(function(){});return work.finally(function(){pending--;});},
      cancel:function(){generation++;if(controller)controller.abort();},
      clear:function(){cache.clear();}
    };
  }
  var api={create:create,track:track,parseLRC:parseLRC,lineAt:lineAt};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HubLyrics=api;
}(typeof window==='undefined'?this:window));
