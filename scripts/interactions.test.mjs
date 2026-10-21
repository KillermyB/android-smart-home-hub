import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const section = (start, end) => app.slice(app.indexOf(start), app.indexOf(end, app.indexOf(start)));

test('idle context shows the next visible calendar appointment beside real weather and never invents an event',()=>{
 let entries=[{date:'2026-10-21',start:'11:00',end:'13:00',source:'work',title:'Ongoing'}, {date:'2026-10-21',start:'12:30',end:'13:00',source:'outlook',title:'Filtered'}, {date:'2026-10-21',start:'13:30',end:'14:00',source:'work',title:'Next meeting'}];
 const context=vm.createContext({Date,state:{weather:{temperature:15,code:1,city:'Moudon',summary:'Clouds'},demo:false,filters:['work']},events:()=>entries,dateKey:()=> '2026-10-21',timeText:()=> '12:00',shiftDay:()=> '2026-10-22',dateText:()=> 'Jeu. 22',sourceStyles:{work:{color:'#f90'}},icon:()=>'',weatherIcon:()=>'',esc:String});
 vm.runInContext(section('  function sleepWeather()', '  function renderOverlay()'),context);
 let markup=context.sleepContext();assert.match(markup,/13:30/);assert.match(markup,/Next meeting/);assert.doesNotMatch(markup,/Filtered|Ongoing/);assert.match(markup,/data-with-weather/);
 entries=[];markup=context.sleepContext();assert.doesNotMatch(markup,/sleep-appointment/);assert.match(markup,/15°/);
 context.state.weather=null;assert.doesNotMatch(context.sleepContext(),/sleep-weather/);
});

test('the music tile perimeter represents elapsed playback time',()=>{
 const context=vm.createContext({music:{data:{item:{duration_ms:10000}}},musicProgress:()=>3000,musicTime:value=>String(value)});
 vm.runInContext(section('  function musicOrbit()', '  function musicArtwork()'),context);
 assert.match(context.musicOrbit(),/aria-valuenow="30"/);assert.match(context.musicOrbit(),/<path class="music-orbit-line" data-tile-progress/);assert.doesNotMatch(context.musicOrbit(),/pathLength|<rect/);assert.doesNotMatch(context.musicOrbit(),/<progress/);
 context.music.data=null;assert.equal(context.musicOrbit(),'');
});

test('Home never silently selects a different or restricted Spotify device', async () => {
  let listed = [{ id: 'phone', name: 'Phone' }, { id: 'blocked', name: 'Home', is_restricted: true }];
  const transfers=[],modals=[];
  const context=vm.createContext({ music:{data:{is_playing:true}},HubConnect:{normalize:value=>value.toLowerCase()},read:(_key,fallback)=>fallback,
    spotify:{devices:async()=>listed,transfer:async(...args)=>transfers.push(args)},refreshMusic:async()=>{},toast(){},openModal:name=>modals.push(name),renderOverlay(){},state:{} });
  vm.runInContext(section('  async function musicHome()', '  function musicTime('),context);
  await context.musicHome();assert.equal(transfers.length,0);assert.deepEqual(modals,['music-devices']);
  listed=[{id:'speaker',name:'HOME',is_restricted:false}];await context.musicHome();assert.deepEqual(transfers,[['speaker',true]]);assert.equal(context.music.devicesBusy,false);
});

test('Spotify can resume a connected session after playback disappears, while restricted and signed-out sessions stay disabled', () => {
  const calls = [];
  let connected = true;
  const context = vm.createContext({ music: { data: null, busy: false }, spotify: { connected: () => connected }, icon: () => '', action: (name, _icon, _class, attributes) => { calls.push({ name, disabled: attributes.includes('disabled') }); return ''; } });
  vm.runInContext(section('  function musicControls(', '  function musicTile('), context);
  context.musicControls(true);
  assert.deepEqual(calls, [{ name: 'music-control:previous', disabled: true }, { name: 'music-control:play', disabled: false }, { name: 'music-control:next', disabled: true }]);
  for (const state of ['restricted', 'signed-out', 'busy']) {
    calls.length = 0;
    connected = state !== 'signed-out';
    context.music.data = state === 'restricted' ? { device: { is_restricted: true }, item: {} } : null;
    context.music.busy = state === 'busy';
    context.musicControls(true);
    assert.ok(calls.every(call => call.disabled), state);
  }
});

test('personal setup hides samples without deleting user tasks, recipes or favorites', () => {
  const stored = { demo: true, tasks: [{ id: 't1', content: 'sample' }, { id: 'local-1', content: 'My task', done: true }], favorites: ['my-recipe'], recipes: [{ id: 'my-recipe' }], timer: { end: 12345 } };
  const context = vm.createContext({ today: '2026-10-20', URLSearchParams, location: { search: '' }, HUB_DATA: { recipes: [] }, asDate: key => new Date(key),
    read: (key, fallback) => key in stored ? structuredClone(stored[key]) : fallback,
    save: (key, value) => { stored[key] = value; }
  });
  vm.runInContext(section('  var state = {', '  var quoteBrowsePage='), context);
  assert.equal(context.state.demo, false);
  assert.equal(stored.personalSetup, 1);
  assert.equal(context.state.tasks.length, 2);
  assert.equal(context.state.tasks[1].content, 'My task');
  assert.equal(context.state.tasks[1].done, true);
  assert.equal(context.state.recipes[0].id, 'my-recipe');
  assert.equal(context.state.favorites[0], 'my-recipe');
  assert.equal(context.state.timer.end, 12345);
  assert.equal(stored.tasks.length, 2);
});

test('tile clicks open their destination while controls, disabled buttons and links stay independent', () => {
  let listener;
  const calls = [];
  const context = vm.createContext({ document: { addEventListener: (_name, handler) => { listener = handler; } },
    handle: async name => { calls.push(name); }, toast() {}, closeModal() {}
  });
  vm.runInContext(section("  document.addEventListener('click'", "  document.addEventListener('change'"), context);
  const target = ({ action, disabled, interactive } = {}) => ({ classList: { contains: () => false }, closest(selector) {
    if (selector === '[data-action]') return action ? { dataset: { action }, disabled } : null;
    if (selector === '[data-tile-action]') return { dataset: { tileAction: 'nav:music' } };
    return interactive ? {} : null;
  } });
  listener({ target: target() });
  listener({ target: target({ action: 'music-next' }) });
  listener({ target: target({ action: 'music-next', disabled: true }) });
  listener({ target: target({ interactive: true }) });
  assert.deepEqual(calls, ['nav:music', 'music-next']);
});

test('idle quotation rotation updates author and source independently without a page rebuild', () => {
  const nodes = { '.sleep-quote': {}, '.sleep-author': {}, '.sleep-work': {}, '.sleep-thought': { classList: { toggle: (_name, long) => { nodes.long = long; } } } };
  const current = { text: 'A'.repeat(181), author: 'Author', work: 'Work' };
  const context = vm.createContext({ state: { sleep: true }, quote: () => current, $: selector => nodes[selector] });
  vm.runInContext(section('  function updateQuote()', '  function tasks()'), context);
  context.updateQuote();
  assert.equal(nodes['.sleep-quote'].textContent, current.text);
  assert.equal(nodes['.sleep-author'].textContent, 'Author');
  assert.equal(nodes['.sleep-work'].textContent, 'Work');
  assert.equal(nodes.long, true);
});

test('waking paints service data received during idle, then restores focus', () => {
  let rendered = 0, overlays = 0, focused = 0;
  const context = vm.createContext({ state: { sleep: true }, mainDirty: true, render: () => rendered++, renderOverlay: () => overlays++, $: () => ({ focus: () => focused++ }), resetIdle() {} });
  vm.runInContext(section('  function wake()', '  function sleepWeather()'), context);
  context.wake();
  assert.equal(context.state.sleep, false); assert.equal(rendered, 1); assert.equal(overlays, 0); assert.equal(focused, 1);
  context.mainDirty = false; context.state.sleep = true; context.wake();
  assert.equal(rendered, 1); assert.equal(overlays, 1); assert.equal(focused, 2);
});

test('date formatting reuses a bounded cache and preserves Zurich dates around midnight', () => {
  let constructed = 0;
  const context = vm.createContext({ Date, Intl: { DateTimeFormat: function (...args) { constructed++; return new Intl.DateTimeFormat(...args); } }, dateFormats: new Map() });
  vm.runInContext(section('  function dateFormatter(', '  function quotePool('), context);
  const at = new Date('2026-10-20T23:30:00Z');
  for (let i = 0; i < 100; i++) {
    assert.equal(context.dateKey(at), '2026-10-21');
    assert.equal(context.timeText(at), '01:30');
    assert.equal(context.shiftDay('2026-10-20', 1), '2026-10-21');
  }
  assert.equal(constructed, 2);
  for (let i = 0; i < 40; i++) context.dateFormatter('fr-CH', { year: 'numeric', timeZone: 'Europe/Zurich', fractionalSecondDigits: i % 3 + 1, hour12: !!(i % 2), calendar: ['gregory', 'buddhist', 'iso8601', 'japanese', 'hebrew', 'islamic'][i % 6], numberingSystem: ['latn', 'arab', 'thai', 'hanidec', 'deva'][i % 5] });
  assert.ok(context.dateFormats.size <= 24);
});

test('page rendering preserves the shell, navigation, and an open modal', () => {
  const main = { innerHTML: '' }, footer = { innerHTML: '' }, modal = {};
  let overlays = 0, themeUpdates = 0;
  const button = { dataset: { action: 'nav:calendar' }, active: false, classList: { toggle(name, value) { button.active = value; } }, setAttribute() {} };
  const context = vm.createContext({
    state: { page: 'home', recipeId: null, demo: true, modal: 'settings' }, inputMode: 'pointer', mainDirty: true,
    document: { activeElement: null, querySelectorAll: () => [button] },
    $: selector => ({ '#main': main, '.modal': modal, '.footer [data-action="settings"]': footer })[selector] || null,
    HubMusicOrbit:{mount(){}}, applyTheme: () => themeUpdates++, renderOverlay: () => overlays++, renderTimer() {}, nativeFullscreen() {}, reportActivity() {}, updateClock() {}, updateKeptFields() {}, serviceRendered() {}, lyricsLifecycle() {}, houseUpdate() {}
  });
  for (const name of ['home', 'calendar', 'taskPage', 'kitchen', 'briefPage', 'companionPage', 'linksPage', 'shoppingPage', 'musicPage', 'housePage', 'weatherPage', 'dailyPage', 'mealPlanPage']) context[name] = () => name;
  vm.runInContext(section('  function render() {', '  function title('), context);
  context.render(); assert.equal(main.innerHTML, 'home');
  context.state.page = 'calendar'; context.render();
  assert.equal(main.innerHTML, 'calendar'); assert.equal(button.active, true);
  assert.equal(overlays, 0); assert.equal(themeUpdates, 2); assert.equal(context.mainDirty, false);
});

test('closing an unchanged modal preserves page nodes; deferred data refreshes once', () => {
  let renders = 0, overlays = 0, focused = 0;
  const context = vm.createContext({ state: { modal: 'settings' }, mainDirty: false,
    lastFocus: { isConnected: true, getAttribute: () => 'settings', focus: () => focused++ },
    render: () => renders++, renderOverlay: () => overlays++, updateClock() {}, renderTimer() {}, resetIdle() {}
  });
  vm.runInContext(section('  function closeModal()', '  function sleepWeather()'), context);
  context.closeModal(); assert.equal(renders, 0); assert.equal(overlays, 1); assert.equal(focused, 1);
  context.state.modal = 'settings'; context.mainDirty = true; context.closeModal(); assert.equal(renders, 1);
  context.closeModal(); assert.equal(renders, 1); assert.equal(focused, 2);
});

test('recipe filtering preserves the search field and excludes hidden or non-favorite dishes', () => {
  const search = { getAttribute: () => null }, grid = { innerHTML: '', querySelectorAll: () => [] }, counter = { textContent: '' };
  const recipes = [{ id: 'a', title: 'Citron', subtitle: '', ingredients: [], category: 'Rapide', budget: true }, { id: 'b', title: 'Riz', subtitle: '', ingredients: [], category: 'Rapide' }];
  const context = vm.createContext({ state: { recipes, search: 'CIT', category: 'Toutes', library: 'all', favorites: [], recipeId: null }, hiddenRecipes: [], inputMode: 'pointer',
    $: selector => ({ '.recipe-grid': grid, '.recipe-count': counter, '#recipe-search': search })[selector], document: { activeElement: search },
    esc: String, icon: () => '', foodArt: () => '', action: (name, text) => text
  });
  vm.runInContext(section('  function recipeList()', '  function kitchen()'), context);
  context.refreshRecipes(); assert.equal(counter.textContent, '1 recette'); assert.match(grid.innerHTML, /Citron/); assert.doesNotMatch(grid.innerHTML, /Riz/);
  assert.equal(context.$('#recipe-search'), search);
  context.hiddenRecipes.push('a'); context.refreshRecipes(); assert.equal(counter.textContent, '0 recette');
  context.hiddenRecipes.length = 0; context.state.search = ''; context.state.library = 'favorites'; context.state.favorites = ['b'];
  assert.deepEqual(Array.from(context.recipeList(), x => x.id), ['b']);
});

test('navigation renders synchronously without waiting for unrelated service handlers', async () => {
  let renders = 0;
  const context = vm.createContext({ state: { page: 'home', recipeId: null },
    houseAction: () => { throw Error('unrelated home command'); }, serviceAction: () => { throw Error('unrelated service command'); },
    render: () => renders++, $: () => ({ focus() {} }), window: { scrollTo() {} }, animateEnter() {}, resetIdle() {}
  });
  vm.runInContext(section('  async function handle(name)', "  document.addEventListener('click'"), context);
  const pending = context.handle('nav:calendar');
  assert.equal(context.state.page, 'calendar'); assert.equal(renders, 1);
  await pending;
});


test('remembered HA reconnect waits with backoff, pauses while hidden, and never dispatches a device command',async()=>{
 const timers=[],cleared=[];let attempts=0;const context=vm.createContext({house:{retry:0,retryDelay:2000,client:{connect:async()=>{attempts++;}},status:'disconnected'},document:{hidden:false},HubHA:{saved:()=>({url:'http://home.test',token:'test'})},setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length;},clearTimeout:id=>cleared.push(id)});
 vm.runInContext(section('  function houseRetry()', '  async function houseStart('),context);
 context.houseRetry();assert.equal(timers[0].delay,2000);await timers[0].fn();assert.equal(attempts,1);
 context.houseRetry();assert.equal(timers[1].delay,4000);context.document.hidden=true;await timers[1].fn();assert.equal(attempts,1);
 context.houseRetry();assert.equal(timers.length,2);context.document.hidden=false;context.house.status='connected';context.houseRetry();assert.equal(timers.length,2);
});

test('compact home groups prioritize scenes and lighting, retain real states, and target the actual switch domain',()=>{
 const ha=vm.createContext({URL});vm.runInContext(readFileSync(new URL('../dist/home-assistant.js',import.meta.url),'utf8'),ha);
 const entities=[{entity_id:'media_player.tv',state:'off',attributes:{friendly_name:'TV',supported_features:128|256}},{entity_id:'switch.socket',state:'on',attributes:{friendly_name:'Lampe prise'}},{entity_id:'light.offline',state:'unavailable',attributes:{friendly_name:'Lampe hors ligne'}},{entity_id:'light.off',state:'off',attributes:{friendly_name:'Lampe éteinte'}},{entity_id:'scene.appartement',state:'unknown',attributes:{friendly_name:'Appartement'}},{entity_id:'scene.salon',state:'unknown',attributes:{friendly_name:'Salon'}},{entity_id:'switch.loudness',state:'on',attributes:{friendly_name:'Home Loudness'}}];
 const context=vm.createContext({house:{status:'connected',pending:'',entities},HubHA:ha.HubHA,icon:()=>'<svg></svg>',esc:String,action:(a,label,cls,attrs)=>'<button class="'+cls+'" data-action="'+a+'" '+(attrs||'')+'>'+label+'</button>'});
 vm.runInContext(section('  function houseControl(', '  function housePage()'),context);const html=context.houseDevices();assert.ok(html.indexOf('Scènes')<html.indexOf('Lampes et prises'));assert.ok(html.indexOf('Lampes et prises')<html.indexOf('Sonos et télévisions'));assert.ok(html.indexOf('scene.salon')<html.indexOf('scene.appartement'));assert.match(html,/ha-is-on/);assert.match(html,/ha-is-off/);assert.match(html,/ha-unavailable/);assert.match(html,/ha-call:switch:turn_off:switch.socket/);assert.match(html,/ha-call:media_player:turn_on:media_player.tv/);assert.match(html,/<details class="ha-group ha-advanced">/);assert.doesNotMatch(html,/ha-entity/);
});

test('robot cards expose battery, translated alerts and real capability-gated controls before media',()=>{
 const ha=vm.createContext({URL});vm.runInContext(readFileSync(new URL('../dist/home-assistant.js',import.meta.url),'utf8'),ha);
 const robot={entity_id:'vacuum.robot',state:'paused',attributes:{friendly_name:'Robot',battery:100,washing_paused:true,cleaning_mode:'Sweeping and mopping',error:'Water tank dry',supported_features:8192|4|8|16}};
 const entities=[{entity_id:'light.lamp',state:'off',attributes:{}},robot,{entity_id:'media_player.tv',state:'off',attributes:{supported_features:128}}];
 const context=vm.createContext({house:{status:'connected',pending:'',entities},HubHA:ha.HubHA,icon:()=>'<svg></svg>',esc:s=>String(s).replace(/</g,'&lt;'),action:(a,label,cls,attrs)=>'<button data-action="'+a+'" '+(attrs||'')+'>'+label+'</button>'});
 vm.runInContext(section('  function houseControl(', '  function housePage()'),context);
 const html=context.houseDevices();assert.ok(html.indexOf('Lampes et prises')<html.indexOf('Robots aspirateurs'));assert.ok(html.indexOf('Robots aspirateurs')<html.indexOf('Sonos et télévisions'));assert.match(html,/100 %/);assert.match(html,/Lavage en pause/);assert.match(html,/Réservoir d’eau vide/);assert.match(html,/Aspiration et lavage/);assert.match(html,/ha-call:vacuum:start:vacuum.robot/);assert.match(html,/>Reprendre</);assert.doesNotMatch(html,/ha-call:vacuum:pause:/);
 const offline=context.houseRobot({...robot,state:'unavailable',attributes:{...robot.attributes,battery:null}});assert.doesNotMatch(offline,/ha-battery|Réservoir/);assert.match(offline,/disabled/);
 const missing=context.houseRobot({...robot,attributes:{...robot.attributes,battery:null,error:'No error',supported_features:16}});assert.doesNotMatch(missing,/ha-battery|À vérifier/);assert.match(missing,/ha-call:vacuum:return_to_base:/);assert.match(missing,/ha-call:vacuum:start:vacuum.robot"[^>]+disabled/);
});

test('HA command feedback uses a temporary notification while errors remain distinct and stale completions stay silent',async()=>{
 const notices=[],item={entity_id:'light.lamp',state:'off',attributes:{friendly_name:'Lampe'}};
 const context=vm.createContext({house:{status:'connected',client:{confirmedCall:async()=>({confirmed:true})},pending:'',generation:1,entities:[item]},state:{page:'house',modal:null,sleep:false},document:{hidden:false,activeElement:{}},window:{HubHA:{supports:()=>true}},houseUpdate(){},houseRestoreFocus(){},resetIdle(){},houseError:()=> 'Commande refusée',toast:(...args)=>notices.push(args)});
 vm.runInContext(section('  async function houseAction(', '  function header()'),context);
 await context.houseAction('ha-call','light:turn_on:light.lamp');assert.deepEqual(notices,[['État confirmé · Lampe','success']]);assert.equal(context.house.message,'');assert.equal(item.state,'off');
 context.house.client.confirmedCall=async()=>{throw Error('failed');};await context.houseAction('ha-call','light:turn_on:light.lamp');assert.deepEqual(notices.at(-1),['Commande refusée','error']);assert.equal(context.house.error,'Commande refusée');
 const count=notices.length;context.house.client.confirmedCall=async()=>{context.house.generation++;};await context.houseAction('ha-call','light:turn_on:light.lamp');assert.equal(notices.length,count);
});

test('standby player shows only an active track with its elapsed perimeter and compact metadata',()=>{
 const context=vm.createContext({music:{data:{is_playing:true,item:{name:'Track',artists:[{name:'Artist'}],duration_ms:10000,album:{images:[]}},device:{name:'Home'}}},HubTools:{safeURL:s=>s},esc:String,icon:()=>'<icon>',musicOrbit:()=>'<svg data-tile-progress></svg>'});
 vm.runInContext(section('  function sleepMusic()', '  var sleepMusicKey='),context);
 const html=context.sleepMusic();assert.match(html,/Track/);assert.match(html,/Artist · Home/);assert.match(html,/data-tile-progress/);assert.doesNotMatch(html,/sleep-music-device/);
 context.music.data.is_playing=false;assert.equal(context.sleepMusic(),'');context.music.data=null;assert.equal(context.sleepMusic(),'');
});
test('standby progress updates each second only for visible active playback',()=>{
 let delays=[];const context=vm.createContext({state:{page:'home',sleep:true},document:{hidden:false},music:{data:{is_playing:true}},lyricsState:{open:false,busy:false},lyricsAttemptedKey:'',lyricsTick:0,clearTimeout(){},setTimeout(_fn,delay){delays.push(delay);},resetLyrics(){},paintLyrics(){}});
 vm.runInContext(app.split('\n').find(line=>line.startsWith('  function lyricsLifecycle()')),context);
 context.lyricsLifecycle();assert.deepEqual(delays,[1000]);delays=[];context.document.hidden=true;context.lyricsLifecycle();assert.deepEqual(delays,[]);context.document.hidden=false;context.music.data.is_playing=false;context.lyricsLifecycle();assert.deepEqual(delays,[]);
});
