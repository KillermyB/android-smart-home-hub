import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({module:{exports:{}},AbortController,URLSearchParams,TextDecoder,setTimeout,clearTimeout});
vm.runInContext(readFileSync(new URL('../dist/lyrics.js',import.meta.url),'utf8'),context);
const {create,track,parseLRC,lineAt}=context.module.exports;
const song={type:'track',name:'Synthetic test track',artists:[{name:'Synthetic artist'}],album:{name:'Synthetic album'},duration_ms:120000};
function response(body,status=200,headers={}){return {status,ok:status>=200&&status<300,headers:{get:name=>headers[name.toLowerCase()]??(name.toLowerCase()==='content-type'?'application/json':null)},text:async()=>typeof body==='string'?body:JSON.stringify(body)};}
const record=(extra={})=>({id:42,trackName:song.name,artistName:song.artists[0].name,albumName:song.album.name,duration:120,instrumental:false,plainLyrics:'Synthetic first line\nSynthetic second line',syncedLyrics:'[00:01.000]Synthetic first line\n[00:02.000]Synthetic second line',...extra});

test('LRC expands repeated timestamps, applies global offset and preserves simultaneous and blank cues',()=>{
 const lines=parseLRC('[ar:Test]\n[00:01.0][00:03.000] First synthetic line\n[00:01.000]Another voice\n[00:02.050]\n[offset:+100]\n[00:99.10]invalid');
 assert.deepEqual(Array.from(lines,x=>({timeMs:x.timeMs,text:x.text})),[{timeMs:900,text:'First synthetic line\nAnother voice'},{timeMs:1950,text:''},{timeMs:2900,text:'First synthetic line'}]);
 assert.equal(lineAt(lines,899),-1);assert.equal(lineAt(lines,900),0);assert.equal(lineAt(lines,1950),1);assert.equal(lineAt(lines,99999),2);assert.equal(lineAt(lines,NaN),-1);
 assert.equal(parseLRC('[offset:-250]\n[0:00.01]Synthetic')[0].timeMs,260);
 assert.throws(()=>parseLRC('x'.repeat(128001)),/volumineux/);
});

test('lyrics are fetched only on load with exact metadata and client identification, then cached in memory',async()=>{
 const calls=[];const client=create({fetch:async(url,options)=>{calls.push({url,options});return response(record());}});
 assert.equal(calls.length,0);const result=await client.load(song);assert.equal(result.status,'synced');assert.equal(result.lines.length,2);assert.equal(result.source,'LRCLIB');assert.equal(result.sourceURL,'https://lrclib.net');
 const url=new URL(calls[0].url);assert.equal(url.origin,'https://lrclib.net');assert.equal(url.pathname,'/api/get');assert.equal(url.searchParams.get('track_name'),song.name);assert.equal(url.searchParams.get('artist_name'),'Synthetic artist');assert.equal(url.searchParams.get('album_name'),'Synthetic album');assert.equal(url.searchParams.get('duration'),'120');
 assert.match(calls[0].options.headers['Lrclib-Client'],/Hub\./);assert.equal(calls[0].options.headers.Authorization,undefined);assert.equal(calls[0].options.credentials,'omit');assert.equal(calls[0].options.redirect,'error');
 await client.load(song);assert.equal(calls.length,1);client.clear();await client.load(song);assert.equal(calls.length,2);
 assert.throws(()=>track({...song,type:'episode'}),/morceaux musicaux/);
});

test('plain, instrumental, missing and wrong-signature results remain distinct without fabricated text',async()=>{
 const plain=await create({fetch:async()=>response(record({syncedLyrics:null}))}).load(song);assert.equal(plain.status,'plain');assert.equal(plain.lines.length,0);assert.match(plain.plainText,/Synthetic/);
 const instrumental=await create({fetch:async()=>response(record({instrumental:true,plainLyrics:null,syncedLyrics:null}))}).load(song);assert.equal(instrumental.status,'instrumental');assert.equal(instrumental.plainText,'');assert.equal(instrumental.lines.length,0);
 const missing=await create({fetch:async()=>response(null,404)}).load(song);assert.equal(missing.status,'not-found');assert.equal(missing.plainText,'');
 const wrong=await create({fetch:async()=>response(record({trackName:'Different synthetic track'}))}).load(song);assert.equal(wrong.status,'not-found');assert.equal(wrong.lines.length,0);
 const duration=await create({fetch:async()=>response(record({duration:125}))}).load(song);assert.equal(duration.status,'not-found');
});

test('rate limits honor Retry-After without retrying; malformed and oversized responses reject',async()=>{
 let calls=0;const client=create({fetch:async()=>{calls++;return response('edge error',429,{'retry-after':'60'});}});
 const before=Date.now();await assert.rejects(client.load(song),e=>e.kind==='rate-limit'&&e.retryAt>=before+60000);await assert.rejects(client.load(song),e=>e.kind==='rate-limit');assert.equal(calls,1);
 await assert.rejects(create({fetch:async()=>response('<html>error</html>',200,{'content-type':'text/html'})}).load(song),e=>e.kind==='response');
 await assert.rejects(create({fetch:async()=>response(record(),200,{'content-length':'999999'})}).load(song),e=>e.kind==='response');
 await assert.rejects(create({fetch:async()=>response(record({plainLyrics:'x'.repeat(64001)}))}).load(song),e=>e.kind==='response');
});

test('a new selection can cancel an active lookup, and external abort never caches a stale result',async()=>{
 let started;const ready=new Promise(resolve=>{started=resolve;});const client=create({fetch:async(url,{signal})=>new Promise((resolve,reject)=>{started();signal.addEventListener('abort',()=>{const e=new Error('aborted');e.name='AbortError';reject(e);},{once:true});})});
 const pending=client.load(song);await ready;client.cancel();await assert.rejects(pending,e=>e.kind==='cancelled');
 const controller=new AbortController();controller.abort();let calls=0;await assert.rejects(create({fetch:async()=>{calls++;return response(record());}}).load(song,{signal:controller.signal}),e=>e.kind==='cancelled');assert.equal(calls,0);
});

test('the cache is bounded and network lookups stay sequential',async()=>{
 let current=0,max=0,calls=0;let now=10000;const client=create({now:()=>{now+=1000;return now;},fetch:async(url)=>{current++;max=Math.max(max,current);calls++;const name=new URL(url).searchParams.get('track_name');await Promise.resolve();current--;now+=1000;return response(record({trackName:name}));}});
 for(let i=0;i<13;i++)await client.load({...song,name:'Synthetic '+i});
 await client.load({...song,name:'Synthetic 0'});assert.equal(calls,14);await Promise.all([client.load({...song,name:'Synthetic concurrent A'}),client.load({...song,name:'Synthetic concurrent B'})]);assert.equal(max,1);
});


test('response streaming is bounded and timeout is distinct from a user cancellation',async()=>{
 let cancelled=false,released=false,reads=0;const reader={read:async()=>({done:false,value:new Uint8Array(150000)}),cancel:async()=>{cancelled=true;},releaseLock:()=>{released=true;}};
 await assert.rejects(create({fetch:async()=>({...response(null),body:{getReader:()=>reader}})}).load(song),e=>e.kind==='response');assert.equal(cancelled,true);assert.equal(released,true);
 const slow=create({timeoutMs:1000,fetch:async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{const e=new Error('aborted');e.name='AbortError';reject(e);},{once:true}))});
 await assert.rejects(slow.load(song),e=>e.kind==='timeout');
});

function musicUI(automatic=false){
 const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const source=app.slice(app.indexOf('  var lyricsClient='),app.indexOf('  paths.bag='));
 let calls=0,cancels=0,resolve,reject;const events={};const timers=new Map();let nextTimer=0;
 const cover={classList:{toggle(){}},innerHTML:''},lines={innerHTML:''},bar={value:0},elapsed={textContent:''};
 const browser={read:()=>automatic,HubLyrics:{...context.module.exports,create:()=>({load:()=>{calls++;return new Promise((done,fail)=>{resolve=done;reject=fail;});},cancel:()=>{cancels++;},clear(){}})},music:{data:{item:song,progress_ms:1000,is_playing:true},updated:Date.now()},state:{page:'music',sleep:false,modal:null},document:{hidden:false,activeElement:null,addEventListener(name,fn){events[name]=fn;}},Date,JSON,Number,Math,Promise,setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),$:selector=>selector==='[data-lyrics-cover]'?cover:selector==='.lyrics-lines'?lines:selector==='.playback-progress progress'?bar:selector==='.playback-progress span'?elapsed:null,musicTime:value=>String(Math.floor(value/1000)),action:(name,label)=>'<button>'+label+'</button>',esc:value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),musicArtwork:()=>'<artwork>'};
 const ui=vm.createContext(browser);vm.runInContext(source,ui);
 return {ui,cover,lines,bar,elapsed,timers,events,get calls(){return calls;},get cancels(){return cancels;},finish:value=>resolve(value),fail:error=>reject(error)};
}

test('music UI with automatic lyrics disabled waits for manual action and discards stale results',async()=>{
 const m=musicUI();m.ui.lyricsControls();m.ui.lyricsLifecycle();assert.equal(m.calls,0);assert.equal(m.timers.size,0);
 const pending=m.ui.loadLyrics();assert.equal(m.calls,1);assert.match(m.cover.innerHTML,/Recherche des paroles/);
 m.ui.state.page='home';m.ui.lyricsLifecycle();assert.equal(m.ui.lyricsState.open,false);
 m.finish({status:'plain',plainText:'Synthetic only',lines:[]});await pending;assert.equal(m.ui.lyricsState.result,null);assert.equal(m.timers.size,0);
 m.ui.state.page='music';const next=m.ui.loadLyrics();m.ui.music.data.item={...song,name:'Another synthetic track'};m.ui.lyricsLifecycle();m.finish({status:'plain',plainText:'Old synthetic track',lines:[]});await next;assert.equal(m.ui.lyricsState.result,null);assert.equal(m.calls,2);
});

test('music lyrics update only the local cue and stop timers when paused, hidden or covered',async()=>{
 const m=musicUI();const pending=m.ui.loadLyrics();m.finish({status:'synced',lines:[{timeMs:1000,text:'Synthetic <safe> line'},{timeMs:2000,text:'Synthetic next line'}]});await pending;
 assert.equal(m.timers.size,1);assert.match(m.cover.innerHTML,/&lt;safe&gt;/);assert.equal(m.ui.lyricsState.line,0);
 m.ui.music.data.progress_ms=2000;m.ui.updateLyricsLine();assert.equal(m.ui.lyricsState.line,1);assert.ok(m.bar.value>=2000);assert.equal(m.elapsed.textContent,'2');assert.match(m.lines.innerHTML,/aria-current="true">Synthetic next line/);
 m.ui.music.data.is_playing=false;m.ui.lyricsLifecycle();assert.equal(m.timers.size,0);
 m.ui.music.data.is_playing=true;m.ui.state.modal='settings';m.ui.lyricsLifecycle();assert.equal(m.timers.size,0);
 m.ui.state.modal=null;m.ui.lyricsLifecycle();assert.equal(m.timers.size,1);
 m.ui.document.hidden=true;m.ui.lyricsLifecycle();assert.equal(m.timers.size,0);assert.equal(m.ui.lyricsState.open,false);
});


test('returning from a hidden tab or waking restores artwork without relying on a global render',async()=>{
 const m=musicUI();let pending=m.ui.loadLyrics();m.finish({status:'plain',plainText:'Synthetic local text',lines:[]});await pending;assert.match(m.cover.innerHTML,/Synthetic local text/);
 m.ui.document.hidden=true;m.events.visibilitychange();assert.equal(m.ui.lyricsState.open,false);m.ui.document.hidden=false;m.events.visibilitychange();assert.equal(m.cover.innerHTML,'<artwork>');assert.equal(m.calls,1);
 pending=m.ui.loadLyrics();m.finish({status:'plain',plainText:'Synthetic local text',lines:[]});await pending;m.ui.state.sleep=true;m.ui.lyricsLifecycle();assert.equal(m.cover.innerHTML,'<artwork>');assert.equal(m.ui.lyricsState.open,false);assert.equal(m.calls,2);
});


const settle=async()=>{await Promise.resolve();await Promise.resolve();};
test('automatic music lyrics load once per visible track and never repeat on polls or renders',async()=>{
 const m=musicUI(true);assert.equal(m.calls,0);m.ui.lyricsLifecycle();assert.equal(m.calls,1);assert.equal(m.cover.innerHTML,'<artwork>');
 for(let i=0;i<10;i++){m.ui.lyricsLifecycle();m.ui.paintLyrics();}assert.equal(m.calls,1);
 m.finish({status:'plain',plainText:'Synthetic automatic lyrics',lines:[]});await settle();assert.equal(m.ui.lyricsState.open,true);assert.match(m.cover.innerHTML,/Synthetic automatic lyrics/);
 for(let i=0;i<10;i++)m.ui.lyricsLifecycle();assert.equal(m.calls,1);
 m.ui.music.data.item={...song,name:'Another synthetic automatic track'};m.ui.lyricsLifecycle();assert.equal(m.calls,2);assert.equal(m.ui.lyricsState.busy,true);
 m.finish({status:'not-found',plainText:'',lines:[]});await settle();assert.equal(m.ui.lyricsState.open,false);assert.equal(m.cover.innerHTML,'<artwork>');assert.match(m.ui.lyricsControls(),/Paroles indisponibles/);assert.match(m.ui.lyricsControls(),/Réessayer les paroles/);
 for(let i=0;i<10;i++){m.ui.lyricsLifecycle();m.ui.paintLyrics();}assert.equal(m.calls,2);
});

test('automatic lyrics respect per-track artwork choice and resume after hidden cancellation',async()=>{
 const m=musicUI(true);m.ui.lyricsLifecycle();m.finish({status:'plain',plainText:'Synthetic automatic lyrics',lines:[]});await settle();m.ui.hideLyrics();assert.equal(m.ui.lyricsState.open,false);assert.equal(m.cover.innerHTML,'<artwork>');
 m.ui.state.page='home';m.ui.lyricsLifecycle();m.ui.state.page='music';m.ui.lyricsLifecycle();assert.equal(m.calls,1);
 m.ui.music.data.item={...song,name:'New synthetic track'};m.ui.lyricsLifecycle();assert.equal(m.calls,2);const stale=m.finish;
 m.ui.document.hidden=true;m.events.visibilitychange();assert.equal(m.ui.lyricsState.busy,false);stale({status:'plain',plainText:'Stale synthetic words',lines:[]});await settle();assert.equal(m.ui.lyricsState.result,null);
 m.ui.document.hidden=false;m.events.visibilitychange();assert.equal(m.calls,3);m.finish({status:'instrumental',plainText:'',lines:[]});await settle();assert.equal(m.cover.innerHTML,'<artwork>');assert.match(m.ui.lyricsControls(),/instrumental selon LRCLIB/);assert.equal(m.ui.lyricsState.open,false);
});

test('automatic lyric errors keep artwork, allow manual retry and remain dormant behind settings',async()=>{
 const m=musicUI(true);m.ui.state.modal='music-config';m.ui.lyricsLifecycle();assert.equal(m.calls,0);m.ui.state.modal=null;m.ui.lyricsLifecycle();assert.equal(m.calls,1);
 m.fail(new Error('Synthetic service unavailable'));await settle();assert.equal(m.cover.innerHTML,'<artwork>');assert.match(m.ui.lyricsControls(),/Synthetic service unavailable/);m.ui.lyricsLifecycle();assert.equal(m.calls,1);
 const manual=m.ui.loadLyrics();assert.equal(m.calls,2);m.finish({status:'plain',plainText:'Synthetic retry text',lines:[]});await manual;assert.equal(m.ui.lyricsState.open,true);
 m.ui.lyricsAuto=false;m.ui.hideLyrics();m.ui.music.data.item={...song,name:'Disabled automatic track'};m.ui.lyricsLifecycle();assert.equal(m.calls,2);assert.equal(m.ui.lyricsState.open,false);
});
