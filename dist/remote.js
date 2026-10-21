(function(){
  'use strict';
  var $=function(s){return document.querySelector(s);},esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var paths={notes:'<path d="M12 20h9M16 3l5 5L8 21H3v-5L16 3Z"/>',lights:'<path d="M9 18h6M9 21h6M9 15a6 6 0 1 1 6 0v3H9v-3Z"/>',timers:'<circle cx="12" cy="14" r="8"/><path d="M9 2h6M12 6V2m6 6 2-2M12 10v5l3 2"/>',tasks:'<path d="m3 6 2 2 4-4m-6 9 2 2 4-4m4-4h8M13 14h8M13 21h8M3 21h6"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',moon:'<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',refresh:'<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5"/>',power:'<path d="M12 2v10M6 5a9 9 0 1 0 12 0"/>',check:'<path d="m5 12 4 4L19 6"/>',plus:'<path d="M12 5v14M5 12h14"/>'};
  function icon(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+paths[n]+'</svg>';}
  var names={notes:'Notes',lights:'Lumières',timers:'Minuteurs',tasks:'À faire'},tab='notes',key='',snapshot=null,online=false,pollTimer,pollBusy=false,signature='',focusRequest=null,pending=new Map(),toastTimer,clockTimer,query='';
  try{key=localStorage.getItem('hub.remote.key')||'';document.body.classList.toggle('dark',localStorage.getItem('hub.remote.theme')==='dark');}catch(_){}
  var fragment=new URLSearchParams(location.hash.slice(1)),pairKey=fragment.get('key');
  if(pairKey&&/^[a-f0-9]{64}$/.test(pairKey)){key=pairKey;try{localStorage.setItem('hub.remote.key',key);}catch(_){}history.replaceState(null,'',location.pathname);}
  function toast(s){clearTimeout(toastTimer);$('#remote-toast').textContent=s;$('#remote-toast').hidden=false;toastTimer=setTimeout(function(){$('#remote-toast').hidden=true;},6000);}
  function theme(){$('#theme').innerHTML=icon(document.body.classList.contains('dark')?'sun':'moon');}
  theme();$('#refresh').innerHTML=icon('refresh');$('.pair-icon').innerHTML=icon('phone');
  document.querySelectorAll('[data-tab]').forEach(function(b){b.innerHTML=icon(b.dataset.tab)+'<span>'+names[b.dataset.tab]+'</span>';});
  function connected(){var paired=/^[a-f0-9]{64}$/.test(key);$('#pairing').hidden=paired;$('#connected-content').hidden=!paired;$('#connection-dot').classList.toggle('online',online);$('#connection-status').textContent=online?'Connecté à la maison':paired?'Cadre indisponible · vérifier le Wi-Fi et Hub':'Scanne le QR dans les réglages du cadre';}
  function intro(title,description,count){return '<div class="intro">'+(count?'<span class="count">'+esc(count)+'</span>':'')+'<h2>'+title+'</h2><p>'+description+'</p></div>';}
  function mount(){
    signature='';document.querySelectorAll('[data-tab]').forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===tab);});
    var html='';
    if(tab==='notes')html=intro('Un mot pour la maison.','Une pensée, un rappel, une petite attention.')+'<section class="card"><form id="note-form"><label for="note-text">Ta note</label><textarea id="note-text" name="text" maxlength="400" required placeholder="Le colis est chez le voisin…"></textarea><label class="check-line"><input type="checkbox" name="pin" checked>Épingler sur l’accueil</label><button class="primary" type="submit">'+icon('plus')+'Envoyer au cadre</button></form></section>';
    if(tab==='lights')html=intro('La bonne lumière.','Tes lampes et prises, avec leur état réel.');
    if(tab==='timers')html=intro('Chaque chose à son rythme.','Touche un raccourci : le minuteur démarre sur le cadre.')+'<section class="card remote-timer-choices"><div class="timer-quick-grid">'+HubTimerPresets.items.map(function(p){return '<button class="timer-quick" data-timer-quick="'+p.id+'" aria-label="Lancer '+p.label+' · '+HubTimerPresets.duration(p.minutes)+'"><strong>'+p.label+'</strong><span>'+HubTimerPresets.duration(p.minutes)+'</span></button>';}).join('')+'</div><p class="section-label">Ou juste une durée</p><div class="timer-duration-grid">'+HubTimerPresets.minutes.map(function(n){return '<button class="secondary" data-timer-minutes="'+n+'" aria-label="Lancer un minuteur de '+HubTimerPresets.duration(n)+'">'+HubTimerPresets.duration(n)+'</button>';}).join('')+'</div><p class="muted">Trois minuteurs maximum · son à activer sur le cadre.</p></section>';

    if(tab==='tasks')html=intro('Une chose à la fois.','Tes tâches Todoist. Les courses restent séparées.')+'<input type="search" class="task-search" id="task-search" placeholder="Rechercher une tâche" aria-label="Rechercher une tâche" value="'+esc(query)+'">';
    $('#remote-main').innerHTML=html+'<div id="offline-hint" class="offline-hint" hidden>Aucune action ne sera envoyée tant que le cadre est indisponible.</div><div id="remote-data"></div>';
    update();
  }
  function update(){
    $('#offline-hint').hidden=online;
    document.querySelectorAll('[data-timer-quick],[data-timer-minutes]').forEach(function(b){b.disabled=!online||pending.size>0||!!(snapshot&&snapshot.timers&&snapshot.timers.length>=3);});
    document.querySelectorAll('#remote-main form button').forEach(function(b){b.disabled=!online||pending.size>0;});
    var d=snapshot||{notes:[],lights:[],timers:[],tasks:[]},html='';
    if(tab==='notes')html='<div class="section-label"><span>Sur le cadre</span><span>'+(d.notes||[]).length+' / 12</span></div>'+(d.notes||[]).slice().reverse().map(function(n){return '<article class="card"><p class="note">'+esc(n.text)+'</p><p class="note-meta">'+(n.pinned?'Épinglée · ':'')+esc(new Date(n.created).toLocaleDateString('fr-CH',{day:'numeric',month:'short'}))+'</p></article>';}).join('');
    if(tab==='lights')html=(!d.ha?'<p class="empty">Connecte Home Assistant dans Hub pour retrouver tes lampes.</p>':'<div class="lights-grid">'+(d.lights||[]).map(function(l){return '<button class="light'+(l.on?' on':'')+'" data-light="'+esc(l.id)+'" data-on="'+!l.on+'" aria-pressed="'+l.on+'" '+(!online||!l.available||pending.size?'disabled':'')+'>'+icon('lights')+'<span class="power">'+icon('power')+'</span><span><strong>'+esc(l.name)+'</strong><small>'+(!l.available?'Indisponible':l.on?'Allumée':'Éteinte')+'</small></span></button>';}).join('')+'</div>');
    if(tab==='timers')html='<div class="section-label"><span>En cours sur le cadre</span><span>'+(d.timers||[]).length+' / 3</span></div>'+(d.timers||[]).map(function(t){return '<article class="card timer-row"><span class="timer-index">'+t.id+'</span><div><strong>'+esc(t.label)+'</strong><small>'+esc(t.tag||'')+(t.paused?' · En pause':'')+'</small></div><time data-remaining="'+t.id+'">—</time></article>';}).join('');
    if(tab==='tasks'){
      var tasks=(d.tasks||[]).filter(function(t){return !query||t.content.toLocaleLowerCase().includes(query.toLocaleLowerCase());});
      html='<div class="section-label"><span>'+tasks.length+' tâche'+(tasks.length>1?'s':'')+(d.tasksTotal>d.tasks.length?' · '+d.tasks.length+' premières sur '+d.tasksTotal:'')+'</span><span>Todoist</span></div>'+(!d.todoist?'<p class="empty">Connecte Todoist dans les réglages du cadre.</p>':tasks.length?'<div class="task-list">'+tasks.map(function(t){return '<button class="task" data-task="'+esc(t.id)+'" '+(!online||pending.size?'disabled':'')+' aria-label="Terminer : '+esc(t.content)+'"><span class="tick">'+(Array.from(pending.values()).some(function(p){return p.task===t.id;})?icon('check'):'')+'</span><span>'+esc(t.content)+(t.due?'<small>'+esc(t.due)+'</small>':'')+'</span></button>';}).join('')+'</div>':'<p class="empty">'+(query?'Aucune tâche ne correspond.':'Tout est à jour, prends une pause.')+'</p>');
    }
    if(html!==signature){$('#remote-data').innerHTML=html;signature=html;}
    if(focusRequest&&!pending.size){
      if(focusRequest.tab===tab&&(!document.activeElement||document.activeElement===document.body||document.activeElement===$('#remote-main'))){var focus=focusRequest.task?$('[data-task="'+focusRequest.task+'"]')||$('.task'):$('[data-light="'+focusRequest.entity+'"]');if(focus&&!focus.disabled)focus.focus({preventScroll:true});}
      focusRequest=null;
    }
    tickClock();
  }
  function tickClock(){clearTimeout(clockTimer);if(document.hidden||tab!=='timers'||!snapshot)return;var active=false;(snapshot.timers||[]).forEach(function(t){var node=$('[data-remaining="'+t.id+'"]'),seconds=Math.max(0,Math.ceil(t.paused?t.remaining:(t.end-Date.now())/1000));if(node)node.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');if(!t.paused&&seconds>0)active=true;});if(active)clockTimer=setTimeout(tickClock,1000);}
  async function poll(){
    clearTimeout(pollTimer);if(document.hidden||pollBusy||!key)return;pollBusy=true;
    try{var data=await HubRemote.request(fetch,key,'status');online=Date.now()/1000-data.heartbeat<=15;if(data.snapshot)snapshot=HubRemote.decode(data.snapshot);
      (data.results||[]).forEach(function(r){var p=pending.get(r.id);if(!p)return;pending.delete(r.id);var result=HubRemote.decode(r.value);toast(result.message||'Action traitée.');if(result.ok&&p.success)p.success();});
      pending.forEach(function(p,id){if(Date.now()-p.created>30000){pending.delete(id);toast('Résultat non reçu. Vérifie l’état avant de réessayer.');}});
    }catch(e){online=false;if(/Association expirée/.test(e.message)){key='';try{localStorage.removeItem('hub.remote.key');}catch(_){}toast(e.message);}}
    finally{pollBusy=false;connected();update();if(!document.hidden&&key)pollTimer=setTimeout(poll,pending.size?1500:4000);}
  }
  async function send(type,args,success){
    if(!online||pending.size)return;var c=Object.assign({id:HubRemote.id(),created:Date.now(),type:type},args);try{HubRemote.validate(c,Date.now());}catch(e){toast(e.message);return;}focusRequest={tab:tab,task:c.task,entity:c.entity};pending.set(c.id,{created:c.created,task:c.task,success:success});update();
    try{await HubRemote.request(fetch,key,'send',c.id,HubRemote.encode(c));toast('Demande envoyée…');await poll();}catch(e){pending.delete(c.id);toast('Envoi non confirmé. Vérifie l’état avant de réessayer.');update();}
  }
  document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.tab){tab=b.dataset.tab;mount();}if(b.id==='theme'){document.body.classList.toggle('dark');try{localStorage.setItem('hub.remote.theme',document.body.classList.contains('dark')?'dark':'light');}catch(_){}theme();}if(b.id==='refresh')poll();if(b.id==='forget'){key='';snapshot=null;online=false;pending.clear();try{localStorage.removeItem('hub.remote.key');}catch(_){}connected();clearTimeout(pollTimer);}if(b.dataset.timerQuick){var preset=HubTimerPresets.find(b.dataset.timerQuick);if(preset)send('timer',{seconds:preset.minutes*60,label:preset.label,tag:preset.tag});}if(b.dataset.timerMinutes&&HubTimerPresets.minutes.includes(Number(b.dataset.timerMinutes)))send('timer',{seconds:Number(b.dataset.timerMinutes)*60,label:'Minuteur',tag:''});if(b.dataset.light)send('light',{entity:b.dataset.light,on:b.dataset.on==='true'});if(b.dataset.task)send('task',{task:b.dataset.task});});
  document.addEventListener('input',function(e){if(e.target.id==='task-search'){query=e.target.value;update();}});
  document.addEventListener('submit',function(e){e.preventDefault();var f=e.target;if(f.id==='pair-form'){var value=f.elements.key.value.trim();if(!/^[a-f0-9]{64}$/.test(value)){toast('La clé doit contenir les 64 caractères du lien.');return;}key=value;try{localStorage.setItem('hub.remote.key',key);}catch(_){}connected();poll();}
    if(f.id==='note-form'){var original=f.elements.text.value;send('note',{text:original.trim(),pin:f.elements.pin.checked},function(){if(f.isConnected&&f.elements.text.value===original)f.elements.text.value='';});}
  });
  document.addEventListener('visibilitychange',function(){clearTimeout(pollTimer);clearTimeout(clockTimer);if(!document.hidden){online=false;connected();update();poll();}});
  connected();mount();poll();
})();
