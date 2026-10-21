(function(root){
  'use strict';
  function encode(value){var bytes=new TextEncoder().encode(JSON.stringify(value)),s='';bytes.forEach(function(x){s+=String.fromCharCode(x);});return btoa(s);}
  function decode(value){if(typeof value!=='string'||value.length>90000)throw Error('Réponse trop grande.');return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(value),function(x){return x.charCodeAt(0);})));}
  function text(value,max){return typeof value==='string'&&value.trim().length>0&&value.length<=max&&!/[\u0000-\u0008\u000b-\u001f]/.test(value);}
  function validate(c,now){
    if(!c||Object.getPrototypeOf(c)!==Object.prototype||!(/^[a-f0-9]{32}$/).test(c.id)||!Number.isSafeInteger(c.created)||c.created>(now||Date.now())+10000||(now||Date.now())-c.created>30000)throw Error('La demande a expiré.');
    var fields={note:['text','pin'],timer:['seconds','label','tag'],light:['entity','on'],task:['task']}[c.type];
    if(!fields||Object.keys(c).some(function(k){return ['id','created','type'].concat(fields).indexOf(k)<0;}))throw Error('Action non autorisée.');
    if(c.type==='note'&&(!text(c.text,400)||typeof c.pin!=='boolean'))throw Error('Note invalide.');
    if(c.type==='timer'&&(!Number.isInteger(c.seconds)||c.seconds<1||c.seconds>86400||!text(c.label,60)||typeof c.tag!=='string'||c.tag.length>40))throw Error('Minuteur invalide.');
    if(c.type==='light'&&(!(/^(light|switch)\.[a-z0-9_]+$/).test(c.entity)||typeof c.on!=='boolean'))throw Error('Lampe invalide.');
    if(c.type==='task'&&!(typeof c.task==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(c.task)))throw Error('Tâche invalide.');
    return c;
  }
  function snapshot(value){
    var data=JSON.parse(JSON.stringify(value)),tasks=data.tasks,lights=data.lights;
    data.tasksTotal=value.tasksTotal||tasks.length;data.lightsTotal=value.lightsTotal||lights.length;data.tasks=[];data.lights=[];
    // Conservative per-record budget: linear work, including long UTF-8 titles.
    var budget=60000-encode(data).length;
    function append(list,source){for(var item of source){var cost=encode(item).length+8;if(cost>budget)break;budget-=cost;list.push(item);}}
    append(data.lights,lights);append(data.tasks,tasks);return data;
  }
  function id(){var a=new Uint8Array(16);root.crypto.getRandomValues(a);return Array.from(a,function(x){return x.toString(16).padStart(2,'0');}).join('');}
  async function request(fetcher,key,op,commandId,payload){
    if(!/^[a-f0-9]{64}$/.test(key))throw Error('Scanne le code dans les réglages du cadre.');
    var controller=new AbortController(),timeout=setTimeout(function(){controller.abort();},10000);
    try{var r=await fetcher('/cgi-bin/remote.cgi',{method:'POST',credentials:'omit',cache:'no-store',referrerPolicy:'same-origin',headers:{'Content-Type':'text/plain'},body:[key,op,commandId||'-',payload||'-'].join('\n'),signal:controller.signal});var result=await r.json();if(!r.ok)throw Error(result.error||'Le cadre est indisponible.');return result;}finally{clearTimeout(timeout);}
  }
  root.HubRemote={snapshot:snapshot,encode:encode,decode:decode,validate:validate,id:id,request:request};
})(typeof window!=='undefined'?window:globalThis);
