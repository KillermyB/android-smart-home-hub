(function (root) {
  'use strict';
  var MAX_BYTES=10000000, MAX_ITEMS=100;
  function safeURL(value) {
    try { var url=new URL(String(value).trim());return /^(https?:)$/.test(url.protocol)&&!url.username&&!url.password&&url.href.length<=2048?url.href:null; } catch(_){return null;}
  }
  function brief(events,tasks,now,date) {
    var minute=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Zurich',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
    var timed=events.filter(function(e){return e.date===date&&/^\d\d:\d\d$/.test(e.start)&&((/^\d\d:\d\d$/.test(e.end)?e.end:e.start)>minute);}).sort(function(a,b){return a.start.localeCompare(b.start);});
    var next=timed[0]||null;
    return {next:next,ongoing:!!(next&&next.start<=minute),priorities:tasks.map(function(t,i){return {task:t,index:i};}).filter(function(x){return !x.task.done;}).sort(function(a,b){return (Number(b.task.priority)||1)-(Number(a.task.priority)||1)||a.index-b.index;}).slice(0,3).map(function(x){return x.task;})};
  }
  function upcoming(events,now,date){
    var time=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Zurich',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now),minute=Number(time.slice(0,2))*60+Number(time.slice(3));
    return events.map(function(e){if(!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.end))return null;var offset=(Date.parse(e.date+'T12:00:00Z')-Date.parse(date+'T12:00:00Z'))/60000,start=offset+Number(e.start.slice(0,2))*60+Number(e.start.slice(3))-minute,end=offset+Number(e.end.slice(0,2))*60+Number(e.end.slice(3))-minute;if(end<start)end+=1440;return {event:e,startMinutes:start,endMinutes:end,ongoing:start<=0&&end>0};}).filter(function(x){return x&&x.endMinutes>0&&x.startMinutes<1440;}).sort(function(a,b){return a.startMinutes-b.startMinutes||a.endMinutes-b.endMinutes;});
  }
  function remaining(timer,now){return !timer?0:timer.paused?Math.max(0,Number(timer.remaining)||0):Math.max(0,Math.ceil((timer.end-now)/1000));}
  function text(value,max,required){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error('Le contenu est vide ou trop long.');return value.trim();}
  function item(raw){
    if(!raw||typeof raw!=='object'||!['note','photo','link','recipe'].includes(raw.kind))throw new Error('Type de contenu non reconnu.');
    var value={id:text(raw.id,80,true),kind:raw.kind,title:text(raw.title,160,true)};
    if(!/^[a-zA-Z0-9_-]+$/.test(value.id))throw new Error('Identifiant invalide.');
    if(raw.kind==='note')value.text=text(raw.text,20000,true);
    if(raw.kind==='link'||raw.kind==='recipe'){
      value.url=raw.url?safeURL(raw.url):'';
      if((raw.kind==='link'||raw.url)&&!value.url)throw new Error('Utilise un lien HTTP ou HTTPS valide.');
    }
    if(raw.kind==='recipe'){
      value.ingredients=text(raw.ingredients,16000,true);value.steps=text(raw.steps,16000,true);
      value.time=Number(raw.time);value.servings=Number(raw.servings);
      if(!Number.isInteger(value.time)||value.time<1||value.time>1440||!Number.isInteger(value.servings)||value.servings<1||value.servings>20)throw new Error('Durée ou nombre de personnes invalide.');
    }
    if(raw.kind==='photo'){
      if(typeof raw.image!=='string'||raw.image.length>1250000||!/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/=]+$/.test(raw.image))throw new Error('La photo doit être une image JPEG préparée par le compagnon.');
      value.image=raw.image;
    }
    return value;
  }
  function transfer(input){
    var raw=typeof input==='string'?JSON.parse(input):input;
    if(!raw||raw.format!=='hub-transfer'||raw.version!==1||!Array.isArray(raw.items)||raw.items.length>MAX_ITEMS)throw new Error('Ce fichier n’est pas un transfert Hub. valide.');
    if(JSON.stringify(raw).length>MAX_BYTES)throw new Error('Ce transfert dépasse 10 Mo.');
    var items=raw.items.map(item),seen=new Set();
    items.forEach(function(x){if(seen.has(x.id))throw new Error('Identifiants en double dans le transfert.');seen.add(x.id);});
    if(items.filter(function(x){return x.kind==='photo';}).length>6)throw new Error('Un transfert peut contenir six photos au maximum.');
    return {format:'hub-transfer',version:1,items:items};
  }
  var dbPromise;
  function db(){if(!dbPromise)dbPromise=new Promise(function(resolve,reject){var req=indexedDB.open('hub.companion',1);req.onupgradeneeded=function(){req.result.createObjectStore('items',{keyPath:'id'});};req.onsuccess=function(){resolve(req.result);};req.onerror=function(){dbPromise=null;reject(new Error('Le stockage de cet appareil est indisponible.'));};req.onblocked=function(){reject(new Error('Ferme les autres fenêtres Hub. puis réessaie.'));};});return dbPromise;}
  async function entries(){var d=await db();return new Promise(function(resolve,reject){var req=d.transaction('items').objectStore('items').getAll();req.onsuccess=function(){resolve(req.result);};req.onerror=function(){reject(new Error('Lecture du carnet impossible.'));};});}
  async function store(items){
    var incoming=transfer({format:'hub-transfer',version:1,items:items}).items,d=await db();
    return new Promise(function(resolve,reject){var tx=d.transaction('items','readwrite'),s=tx.objectStore('items'),req=s.getAll(),added=0;
      req.onsuccess=function(){try{var current=req.result,ids=new Set(current.map(function(x){return x.id;})),fresh=incoming.filter(function(x){return !ids.has(x.id);});transfer({format:'hub-transfer',version:1,items:current.concat(fresh)});fresh.forEach(function(x){s.add(x);added++;});}catch(e){tx.abort();reject(e);}};
      tx.oncomplete=function(){resolve(added);};tx.onerror=function(){reject(new Error('Enregistrement impossible. Le stockage est peut-être plein.'));};tx.onabort=function(){reject(new Error('Le transfert n’a pas été enregistré.'));};
    });
  }
  function id(){return 'item-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);}
  function photo(file){return new Promise(function(resolve,reject){
    if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12000000){reject(new Error('Choisis une photo JPEG, PNG ou WebP de moins de 12 Mo.'));return;}
    var url=URL.createObjectURL(file),img=new Image();
    function release(){URL.revokeObjectURL(url);}
    img.onload=function(){try{if(img.naturalWidth*img.naturalHeight>50000000)throw new Error('La photo est trop grande.');var ratio=Math.min(1,1280/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));var ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);var data=canvas.toDataURL('image/jpeg',.78);if(data.length>1250000)throw new Error('La photo reste trop lourde. Choisis une image plus petite.');release();resolve(data);}catch(e){release();reject(e);}};
    img.onerror=function(){release();reject(new Error('Cette photo ne peut pas être lue.'));};img.src=url;
  });}
  // Three independent, persisted countdowns. IDs are their stable numbered slots.
  function timerRestore(values,legacy){
    var list=Array.isArray(values)?values:legacy?[legacy]:[],used=new Set(),result=[];
    list.slice(0,3).forEach(function(t,i){if(!t||!Number.isFinite(t.end)||t.paused&&(!Number.isFinite(t.remaining)||t.remaining<0||t.remaining>86400))return;var id=String(t.id||i+1);if(!/^[123]$/.test(id)||used.has(id))return;used.add(id);result.push({id:id,end:t.end,label:String(t.label||'Minuteur').slice(0,80),tag:String(t.tag||'').slice(0,40),paused:!!t.paused,remaining:Math.min(86400,Math.max(0,Number(t.remaining)||0)),notified:!!t.notified});});return result;
  }
  function timerStart(values,seconds,label,tag,now){
    if(!Number.isInteger(seconds)||seconds<1||seconds>86400)throw Error('Choisis une durée entre 1 seconde et 24 heures.');
    var list=timerRestore(values);if(list.length===3)throw Error('Les trois minuteurs sont occupés. Termine-en un pour libérer sa place.');
    var id=['1','2','3'].find(function(id){return !list.some(function(t){return t.id===id;});});list.push({id:id,end:now+seconds*1000,label:String(label||'Minuteur').trim().slice(0,80)||'Minuteur',tag:String(tag||'').trim().slice(0,40),paused:false,remaining:seconds,notified:false});return list;
  }
  function timerChange(values,id,command,now){return timerRestore(values).filter(function(t){return command!=='stop'||t.id!==String(id);}).map(function(t){if(t.id!==String(id))return t;var left=remaining(t,now);if(command==='toggle'&&left){t.paused=!t.paused;t.remaining=left;if(!t.paused)t.end=now+left*1000;}if(command==='add'){t.remaining=Math.min(86400,left+60);t.end=now+t.remaining*1000;t.notified=false;}return t;});}
  function alarm(options){
    options=options||{};var Audio=options.AudioContext||root.AudioContext||root.webkitAudioContext,context=null;
    async function unlock(){if(!Audio)return false;try{if(!context||context.state==='closed')context=new Audio();if(context.state==='suspended')await context.resume();return context.state==='running';}catch(_){return false;}}
    async function play(){if(!await unlock())return false;try{var now=context.currentTime;[0,.4,.8,1.6,2,2.4].forEach(function(offset,i){var osc=context.createOscillator(),gain=context.createGain(),at=now+offset;osc.type='sine';osc.frequency.value=i%2?880:660;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.22,at+.025);gain.gain.exponentialRampToValueAtTime(.001,at+.28);osc.connect(gain);gain.connect(context.destination);osc.onended=function(){osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+.3);});return true;}catch(_){return false;}}
    return {unlock:unlock,play:play};
  }
  var api={timers:{restore:timerRestore,start:timerStart,change:timerChange},alarm:alarm,safeURL:safeURL,brief:brief,upcoming:upcoming,remaining:remaining,item:item,transfer:transfer,entries:entries,store:store,id:id,photo:photo};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HubTools=api;
}(typeof window==='undefined'?this:window));
