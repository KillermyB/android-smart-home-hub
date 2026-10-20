/* Offline device association. The exported file contains authenticated ciphertext only. */
(function(root){
'use strict';
var encoder=new TextEncoder(),decoder=new TextDecoder(),tag=encoder.encode('hub-spotify-link-v1');
function encode(bytes){return btoa(String.fromCharCode.apply(null,new Uint8Array(bytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function decode(text){if(typeof text!=='string'||!/^[A-Za-z0-9_-]+$/.test(text))throw Error('Fichier ou code d’association invalide.');var raw=atob(text.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,function(c){return c.charCodeAt(0);});}
function token(value){
 if(!value||typeof value!=='object'||!Number.isFinite(value.expires)||!/^[a-f0-9]{32}$/i.test(value.client_id||''))throw Error('Connexion Spotify invalide.');
 ['access_token','refresh_token'].forEach(function(k){if(typeof value[k]!=='string'||!value[k].length||value[k].length>8192||/[\x00-\x20]/.test(value[k]))throw Error('Connexion Spotify incomplète. Reconnecte le compte avant de l’associer.');});
 return {access_token:value.access_token,refresh_token:value.refresh_token,expires:value.expires,client_id:value.client_id};
}
async function encrypt(value,now){
 var session=token(value),raw=crypto.getRandomValues(new Uint8Array(32)),iv=crypto.getRandomValues(new Uint8Array(12)),at=now==null?Date.now():now;
 var key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt']);
 var body=encoder.encode(JSON.stringify({token:session,expires:at+10*60000}));
 var sealed=await crypto.subtle.encrypt({name:'AES-GCM',iv:iv,additionalData:tag},key,body);
 return {code:encode(raw),packet:{format:'hub-spotify-link',version:1,iv:encode(iv),data:encode(sealed)}};
}
async function decrypt(packet,code,now){
 if(!packet||packet.format!=='hub-spotify-link'||packet.version!==1||typeof packet.data!=='string'||packet.data.length>32000||typeof code!=='string'||code.length!==43)throw Error('Fichier ou code d’association invalide.');
 var raw=decode(code),iv=decode(packet.iv),sealed=decode(packet.data);if(raw.length!==32||iv.length!==12)throw Error('Fichier ou code d’association invalide.');
 var opened;
 try{var key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);var bytes=await crypto.subtle.decrypt({name:'AES-GCM',iv:iv,additionalData:tag},key,sealed);opened=JSON.parse(decoder.decode(bytes));}catch(_){throw Error('Le code ne correspond pas au fichier, ou le fichier a été modifié.');}
 var at=now==null?Date.now():now;if(!opened||!Number.isFinite(opened.expires)||opened.expires<at||opened.expires>at+11*60000)throw Error('Cette association a expiré. Crée un nouveau fichier depuis l’appareil connecté.');
 return token(opened.token);
}
var api={encrypt:encrypt,decrypt:decrypt,token:token};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HubSpotifyLink=api;
}(typeof window==='undefined'?this:window));
