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
test('timer alarm resumes audio after interaction and schedules a bounded six-note alert',async()=>{
 const notes=[];let resumes=0;class Audio{constructor(){this.state='suspended';this.currentTime=2;this.destination={};}async resume(){resumes++;this.state='running';}createOscillator(){return {frequency:{},connect(){},disconnect(){},start(t){notes.push(['start',t]);},stop(t){notes.push(['stop',t]);}};}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}}
 const alarm=tools().alarm({AudioContext:Audio});assert.equal(await alarm.unlock(),true);assert.equal(await alarm.play(),true);assert.equal(resumes,1);assert.equal(notes.filter(n=>n[0]==='start').length,6);assert.ok(notes.at(-1)[1]<5);assert.equal(await tools().alarm().play(),false);
});
