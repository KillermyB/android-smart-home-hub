(function(root){'use strict';
var labels={salon:'Écran salon',mirror:'Miroir'};
function url(value){if(value===''||value==null)return '';try{var u=new URL(value),h=u.hostname.toLowerCase(),p=h.split('.').map(Number),local=/^[a-z0-9-]+$/.test(h)||h.endsWith('.local')||p.length===4&&p.every(function(n){return Number.isInteger(n)&&n>=0&&n<=255;})&&(p[0]===10||p[0]===192&&p[1]===168||p[0]===172&&p[1]>=16&&p[1]<=31);if(!local||!['http:','https:'].includes(u.protocol)||u.username||u.password||u.search||u.hash||u.href.length>2048)throw Error();return u.href;}catch(_){throw Error('Utilise une adresse locale HTTP(S), sans clé, identifiant ni paramètre.');}}
function normalize(value){var out={};Object.keys(labels).forEach(function(id){out[id]=url(value&&value[id]||'');});return out;}
root.HubRemoteTargets={labels:labels,url:url,normalize:normalize};
})(typeof window==='undefined'?globalThis:window);
