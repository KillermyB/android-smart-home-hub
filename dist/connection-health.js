(function(root){'use strict';
var names={spotify:'Spotify',todoist:'Todoist',homeAssistant:'Home Assistant'};
function create(saved,now){now=now||Date.now;var successes={};Object.keys(names).forEach(function(id){var t=Number(saved&&saved[id]);if(Number.isSafeInteger(t)&&t>0&&t<=now()+30000)successes[id]=t;});
 function success(id,at){at=at==null?now():at;if(names[id]&&Number.isSafeInteger(at)&&at>0&&at<=now()+30000)successes[id]=Math.max(successes[id]||0,at);}
 function rows(states){return Object.keys(names).map(function(id){var s=states[id]||{},last=successes[id]||0,age=last?Math.max(0,now()-last):null,stale=s.configured&&!s.live&&age!==null&&age>300000,status=s.error?'error':!s.configured?'off':s.connecting?'connecting':stale?'stale':last?'ok':'checking';return {id:id,name:names[id],status:status,lastSuccess:last,issue:status==='error'||status==='stale',label:{error:'Indisponible',off:'À connecter',connecting:'Connexion en cours',stale:'À actualiser',ok:'À jour',checking:'Vérification en cours'}[status]};});}
 return {success:success,rows:rows,saved:function(){return Object.assign({},successes);}};
}
root.HubConnectionHealth={create:create};
})(typeof window==='undefined'?globalThis:window);
