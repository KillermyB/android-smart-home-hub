import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const context=vm.createContext({module:{exports:{}},AbortController,setTimeout,clearTimeout,URL,URLSearchParams});
vm.runInContext(readFileSync(new URL('../dist/connectors.js',import.meta.url),'utf8'),context);
const {spotify}=context.module.exports;
const response=(body,status=200)=>({ok:status>=200&&status<300,status,headers:{get:()=>null},text:async()=>JSON.stringify(body)});
const uri='spotify:track:0123456789ABCDEFGHIJKL';
const track={id:'0123456789ABCDEFGHIJKL',type:'track',uri,name:'Un morceau',duration_ms:180000,artists:[{name:'Un artiste'}],album:{name:'Album',images:[{url:'https://i.scdn.co/image/test'},{url:'javascript:alert(1)'},{url:'https://user:pass@example.test/image'}]}};
function memory(){const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};}
function client(fetch){const storage=memory();storage.setItem('hub.spotify.token',JSON.stringify({access_token:'test-only',expires:Date.now()+3600000}));return spotify({storage,persistentStorage:memory(),fetch});}

test('Spotify queue normalizes tracks and episodes, bounds list size and strips unsafe images',async()=>{
 const calls=[],episode={id:'episode',type:'episode',uri:'spotify:episode:0123456789ABCDEFGHIJKL',name:'Épisode',duration_ms:1000,show:{name:'Podcast',publisher:'Auteur',images:[{url:'https://example.test/episode.jpg'}]}};
 const api=client(async(url,options)=>{calls.push({url,options});return response({currently_playing:track,queue:[episode,...Array(25).fill(track)]});});
 const result=await api.queue();assert.equal(result.current.name,'Un morceau');assert.equal(result.items.length,20);assert.equal(result.items[0].artists[0].name,'Auteur');assert.equal(result.items[0].type,'episode');assert.equal(result.current.album.images.length,1);assert.equal(result.current.uri,uri);assert.equal(result.current.is_playable,true);
 assert.equal(calls[0].url,'https://api.spotify.com/v1/me/player/queue');assert.equal(calls[0].options.headers.Authorization,'Bearer test-only');assert.equal(calls[0].options.credentials,'omit');
});

test('Spotify queue keeps local or unavailable items visible but not playable',async()=>{
 const api=client(async()=>response({currently_playing:null,queue:[{...track,is_local:true,uri:'spotify:local:one'},null,{private:'must not echo'}, {...track,is_playable:false}]}));
 const result=await api.queue();assert.equal(result.current,null);assert.equal(result.items.length,2);assert.equal(result.items[0].is_playable,false);assert.equal(result.items[0].uri,'');assert.equal(result.items[1].is_playable,false);
 const bad=client(async()=>response({private:'provider-secret'}));await assert.rejects(bad.queue(),e=>e.message.includes('File Spotify')&&!e.message.includes('provider-secret'));
 const idle=client(async()=>response(null,204));assert.equal((await idle.queue()).items.length,0);
});

test('Spotify starts only an explicit validated track or episode with one request and no retry',async()=>{
 const calls=[];const api=client(async(url,options)=>{calls.push({url,options});return response(null,204);});
 for(const invalid of ['https://open.spotify.com/track/a','spotify:playlist:0123456789ABCDEFGHIJKL','spotify:track:abc','spotify:track:0123456789ABCDEFGHIJKL?x=1'])await assert.rejects(api.playTrack(invalid),/Choisis un titre/);
 assert.equal(calls.length,0);await api.playTrack(uri);assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.spotify.com/v1/me/player/play');assert.equal(calls[0].options.method,'PUT');assert.deepEqual(JSON.parse(calls[0].options.body),{uris:[uri]});
 const denied=client(async()=>response({},403));await assert.rejects(denied.playTrack(uri),/accès refusé/);
 const limited=client(async()=>response({},429));await assert.rejects(limited.queue(),e=>e.status===429&&e.retryAfter===60000);
});

test('Spotify queue ignores a response from a disconnected or replaced session',async()=>{
 let finish,started;const began=new Promise(resolve=>started=resolve);
 const api=client(async()=>{started();return new Promise(resolve=>finish=resolve);});
 const pending=api.queue();await began;api.disconnect();finish(response({currently_playing:track,queue:[track]}));await assert.rejects(pending,/connexion Spotify a changé/);
});
