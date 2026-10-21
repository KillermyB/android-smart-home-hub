(function(root){'use strict';
var tiles=[['clock','Horloge'],['weather','Météo'],['tasks','Priorités'],['agenda','Prochaines 24 h'],['meal','Repas'],['music','Musique'],['note','Note et citation'],['github','Contributions']];
var sleep=[['date','Date'],['weather','Météo'],['appointment','Prochain rendez-vous'],['quote','Citation'],['music','Musique']];
function normalize(value){
 value=value&&typeof value==='object'?value:{};var ids=tiles.map(function(t){return t[0];}),order=['clock'];
 (Array.isArray(value.order)?value.order:ids).concat(ids).forEach(function(id){if(ids.includes(id)&&!order.includes(id))order.push(id);});
 var hidden=Array.isArray(value.hidden)?value.hidden.filter(function(id){return ids.includes(id)&&id!=='clock';}):[],standby={};
 sleep.forEach(function(t){standby[t[0]]=!(value.standby&&value.standby[t[0]]===false);});return {order:order,hidden:Array.from(new Set(hidden)),standby:standby};
}
function custom(value){var p=normalize(value);return p.hidden.length>0||p.order.join(',')!==tiles.map(function(t){return t[0];}).join(',');}
function move(value,id,delta){var p=normalize(value),i=p.order.indexOf(id),next=i+delta;if(id!=='clock'&&[-1,1].includes(delta)&&i>0&&next>0&&next<p.order.length){p.order.splice(i,1);p.order.splice(next,0,id);}return p;}
root.HubPreferences={tiles:tiles,sleep:sleep,normalize:normalize,custom:custom,move:move};
})(typeof window==='undefined'?globalThis:window);
