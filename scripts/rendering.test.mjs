import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const section=(start,end)=>app.slice(app.indexOf(start),app.indexOf(end,app.indexOf(start)));

test('stable music progress never rereads layout or rewrites perimeter geometry',()=>{
  let layout=0,styles=0,paths=0,viewboxes=0,resize;
  const ctx=vm.createContext({getComputedStyle(){styles++;return {borderTopLeftRadius:'25px'};},ResizeObserver:class{constructor(fn){resize=fn;}observe(){}disconnect(){}}});
  vm.runInContext(readFileSync(new URL('../dist/music-orbit.js',import.meta.url),'utf8'),ctx);
  const path={setAttribute(){paths++;}},line={style:{},setAttribute(){}};
  const svg={parentNode:{},progress:0,getBoundingClientRect(){layout++;return {width:300,height:180};},getAttribute(){return this.progress;},setAttribute(){viewboxes++;},querySelectorAll:()=>[path,path],querySelector:()=>line};
  ctx.HubMusicOrbit.mount(svg);
  for(let i=0;i<60;i++){svg.progress=i;ctx.HubMusicOrbit.paint(svg);}
  assert.deepEqual({layout,styles,paths,viewboxes},{layout:1,styles:1,paths:2,viewboxes:1});
  resize([{contentRect:{width:300,height:180}}]);assert.equal(paths,2);
  resize([{contentRect:{width:400,height:200}}]);assert.equal(paths,4);assert.equal(layout,1);
  const g=ctx.HubMusicOrbit.geometry(300,180,25);assert.match(g.path,/^M 25 1 H 275 /);assert.match(g.path,/299 25/);assert.match(g.path,/179/); // The 4px stroke extends 1px beyond the shared card clip.
});

function services(){
  let renders=0,tileWrites=0,orbitMounts=0;
  const tile={contains:()=>false,querySelector:()=>({}),querySelectorAll:()=>[],set outerHTML(_){tileWrites++;}};
  const ctx=vm.createContext({state:{page:'home',shoppingMode:'todoist',recipeId:null,modal:null,sleep:false},inputMode:'pointer',mainDirty:false,
    music:{data:{is_playing:true,progress_ms:100,item:{id:'one',name:'Track',duration_ms:10000,artists:[{name:'Artist'}],album:{name:'Album',images:[]}},device:{id:'home',name:'Home',supports_volume:true,volume_percent:30}},error:'',devicesBusy:false},
    spotify:{connected:()=>true},shop:{project:'courses',active:[],completed:[],sections:[],loaded:true},daily:{items:[],loaded:true,error:''},
    document:{hidden:false,activeElement:{tagName:'BODY'},querySelectorAll:()=>[]},$:selector=>selector==='.dash-music'||selector==='.dash-tasks'?tile:null,
    renderSleepMusic(){},musicTile:()=>'<music>',dashboardTasks:()=>'<tasks>',HubMusicOrbit:{mount(){orbitMounts++;}},render(){renders++;ctx.serviceRendered();}
  });
  vm.runInContext(section('  var serviceKeys=', '  async function refreshShopping()'),ctx);
  ctx.serviceRendered();return {ctx,counts:()=>({renders,tileWrites,orbitMounts})};
}

test('background services do not reconstruct unrelated pages or stable music',()=>{
  const {ctx,counts}=services();
  for(let i=0;i<4;i++){ctx.music.data.progress_ms+=100;ctx.serviceRender('music');}assert.equal(counts().tileWrites,0);assert.equal(counts().renders,0);
  ctx.state.page='shopping';ctx.music.data.item.name='Next';ctx.serviceRender('music',true);assert.equal(counts().renders,0);
  ctx.state.page='music';ctx.shop.active.push({id:'item'});ctx.serviceRender('shopping',true);assert.equal(counts().renders,0);
  ctx.serviceRender('music');assert.equal(counts().renders,1);
});

test('real music changes replace just the home tile and deferred changes are not lost',()=>{
  const {ctx,counts}=services();ctx.music.data.item.id='two';ctx.serviceRender('music');assert.deepEqual(counts(),{renders:0,tileWrites:1,orbitMounts:1});
  for(const blocked of ['modal','sleep','hidden','typing','keyboard']){
    ctx.music.data.item.name=blocked;
    ctx.state.modal=blocked==='modal'?'settings':null;ctx.state.sleep=blocked==='sleep';ctx.document.hidden=blocked==='hidden';
    ctx.inputMode=blocked==='keyboard'?'keyboard':'pointer';ctx.document.activeElement={tagName:blocked==='typing'?'INPUT':blocked==='keyboard'?'BUTTON':'BODY'};
    if(blocked==='keyboard')ctx.$=()=>({contains:()=>true});
    const before=counts().tileWrites;ctx.serviceRender('music');assert.equal(counts().tileWrites,before,blocked);assert.equal(ctx.mainDirty,true);
  }
  ctx.state.modal=null;ctx.state.sleep=false;ctx.document.hidden=false;ctx.document.activeElement={tagName:'BODY'};ctx.inputMode='pointer';ctx.$=()=>null;
  ctx.serviceRender('music');assert.equal(counts().renders,1);
});

test('Todoist updates preserve an active task draft and ignore unchanged snapshots',()=>{
  const {ctx,counts}=services();ctx.state.page='tasks';ctx.serviceRendered();ctx.serviceRender('daily');assert.equal(counts().renders,0);
  const draft={tagName:'INPUT',value:'Keep this draft'};ctx.document.activeElement=draft;ctx.daily.items.push({id:'new',content:'New task'});ctx.serviceRender('daily');assert.equal(counts().renders,0);assert.equal(draft.value,'Keep this draft');
  ctx.document.activeElement={tagName:'BODY'};ctx.serviceRender('daily');assert.equal(counts().renders,1);
});

test('explicit task submission clears only the sent draft and blocks repeated Enter while pending',async()=>{
  const {ctx,counts}=services();let adds=0,resolveAdd;
  const input={value:'Sent task',isConnected:true,tagName:'INPUT',focus(){}};
  ctx.state.page='tasks';ctx.document.activeElement=input;ctx.$=s=>s==='#task-content'?input:null;
  ctx.shop.projects=[{id:'work',name:'Work'}];ctx.shop.retryAt=0;ctx.daily.retryAt=0;ctx.daily.busy=false;
  ctx.HubConnect={normalize:s=>s.toLowerCase()};ctx.today='2026-10-21';ctx.toast=message=>{throw Error(message);};
  ctx.shop.client={addDaily:async()=>{adds++;await new Promise(r=>resolveAdd=r);},daily:async()=>[{id:'added',content:'Sent task'}]};
  vm.runInContext(section('  function excludedShoppingProjects()', '  function shoppingRow('),ctx);
  vm.runInContext(section('  var taskSubmitting=', '  function normalizeRecipe('),ctx);
  const form={elements:{content:input}};
  const first=ctx.submitTask(form);await ctx.submitTask(form);assert.equal(adds,1);resolveAdd();await first;
  assert.equal(input.value,'');assert.equal(counts().renders,1,'explicit action applies the updated task list while its input stays focused');
  await ctx.submitTask(form);assert.equal(adds,1,'second Enter after success cannot submit the old draft');
  input.value='Another task';const second=ctx.submitTask(form);input.value='New unsent draft';resolveAdd();await second;
  assert.equal(input.value,'New unsent draft');assert.equal(adds,2);
});

test('unchanged shopping snapshots refresh their visible timestamp without replacing the list',()=>{
  const {ctx,counts}=services();ctx.state.page='shopping';ctx.serviceRendered();const label={textContent:'09:00'};
  ctx.timeText=()=> '09:01';ctx.document.querySelectorAll=()=>[label];ctx.shop.updated=Date.now();ctx.serviceRender('shopping');
  assert.equal(label.textContent,'09:01');assert.equal(counts().renders,0);
});

test('the actual focus player renders with and without a controllable volume',()=>{
  const ctx=vm.createContext({music:{data:null,error:'',busy:false},spotify:{connected:()=>false},musicProgress:()=>0,musicTime:String,HubConnect:{normalize:s=>s},read:(_key,value)=>value,esc:String,action:(_cmd,text)=>text,icon:()=>'',iconButton:()=>'',musicArtwork:()=>'<cover>',musicControls:()=>'<controls>',lyricsState:{open:false}});
  vm.runInContext(section('  function musicVolume()', '  function musicDevices()'),ctx);
  assert.match(ctx.musicPage(),/À ton rythme/);assert.doesNotMatch(ctx.musicPage(),/id="music-volume"/);
  ctx.spotify.connected=()=>true;ctx.music.data={item:{name:'Song',artists:[{name:'Artist'}],duration_ms:300000},device:{id:'home',name:'Home',supports_volume:true,volume_percent:42}};
  assert.match(ctx.musicPage(),/id="music-volume"[^>]+value="42"/);
  for(const patch of [{is_restricted:true},{supports_volume:false},{volume_percent:null}]){const saved={...ctx.music.data.device};Object.assign(ctx.music.data.device,patch);assert.doesNotMatch(ctx.musicPage(),/id="music-volume"/);ctx.music.data.device=saved;}
});

test('home automation ignores unrelated sensors but still updates displayed state and controls',()=>{
  let writes=0;const devices={contains:()=>false,querySelector:()=>null,set innerHTML(_){writes++;}};
  const ctx=vm.createContext({state:{page:'house'},house:{status:'connected',pending:'',entities:[{entity_id:'light.lamp',state:'off',attributes:{friendly_name:'Lamp',supported_features:0}}]},HubHA:{group:item=>item.entity_id.startsWith('light.')?'lighting':''},document:{hidden:false,activeElement:{},querySelectorAll:()=>[]},$:s=>s==='#ha-devices'?devices:null,houseDevices:()=>'<lights>',houseStatus:()=>'',houseRestoreFocus(){}});
  vm.runInContext(section('  function houseViewKey()', '  function housePage()'),ctx);vm.runInContext(section('  function houseUpdate()', "  document.addEventListener('visibilitychange',function(){if(!document.hidden){houseUpdate()"),ctx);
  devices.hubViewKey=ctx.houseViewKey();ctx.houseUpdate();assert.equal(writes,0);
  ctx.house.entities.push({entity_id:'sensor.temperature',state:'22',attributes:{}});ctx.houseUpdate();assert.equal(writes,0);
  ctx.house.entities[0].state='on';ctx.houseUpdate();assert.equal(writes,1);
  ctx.house.pending='light.lamp';ctx.houseUpdate();assert.equal(writes,2);
});

test('GitHub legend communicates the same daily thresholds as the contribution colors',()=>{
  const ctx=vm.createContext({});vm.runInContext(section('  function githubLegend(', '  function githubSettings()'),ctx);
  const legend=ctx.githubLegend({kind:'contributions'});assert.match(legend,/contributions par jour : 0, 1 à 2, 3 à 5, 6 à 9, 10 et plus/);assert.match(legend,/class="commit-legend"/);assert.match(ctx.githubLegend(null),/commits par jour/);assert.doesNotMatch(legend,/Relevé importé/);
});
