/* Portable personal data only. Account sessions and active timers are excluded. */
(function(root){'use strict';
var keys=['theme','idle','quoteCategory','quoteRotation','lyricsAuto','timerSound','morningBrief','githubUser','taskScope','preferences','weatherLocation','remoteTargets','boardNotes','favorites','hiddenRecipes','recipes','shopping','tasks','meals','mealPlan','transitStation','departureRoutes','spotifyHome','leaveIds','robotRoomScripts'];
function plain(v){return v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype;}
function walk(v,depth){if(depth>14)throw Error('Sauvegarde trop complexe.');if(typeof v==='string'&&v.length>100000)throw Error('Texte trop long.');if(typeof v==='number'&&!Number.isFinite(v))throw Error('Nombre invalide.');if(v&&typeof v==='object'){if(!Array.isArray(v)&&!plain(v))throw Error('Objet invalide.');if(Object.keys(v).length>2500)throw Error('Trop d’éléments.');Object.keys(v).forEach(function(k){if(['__proto__','constructor','prototype'].includes(k)||/^(?:token|secret|password|authorization|access_token|refresh_token|apiKey|accessKey)$/i.test(k))throw Error('Cette sauvegarde contient un champ interdit.');walk(v[k],depth+1);});}}
function checked(key,v){
 if(['lyricsAuto','timerSound','morningBrief'].includes(key)&&typeof v!=='boolean')throw Error('Préférence invalide.');
 if(key==='theme'&&!['light','dark'].includes(v)||key==='taskScope'&&!['all','today'].includes(v)||key==='quoteCategory'&&!['Toutes','Stoïcisme','Littérature','Philosophie'].includes(v))throw Error('Choix invalide.');
 if(key==='idle'&&![0,60,120,300].includes(v)||key==='quoteRotation'&&![0,60,300,900].includes(v))throw Error('Durée invalide.');
 if(['githubUser','spotifyHome'].includes(key)&&(typeof v!=='string'||v.length>100))throw Error('Nom invalide.');
 if(key==='weatherLocation'&&(!plain(v)||typeof v.name!=='string'||!v.name.trim()||v.name.length>200||!Number.isFinite(v.latitude)||Math.abs(v.latitude)>90||!Number.isFinite(v.longitude)||Math.abs(v.longitude)>180))throw Error('Lieu météo invalide.');
 if(key==='preferences')return root.HubPreferences.normalize(v);
 if(key==='remoteTargets')return root.HubRemoteTargets.normalize(v);
 if(['boardNotes','favorites','hiddenRecipes','recipes','shopping','tasks','leaveIds'].includes(key)&&(!Array.isArray(v)||v.length>(key==='boardNotes'?12:1000)))throw Error('Liste invalide.');
 if(['favorites','hiddenRecipes','leaveIds'].includes(key)&&v.some(function(x){return typeof x!=='string'||x.length>160;}))throw Error('Identifiant invalide.');
 if(key==='boardNotes'&&v.some(function(n){return !plain(n)||typeof n.id!=='string'||n.id.length>100||typeof n.text!=='string'||!n.text.trim()||n.text.length>1000||typeof n.pinned!=='boolean'||!Number.isSafeInteger(n.created);}))throw Error('Note invalide.');
 if(key==='recipes'&&v.some(function(r){return !plain(r)||typeof r.id!=='string'||typeof r.title!=='string'||!Number.isFinite(r.servings)||r.servings<1||r.servings>20||!Number.isFinite(r.time)||!Array.isArray(r.ingredients)||r.ingredients.length>200||r.ingredients.some(function(i){return !plain(i)||typeof i.name!=='string'||typeof i.unit!=='string'||!Number.isFinite(i.qty)||i.qty<0;})||!Array.isArray(r.steps)||r.steps.length>100||r.steps.some(function(s){return !plain(s)||typeof s.text!=='string'||s.timer!==undefined&&(!Number.isFinite(s.timer)||s.timer<0);});}))throw Error('Recette invalide.');
 if(key==='shopping'&&v.some(function(i){return !plain(i)||typeof i.label!=='string'||typeof i.done!=='boolean';}))throw Error('Article invalide.');
 if(key==='tasks'&&v.some(function(i){return !plain(i)||typeof i.id!=='string'||typeof i.content!=='string';}))throw Error('Tâche invalide.');
 if(['meals','mealPlan','departureRoutes','robotRoomScripts'].includes(key)&&!plain(v))throw Error('Réglage invalide.');
 if(key==='transitStation'&&(!plain(v)||typeof v.name!=='string'||typeof v.id!=='string'))throw Error('Arrêt invalide.');
 return v;
}
function validate(packet){
 if(!plain(packet)||packet.format!=='hub-personal-backup'||packet.version!==1||!Number.isSafeInteger(packet.created)||!plain(packet.settings)||Object.keys(packet).some(function(k){return !['format','version','created','settings'].includes(k);}))throw Error('Fichier de sauvegarde Hub non reconnu.');
 if(JSON.stringify(packet).length>6000000)throw Error('Sauvegarde trop volumineuse (6 Mo maximum).');walk(packet,0);var settings={};Object.keys(packet.settings).forEach(function(k){if(!keys.includes(k))throw Error('Ce réglage n’est pas importable.');settings[k]=checked(k,packet.settings[k]);});return {format:packet.format,version:1,created:packet.created,settings:settings};
}
function capture(storage,now){var settings={};keys.forEach(function(k){var raw=storage.getItem('hub.'+k);if(raw!==null)settings[k]=JSON.parse(raw);});if(!settings.weatherLocation){var weather;try{weather=JSON.parse(storage.getItem('hub.weather'));}catch(_){}if(weather&&typeof weather.city==='string')settings.weatherLocation={name:weather.city,latitude:weather.latitude,longitude:weather.longitude};}return validate({format:'hub-personal-backup',version:1,created:now==null?Date.now():now,settings:settings});}
function restore(storage,value){var packet=validate(value),previous={},writes=[];Object.keys(packet.settings).forEach(function(k){var key='hub.'+k;previous[key]=storage.getItem(key);var v=packet.settings[k];if(['boardNotes','recipes','tasks'].includes(k)&&previous[key]){var current;try{current=JSON.parse(previous[key]);}catch(_){current=[];}if(Array.isArray(current)){var seen=new Set();v=current.concat(v).filter(function(item){if(seen.has(item.id))return false;seen.add(item.id);return true;});if(k==='boardNotes'&&v.length>12)throw Error('La fusion dépasserait les 12 notes. Retire une note avant de restaurer.');}}writes.push([key,JSON.stringify(v)]);});
 try{writes.forEach(function(entry){storage.setItem(entry[0],entry[1]);});}catch(e){Object.keys(previous).forEach(function(k){try{storage.removeItem(k);}catch(_){}});Object.keys(previous).forEach(function(k){try{if(previous[k]!==null)storage.setItem(k,previous[k]);}catch(_){}});throw Error('Stockage insuffisant : restauration annulée.');}return packet;
}
root.HubPersonalBackup={keys:keys,capture:capture,validate:validate,restore:restore};
})(typeof window==='undefined'?globalThis:window);
