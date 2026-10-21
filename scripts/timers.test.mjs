import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function tools(extra={}){const c=vm.createContext({module:{exports:{}},...extra});vm.runInContext(readFileSync(new URL('../dist/hub-tools.js',import.meta.url),'utf8'),c);return c.module.exports;}
test('three numbered timers retain independent labels, tags and paused durations after reload',()=>{
 const api=tools(),t=api.timers;let list=t.restore(null,{end:61000,label:'Pâtes',tag:'Étape 1'});assert.equal(list[0].id,'1');
 list=t.start(list,120,'Linge','Lavage',1000);list=t.start(list,180,'Assiettes','Lave-vaisselle',1000);assert.equal(list.length,3);assert.deepEqual(Array.from(list,x=>x.id),['1','2','3']);assert.throws(()=>t.start(list,20,'Extra','',1000));
 list=t.change(list,'2','toggle',21000);assert.equal(api.remaining(list[1],200000),100);assert.equal(api.remaining(list[0],21000),40);assert.equal(list[2].tag,'Lave-vaisselle');
 list=t.restore(JSON.parse(JSON.stringify(list)));list=t.change(list,'2','toggle',50000);assert.equal(list[1].end,150000);assert.equal(api.remaining(list[2],50000),131);
 list=t.change(list,'1','stop',50000);list=t.start(list,10,'Thé','Pause',50000);assert.equal(list[2].id,'1');assert.equal(list[0].label,'Linge');
});
test('expired timers stay dismissible and extending one never restarts another',()=>{
 const {timers:t,remaining}=tools();let list=t.start([],1,'Un','',0);list=t.start(list,2,'Deux','',0);list=t.change(list,'1','add',4000);assert.equal(remaining(list[0],4000),60);assert.equal(remaining(list[1],4000),0);assert.equal(list[0].notified,false);
 for(const sec of [0,-1,1.2,86401,NaN])assert.throws(()=>t.start([],sec,'','',0));assert.equal(t.restore([{id:'1',end:NaN}]).length,0);assert.equal(t.restore([{id:'1',end:1000},{id:'1',end:2000}]).length,1);
});
test('timer notification is louder, finite and shared by simultaneous deadlines',async()=>{
 const notes=[],levels=[];let resumes=0,disconnected=0,context;
 class Audio{
  constructor(){context=this;this.state='suspended';this.currentTime=2;this.destination={};}
  async resume(){resumes++;this.state='running';}
  createOscillator(){const osc={frequency:{},connect(){},disconnect(){disconnected++;},start(t){notes.push({osc,start:t});},stop(t){notes.find(n=>n.osc===osc).stop=t;}};return osc;}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(value){levels.push(value);},exponentialRampToValueAtTime(){}},connect(){},disconnect(){disconnected++;}};}
 }
 const alarm=tools().alarm({AudioContext:Audio});assert.equal(await alarm.unlock(),true);assert.equal(await alarm.play(),true);assert.equal(resumes,1);
 assert.ok(Math.max(...levels)>=.45,'notification has a stronger attack than the old .22 alert');
 assert.ok(notes.length>0);for(const note of notes){assert.ok(note.stop>note.start);assert.ok(note.stop<=3.9);assert.ok(note.osc.frequency.value>=600&&note.osc.frequency.value<=3000);}
 const count=notes.length;assert.equal(await alarm.play(),true);assert.equal(notes.length,count,'simultaneous deadlines must not stack audio');
 notes.forEach(n=>n.osc.onended());assert.equal(disconnected,count*2);
 context.currentTime=4;assert.equal(await alarm.play(),true);assert.equal(notes.length,count*2,'later alerts remain audible');
 context.state='closed';assert.equal(await alarm.play(),true);assert.equal(notes.length,count*3,'recreating the audio context must not suppress the next alert');
 assert.equal(await tools().alarm().play(),false);
});

test('laundry and dryer presets keep exact household durations and hourly labels',()=>{
 const c=vm.createContext({});vm.runInContext(readFileSync(new URL('../dist/timer-presets.js',import.meta.url),'utf8'),c);const p=c.HubTimerPresets;assert.equal(p.find('laundry').minutes*60,3900);assert.equal(p.find('dryer').minutes*60,6900);assert.equal(p.duration(65),'1 h 05');assert.equal(p.duration(115),'1 h 55');
 const t=tools().timers;let list=t.start([],3900,'Lessive','Lavage',1000),instance=list[0].instance;list=t.change(list,'1','add',2000);assert.equal(list[0].instance,instance);assert.equal(t.restore(JSON.parse(JSON.stringify(list)))[0].instance,instance);list=t.change(list,'1','stop',2000);list=t.start(list,6900,'Sèche-linge','Lavage',2000);assert.notEqual(list[0].instance,instance);assert.equal(list[0].id,'1');
});

test('swipe removal requires a deliberate horizontal left gesture and leaves scrolling alone',()=>{const c=vm.createContext({});vm.runInContext(readFileSync(new URL('../dist/remote-gestures.js',import.meta.url),'utf8'),c);const f=c.HubRemoteGestures.committed;assert.equal(f(-100,8,320),true);for(const [dx,dy] of [[-25,0],[-100,120],[100,0],[-50,60]])assert.equal(f(dx,dy,320),false);});

test('touch capture transfer from a timer child preserves its swipe until pointer release',()=>{
 const c=vm.createContext({});vm.runInContext(readFileSync(new URL('../dist/remote-gestures.js',import.meta.url),'utf8'),c);const handlers={},removed=[],node={addEventListener:(name,fn)=>handlers[name]=fn},row={dataset:{swipeTimer:'1',timerInstance:'first'},style:{},classList:{add(){},remove(){}},getAttribute:()=>null,getBoundingClientRect:()=>({width:320}),setPointerCapture:id=>handlers.lostpointercapture({target:child,pointerId:id})},child={closest:selector=>selector==='button'?null:row};c.HubRemoteGestures.bind(node,(...x)=>removed.push(x));handlers.pointerdown({isPrimary:true,button:0,pointerId:7,clientX:200,clientY:100,target:child});handlers.pointermove({pointerId:7,clientX:100,clientY:103,preventDefault(){}});handlers.pointerup({pointerId:7});assert.deepEqual(removed,[['1','first']]);assert.equal(row.style.transform,'');
});
