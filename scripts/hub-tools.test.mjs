import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({module:{exports:{}},URL});
vm.runInContext(readFileSync(new URL('../dist/hub-tools.js',import.meta.url),'utf8'),context);
const tools=context.module.exports;

test('brief excludes past appointments and ranks exactly three open priorities',()=>{
  const events=[{title:'past',date:'2026-10-20',start:'08:00',end:'09:00'},{title:'ongoing',date:'2026-10-20',start:'10:00',end:'11:00'},{title:'future',date:'2026-10-20',start:'11:00',end:'12:00'},{title:'tomorrow',date:'2026-10-21',start:'09:00',end:'10:00'}];
  const tasks=[{id:'low',priority:1},{id:'done',priority:4,done:true},{id:'high',priority:4},{id:'medium1',priority:2},{id:'medium2',priority:2}];
  const result=tools.brief(events,tasks,new Date('2026-10-20T08:30:00Z'),'2026-10-20');
  assert.equal(result.next.title,'ongoing');assert.equal(result.ongoing,true);
  assert.deepEqual(Array.from(result.priorities,x=>x.id),['high','medium1','medium2']);
  const late=tools.brief(events,[],new Date('2026-10-20T14:00:00Z'),'2026-10-20');assert.equal(late.next,null);
});

test('timer survives absolute time and pause without drifting while paused',()=>{
  const timer={end:10000};assert.equal(tools.remaining(timer,8500),2);assert.equal(tools.remaining(timer,12000),0);
  assert.equal(tools.remaining({paused:true,remaining:37,end:0},999999),37);assert.equal(tools.remaining(null,100),0);
});

test('transfer accepts offline content and rejects executable URLs, photos and duplicate IDs',()=>{
  const note={id:'note-1',kind:'note',title:'À penser',text:'Un peu de lecture.'};
  const packet={format:'hub-transfer',version:1,items:[note]};assert.equal(tools.transfer(JSON.stringify(packet)).items[0].text,note.text);
  for(const url of ['javascript:alert(1)','data:text/html,hello','file:///etc/passwd','https://user:secret@example.org'])assert.equal(tools.safeURL(url),null);
  assert.equal(tools.safeURL('https://example.org/recipe?a=1'),'https://example.org/recipe?a=1');
  assert.throws(()=>tools.item({id:'x',kind:'link',title:'No',url:'javascript:alert(1)'}));
  assert.throws(()=>tools.transfer({...packet,items:[note,note]}));assert.throws(()=>tools.transfer({...packet,version:2}));
  assert.throws(()=>tools.item({id:'x',kind:'photo',title:'SVG',image:'data:image/svg+xml,<svg onload=alert(1)>'}));
  assert.throws(()=>tools.item({id:'x',kind:'recipe',title:'Bad',ingredients:'A',steps:'B',time:-1,servings:2}));
  const parsed=tools.item({...note,password:'never-export-this',__proto__:{polluted:true}});assert.equal(parsed.password,undefined);assert.equal(parsed.polluted,undefined);
});

test('20 budget recipes have no pork ingredient, complete steps and individual sources',()=>{
  const c=vm.createContext({});c.window=c;
  for(const file of ['data.js','budget-recipes.js'])vm.runInContext(readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'),c);
  const recipes=c.HUB_DATA.recipes,budget=recipes.filter(r=>r.budget);
  assert.equal(recipes.length,32);assert.equal(budget.length,20);assert.equal(new Set(recipes.map(r=>r.id)).size,32);
  budget.forEach(r=>{assert.equal(r.noPork,true);assert.equal(r.easy,true);assert.ok(r.time<=40);assert.equal(r.servings,2);assert.ok(r.ingredients.length>=4);assert.ok(r.steps.length>=2);assert.equal(new URL(r.source).hostname,'www.mangerbouger.fr');assert.ok(!/\b(porc|jambon|lardons?|bacon|chorizo|pancetta|saucisson)\b/i.test(r.ingredients.map(i=>i.name).join(' ')));assert.ok(r.steps.every(s=>s.text.length>20));});
});
