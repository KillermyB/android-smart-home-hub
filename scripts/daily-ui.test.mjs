import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
function context(){
 const saved=[],commands=[],messages=[];let refreshed=0;
 const c=vm.createContext({URL,URLSearchParams,AbortController,Date,Intl,setTimeout,clearTimeout,read:(_k,f)=>f,save:(...args)=>saved.push(args),today:'2026-10-21',state:{recipes:[{id:'pasta',title:'Pâtes',servings:2,time:15,ingredients:[{qty:100,unit:'g',name:'Pâtes'}]}],page:'daily',modal:null,filters:['work']},meals:{},hiddenRecipes:[],document:{hidden:false,body:{appendChild(){}},querySelectorAll:()=>[]},house:{status:'connected',generation:1,entities:[],client:{confirmedCall:async(...args)=>{commands.push(args);return {confirmed:true};}},pending:''},$(){return null;},esc:String,icon:()=>'',title:()=>'',action:(name,label)=>`<button data-action="${name}">${label}</button>`,events:()=>[],houseUpdate(){},renderOverlay(){},render(){refreshed++;},toast:(...args)=>messages.push(args),houseError:e=>e.message,timeText:()=> '12:00',dateText:k=>k,shiftDay:(d,n)=>c.HubDaily.addDays(d,n),dashboardQuote:()=>'<quote>',openModal(name){c.state.modal=name;},closeModal(){c.state.modal=null;},spotify:{connected:()=>true},HubHA:{group:x=>x.entity_id.startsWith('light.')?'lighting':'media_player',supports:(_x,s)=>s==='media_pause'},music:{busy:false},musicTime:String,selectedAppointment:'meeting',HubConnect:{},daily:{},shop:{}});
 vm.runInContext(readFileSync(new URL('../dist/daily-life.js',import.meta.url),'utf8'),c);
 vm.runInContext(readFileSync(new URL('../dist/road-travel.js',import.meta.url),'utf8'),c);
 vm.runInContext(app.slice(app.indexOf('  // Daily tools'),app.indexOf('  var morningHour=')),c);
 return {c,saved,commands,messages,refreshed:()=>refreshed};
}
test('weekly plan keeps selected portions and mirrors the existing home meal without clearing unrelated data',()=>{
 const {c,saved}=context();c.dayTools.plan={'2026-10-21':{recipeId:'pasta',portions:4}};c.meals['2026-10-22']='other';c.persistPlan();assert.equal(c.meals['2026-10-21'],'pasta');assert.equal(c.meals['2026-10-22'],'other');assert.equal(saved[0][0],'mealPlan');assert.equal(saved[0][1]['2026-10-21'].portions,4);
 const html=c.mealPlanPage();assert.match(html,/data-plan-portions="2026-10-21"/);assert.match(html,/value="4"/);assert.equal((html.match(/class="card meal-plan-day/g)||[]).length,7);
});
test('notes are bounded, pinned one at a time, persisted and removable without touching companion storage',async()=>{
 const {c,saved}=context();const form=text=>({id:'board-note-form',elements:{text:{value:text},pin:{checked:true}}});await c.dailySubmit(form('Un mot'));assert.equal(c.dayTools.notes.length,1);assert.match(c.dailyHomeNote(),/Un mot/);await c.dailyAction('note-pin',c.dayTools.notes[0].id);assert.equal(c.dailyHomeNote(),'<quote>');await c.dailyAction('note-remove',c.dayTools.notes[0].id);assert.equal(c.dayTools.notes.length,0);assert.ok(saved.every(([key])=>key==='boardNotes'));
});
test('leaving sends only selected precise targets, skips resting devices and reports partial failures without retrying',async()=>{
 const {c,commands}=context();c.house.entities=[{entity_id:'light.salon',state:'on',attributes:{friendly_name:'Salon'}},{entity_id:'light.off',state:'off',attributes:{}},{entity_id:'media_player.sonos',state:'playing',attributes:{}},{entity_id:'light.unselected',state:'on',attributes:{}}];c.house.client.confirmedCall=async(...args)=>{commands.push(args);if(args[2].entity_id==='media_player.sonos')throw Error('Offline');return {confirmed:true};};await c.runLeaving(['light.salon','light.off','media_player.sonos']);assert.equal(commands.length,2);assert.equal(commands[0][1],'turn_off');assert.equal(commands[1][1],'media_pause');assert.equal(c.dayTools.leaveResults[1].message,'Déjà au repos');assert.equal(c.dayTools.leaveResults[2].message,'Offline');assert.equal(c.house.pending,'');assert.equal(c.dayTools.leaveBusy,false);
});
test('saving a leaving selection never sends commands and ignores simultaneous execution',async()=>{
 const {c,commands}=context();await c.dailySubmit({id:'leave-form',querySelectorAll:()=>[{value:'light.salon'}]},{value:'save'});assert.equal(commands.length,0);assert.equal(c.dayTools.leaveIds[0],'light.salon');c.dayTools.leaveBusy=true;await c.runLeaving(['light.salon']);assert.equal(commands.length,0);
});
test('a selected Spotify queue title requires explicit replacement confirmation before playback',async()=>{
 const {c}=context();let starts=0;c.spotify.playTrack=async()=>{starts++;};c.refreshMusic=async()=>{};c.dayTools.queue={items:[{uri:'spotify:track:abc',name:'Title'}]};await c.dailyAction('queue-select','0');assert.equal(c.state.modal,'queue-play');assert.equal(starts,0);await c.dailyAction('queue-play','');assert.equal(starts,1);assert.equal(c.music.busy,false);
});
test('room cleaning requires selected real segments and never falls back to whole-home cleaning',async()=>{
 const {c}=context();let commands=[];c.house.client.cleanRooms=async(...args)=>commands.push(args);c.house.client.vacuumRooms=()=>({map:'Home',rooms:[{id:3,name:'Cuisine'}]});c.dayTools.robotRooms=c.house.client.vacuumRooms();c.dayTools.robotId='vacuum.robot';await assert.rejects(c.dailySubmit({id:'robot-clean-form',querySelectorAll:()=>[]}),/Choisis/);assert.equal(commands.length,0);await c.dailySubmit({id:'robot-clean-form',querySelectorAll:()=>[{value:'3'}]});assert.equal(commands.length,1);assert.equal(commands[0][0],'vacuum.robot');assert.equal(commands[0][1][0],3);assert.equal(c.house.pending,'');
});
test('transit markup uses real normalized departure fields and marks cancelled services',()=>{
 const {c}=context();c.dayTools.board={station:{name:'Moudon'},updatedAt:Date.now(),departures:[{line:'R 9',destination:'Lausanne',departureAt:Date.now(),platform:'2',cancelled:true}]};assert.match(c.transportPanel(),/R 9/);assert.match(c.transportPanel(),/Lausanne/);assert.match(c.transportPanel(),/Supprimé/);assert.doesNotMatch(c.transportPanel(),/undefined/);
});

test('changed robot map blocks a stale room selection even when segment numbers are reused',async()=>{
 const {c}=context();let starts=0;c.dayTools.robotId='vacuum.robot';c.dayTools.robotRooms={map:'Floor1',rooms:[{id:3,name:'Kitchen'}]};c.house.client.vacuumRooms=()=>({map:'Floor2',rooms:[{id:3,name:'Bedroom'}]});c.house.client.cleanRooms=async()=>{starts++;};await assert.rejects(c.dailySubmit({id:'robot-clean-form',querySelectorAll:()=>[{value:'3'}]}),/carte/);assert.equal(starts,0);assert.equal(c.dayTools.robotRooms.map,'Floor2');
});
test('late transit search never attaches a previous appointment route to the newly selected appointment',async()=>{
 const {c}=context();let resolve;c.events=()=>[{id:'meeting',date:'2026-10-21',start:'16:00'}];c.dayTools.transit.connections=()=>new Promise(r=>resolve=r);const p=c.dailySubmit({id:'route-search',elements:{from:{value:'Moudon'},to:{value:'Lausanne'}}});c.selectedAppointment='new-meeting';resolve([{departureAt:1}]);await p;assert.equal(c.dayTools.routeResults.length,0);
});

test('home meal shows planned portions instead of recipe default',()=>{
 const {c}=context();c.meal=()=>c.state.recipes[0];c.dayTools.plan['2026-10-21']={recipeId:'pasta',portions:4};vm.runInContext(app.slice(app.indexOf('  function dashboardMeal()'),app.indexOf('  function dashboardQuote()')),c);assert.match(c.dashboardMeal(),/4 personnes/);
});

test('merged brief contains only house note, departures and driving estimates, without meal or leaving cards',()=>{
 const {c}=context();c.dayTools.notes=[{id:'n',text:'Note maison',pinned:true}];const html=c.briefOverview();assert.match(html,/Note maison/);assert.match(html,/Moudon, gare/);assert.match(html,/Lausanne · centre/);assert.match(html,/Genève · centre/);assert.match(html,/centre approximatif/);assert.match(html,/hors trafic en direct/);assert.doesNotMatch(html,/meal-plan|leave-review|La maison se repose|Aéroport/);
});
test('road display distinguishes failures from estimates and keeps provenance',()=>{
 const {c}=context();c.dayTools.road.results={lausanne:{error:'Service indisponible'},geneve:{minutes:73,kilometers:88.8,updatedAt:Date.now(),stale:true}};const html=c.roadPanel();assert.match(html,/Service indisponible/);assert.match(html,/1 h 13/);assert.match(html,/à actualiser/);assert.doesNotMatch(html,/NaN|undefined/);assert.match(html,/OpenStreetMap/);
});
test('location is never requested by brief lifecycle and cannot persist precise coordinates',async()=>{
 const {c,saved}=context();let requests=0;c.state.page='brief';c.briefVisible=()=>true;c.refreshTransit=()=>{};c.refreshRoad=async()=>{};c.dayTools.road.client.route=async()=>{};c.HubRoad.locate=async()=>{requests++;return {latitude:46.6,longitude:6.7,label:'Position actuelle'};};c.navigator={geolocation:{}};c.briefLifecycle();assert.equal(requests,0);await c.roadAction('road-gps');assert.equal(requests,1);assert.equal(c.dayTools.road.origin.label,'Position actuelle');assert.equal(saved.length,0);await c.roadAction('road-moudon');assert.match(c.dayTools.road.origin.label,/Moudon/);
});
test('late road estimates cannot replace a newer origin after switching back to Moudon',async()=>{
 const {c}=context();let resolve;c.dayTools.road.client.route=()=>new Promise(r=>{resolve=r;});c.HubRoad.destinations=c.HubRoad.destinations.slice(0,1);const pending=c.refreshRoad();c.dayTools.road.revision++;c.dayTools.road.results={};resolve({minutes:99});await pending;assert.equal(c.dayTools.road.results.lausanne,undefined);
});
