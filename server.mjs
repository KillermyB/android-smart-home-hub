import http from 'node:http';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { randomBytes, createHash, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const origin = process.env.BASE_URL || `http://localhost:${port}`;
const dataDir = process.env.HUB_DATA_DIR || join(root, '.data');
const remote = !['127.0.0.1', 'localhost', '::1'].includes(host);
if (remote && (!process.env.HUB_ACCESS_TOKEN || process.env.HUB_ACCESS_TOKEN.length < 24)) {
  throw new Error('Pour une écoute réseau, définir HUB_ACCESS_TOKEN avec au moins 24 caractères.');
}
await mkdir(dataDir, { recursive: true, mode: 0o700 });
let encryptionKey;
try { encryptionKey = await readFile(join(dataDir, 'key')); }
catch (e) {
  if (e.code !== 'ENOENT') throw e;
  encryptionKey = randomBytes(32);
  await writeFile(join(dataDir, 'key'), encryptionKey, { mode: 0o600, flag: 'wx' });
}
if (encryptionKey.length !== 32) throw new Error('Clé locale invalide.');
let accounts = {};
try {
  const raw = await readFile(join(dataDir, 'accounts.enc'));
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey, raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  accounts = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString());
} catch (e) { if (e.code !== 'ENOENT') throw new Error('Impossible de déchiffrer les comptes locaux. Conserver .data et sa clé ensemble.'); }
let writeQueue = Promise.resolve();
function persist() {
  const snapshot = JSON.stringify(accounts);
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);
    const body = Buffer.concat([cipher.update(snapshot), cipher.final()]);
    await writeFile(join(dataDir, 'accounts.tmp'), Buffer.concat([iv, cipher.getAuthTag(), body]), { mode: 0o600 });
    await rename(join(dataDir, 'accounts.tmp'), join(dataDir, 'accounts.enc'));
  });
  return writeQueue;
}
const pending = new Map();
const refreshes = new Map();
const tenant = process.env.MICROSOFT_TENANT || 'common';
const providers = {
  outlook: { id: process.env.MICROSOFT_CLIENT_ID, secret: process.env.MICROSOFT_CLIENT_SECRET, auth: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`, token: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, scope: 'offline_access https://graph.microsoft.com/Calendars.Read' },
  work: { id: process.env.MICROSOFT_CLIENT_ID, secret: process.env.MICROSOFT_CLIENT_SECRET, auth: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`, token: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, scope: 'offline_access https://graph.microsoft.com/Calendars.Read' },
  google: { id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET, auth: 'https://accounts.google.com/o/oauth2/v2/auth', token: 'https://oauth2.googleapis.com/token', scope: 'https://www.googleapis.com/auth/calendar.readonly' }
};
const configured = p => Boolean(providers[p]?.id && providers[p]?.secret);
function equal(a, b) { const x = Buffer.from(a || ''), y = Buffer.from(b || ''); return x.length === y.length && timingSafeEqual(x, y); }
function json(res, status, data) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }
async function body(req) {
  let text = '';
  for await (const chunk of req) { text += chunk; if (Buffer.byteLength(text) > 16000) throw new Error('Requête trop grande.'); }
  return JSON.parse(text || '{}');
}
async function upstream(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    const e = new Error(res.status === 401 ? 'Autorisation expirée. Reconnecter le compte.' : `Service distant indisponible (${res.status}).`);
    e.status = res.status;
    throw e;
  }
  return res.status === 204 ? null : res.json();
}
async function token(provider) {
  const a = accounts[provider];
  if (!a) throw new Error('Compte non connecté.');
  if (a.expires_at > Date.now() + 90000) return a.access_token;
  if (refreshes.has(provider)) return refreshes.get(provider);
  const job = (async () => {
    const p = providers[provider];
    const t = await upstream(p.token, { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({ client_id: p.id, client_secret: p.secret, grant_type: 'refresh_token', refresh_token: a.refresh_token }) });
    accounts[provider] = { ...a, ...t, refresh_token: t.refresh_token || a.refresh_token, expires_at: Date.now() + (t.expires_in || 3600) * 1000 };
    await persist(); return t.access_token;
  })();
  refreshes.set(provider, job);
  try { return await job; } finally { refreshes.delete(provider); }
}
function dayTime(iso, allDay = false) {
  if (allDay) return { date: iso.slice(0, 10), time: 'Journée' };
  const d = new Date(/(Z|[+-]\d\d:\d\d)$/.test(iso) ? iso : iso + 'Z');
  return { date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(d), time: new Intl.DateTimeFormat('fr-CH', { timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit' }).format(d) };
}
async function listCalendar(provider) {
  const access = await token(provider), headers = { Authorization: `Bearer ${access}` };
  const from = new Date(Date.now() - 60 * 86400000).toISOString(), to = new Date(Date.now() + 120 * 86400000).toISOString();
  const found = [];
  if (provider === 'google') {
    let listPage;
    do {
      const list = await upstream('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250' + (listPage ? '&pageToken=' + encodeURIComponent(listPage) : ''), { headers });
      for (const cal of list.items || []) {
        if (cal.hidden || cal.deleted) continue;
        let page;
        do {
          const url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(cal.id) + '/events?' + new URLSearchParams({ timeMin: from, timeMax: to, singleEvents: 'true', orderBy: 'startTime', maxResults: '2500', ...(page ? { pageToken: page } : {}) });
          const data = await upstream(url, { headers });
          for (const e of data.items || []) {
            if (e.status === 'cancelled' || !e.start || !e.end) continue;
            const start = dayTime(e.start.dateTime || e.start.date, !!e.start.date), end = dayTime(e.end.dateTime || e.end.date, !!e.end.date);
            found.push({ id: 'google:' + cal.id + ':' + e.id, title: e.summary || 'Sans titre', date: start.date, start: start.time, end: end.time, source: 'google' });
          }
          page = data.nextPageToken;
        } while (page);
      }
      listPage = list.nextPageToken;
    } while (listPage);
  } else {
    let calendarsURL = 'https://graph.microsoft.com/v1.0/me/calendars?$select=id,name&$top=100';
    while (calendarsURL) {
      const calendars = await upstream(calendarsURL, { headers });
      for (const cal of calendars.value || []) {
        let url = 'https://graph.microsoft.com/v1.0/me/calendars/' + encodeURIComponent(cal.id) + '/calendarView?' + new URLSearchParams({ startDateTime: from, endDateTime: to, '$top': '250', '$select': 'id,subject,start,end,isAllDay,isCancelled' });
        while (url) {
          const data = await upstream(url, { headers: { ...headers, Prefer: 'outlook.timezone="UTC"' } });
          for (const e of data.value || []) {
            if (e.isCancelled) continue;
            const start = dayTime(e.start.dateTime, e.isAllDay), end = dayTime(e.end.dateTime, e.isAllDay);
            found.push({ id: provider + ':' + e.id, title: e.subject || 'Sans titre', date: start.date, start: start.time, end: end.time, source: provider });
          }
          url = data['@odata.nextLink'];
          if (url && !url.startsWith('https://graph.microsoft.com/')) throw new Error('Pagination Microsoft invalide.');
        }
      }
      calendarsURL = calendars['@odata.nextLink'];
      if (calendarsURL && !calendarsURL.startsWith('https://graph.microsoft.com/')) throw new Error('Pagination Microsoft invalide.');
    }
  }
  return found;
}
async function todo(path, method = 'GET', payload) {
  if (!process.env.TODOIST_API_TOKEN) throw new Error('Todoist non configuré.');
  return upstream('https://api.todoist.com/api/v1/' + path, { method, headers: { Authorization: 'Bearer ' + process.env.TODOIST_API_TOKEN, 'Content-Type': 'application/json' }, ...(payload ? {body:JSON.stringify(payload)} : {}) });
}
const server = http.createServer(async (req, res) => {
  try {
    const requestHost = req.headers.host || '';
    const expectedHost = new URL(origin).host;
    if (!remote && ![`localhost:${port}`, `127.0.0.1:${port}`, `[::1]:${port}`, expectedHost].includes(requestHost)) return json(res, 403, { error: 'Hôte non autorisé.' });
    const url = new URL(req.url, origin), path = url.pathname;
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(s => s.trim().split('=').map(decodeURIComponent)));
    if (remote && !equal(cookies.hub_access, process.env.HUB_ACCESS_TOKEN)) {
      if (path === '/pair' && req.method === 'POST') {
        const data = await body(req);
        if (req.headers.origin !== `http://${requestHost}` && req.headers.origin !== origin) return json(res, 403, { error:'Origine refusée.' });
        if (!equal(data.token, process.env.HUB_ACCESS_TOKEN)) return json(res, 403, { error:'Code incorrect.' });
        res.setHeader('Set-Cookie', `hub_access=${encodeURIComponent(process.env.HUB_ACCESS_TOKEN)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000`);
        return json(res, 200, {ok:true});
      }
      res.writeHead(401, {'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      return res.end('<!doctype html><html lang="fr"><meta name="viewport" content="width=device-width"><title>Associer Hub.</title><body style="background:#f1eee8;font:18px Arial;padding:10vw"><h1>Hub.</h1><p>Associer ce navigateur au serveur de la maison.</p><form><input name="token" type="password" required aria-label="Code d’association" placeholder="Code dans .env"><button>Associer</button></form><p id="message" role="status"></p><script>document.querySelector("form").onsubmit=async function(e){e.preventDefault();var r=await fetch("/pair",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:this.token.value})});if(r.ok)location.reload();else document.getElementById("message").textContent="Code incorrect."}</script></body></html>');
    }
    if (req.method === 'POST' && req.headers.origin !== origin && req.headers.origin !== `http://${requestHost}`) return json(res, 403, { error: 'Origine refusée.' });
    if (path === '/api/status' && req.method === 'GET') return json(res, 200, { ...Object.fromEntries(Object.keys(providers).map(p => [p, {configured:configured(p), connected:!!accounts[p]}])), calendarConnected:Object.keys(providers).some(p=>!!accounts[p]), todoist:{configured:!!process.env.TODOIST_API_TOKEN,connected:false} });
    if (path === '/api/tasks' && req.method === 'GET') {
      let cursor, tasks = [], projects = [], projectCursor;
      do { const data=await todo('projects?'+new URLSearchParams({limit:'100',...(projectCursor?{cursor:projectCursor}:{})}));projects.push(...data.results);projectCursor=data.next_cursor; } while(projectCursor);
      const excluded=new Set(projects.filter(p=>['course','courses'].includes(p.name.trim().toLowerCase())).map(p=>p.id));
      const selected=url.searchParams.get('shopping_project');if(selected)excluded.add(selected);
      let changed=true;while(changed){changed=false;for(const p of projects)if(excluded.has(p.parent_id)&&!excluded.has(p.id)){excluded.add(p.id);changed=true;}}
      do { const data = await todo('tasks/filter?' + new URLSearchParams({query:'today | overdue',limit:'200',...(cursor?{cursor}:{})})); tasks.push(...data.results.filter(t=>!excluded.has(t.project_id)).map(t => ({id:t.id,content:t.content,priority:t.priority,project_id:t.project_id,done:false}))); cursor=data.next_cursor; } while(cursor);
      return json(res, 200, {tasks});
    }
    if (path === '/api/tasks' && req.method === 'POST') { const data = await body(req); if (typeof data.content !== 'string' || !data.content.trim() || data.content.length > 500) return json(res, 400, {error:'Tâche invalide.'}); await todo('tasks','POST',{content:data.content.trim(),due_string:'today'}); return json(res,201,{ok:true}); }
    const close = path.match(/^\/api\/tasks\/([a-zA-Z0-9_-]+)\/close$/);
    if (close && req.method === 'POST') { await todo('tasks/' + close[1] + '/close','POST'); return json(res,200,{ok:true}); }
    if (path === '/api/events' && req.method === 'GET') {
      const results = await Promise.all(Object.keys(providers).filter(p=>accounts[p]).map(listCalendar));
      return json(res,200,{events:results.flat()});
    }
    const authorize = path.match(/^\/auth\/(outlook|work|google)$/);
    if (authorize && req.method === 'GET') {
      // Accounts are configured from the server's own loopback browser only.
      if (!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) return json(res,403,{error:'Connecter les comptes depuis localhost sur la tour.'});
      const provider=authorize[1],p=providers[provider];
      if (!configured(provider)) return json(res,400,{error:'Renseigner les identifiants OAuth dans .env.'});
      for (const [key,value] of pending) if (value.expires<Date.now()) pending.delete(key);
      const state=randomBytes(32).toString('hex'),verifier=randomBytes(48).toString('base64url'),browser=randomBytes(24).toString('hex');
      pending.set(state,{provider,verifier,browser,expires:Date.now()+600000});
      const params={client_id:p.id,response_type:'code',redirect_uri:origin+'/auth/callback/'+provider,scope:p.scope,state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256',...(provider==='google'?{access_type:'offline',prompt:'consent'}:{prompt:'select_account'})};
      res.setHeader('Set-Cookie',`hub_oauth=${browser}; HttpOnly; SameSite=Lax; Path=/auth; Max-Age=600`);
      res.writeHead(302,{Location:p.auth+'?'+new URLSearchParams(params)});return res.end();
    }
    const callback=path.match(/^\/auth\/callback\/(outlook|work|google)$/);
    if(callback&&req.method==='GET') {
      const provider=callback[1],record=pending.get(url.searchParams.get('state'));
      if(!record||record.provider!==provider||record.expires<Date.now()||!equal(record.browser,cookies.hub_oauth)) return json(res,400,{error:'Autorisation expirée ou invalide. Recommencer depuis les réglages.'});
      pending.delete(url.searchParams.get('state'));
      if(url.searchParams.has('error'))return json(res,400,{error:'Autorisation refusée. Aucun compte connecté.'});
      const p=providers[provider],tokens=await upstream(p.token,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:p.id,client_secret:p.secret,code:url.searchParams.get('code')||'',redirect_uri:origin+'/auth/callback/'+provider,grant_type:'authorization_code',code_verifier:record.verifier})});
      if(!tokens.access_token)throw new Error('Jeton absent de la réponse du fournisseur.');
      accounts[provider]={...tokens,refresh_token:tokens.refresh_token||accounts[provider]?.refresh_token,expires_at:Date.now()+(tokens.expires_in||3600)*1000};await persist();
      res.setHeader('Set-Cookie','hub_oauth=; HttpOnly; SameSite=Lax; Path=/auth; Max-Age=0');res.writeHead(302,{Location:'/?connected='+provider});return res.end();
    }
    if(path.startsWith('/api/')||path.startsWith('/auth/'))return json(res,404,{error:'Route indisponible.'});
    if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Méthode refusée.'});
    const files={'/daily-life.js':'daily-life.js','/daily-life.css':'daily-life.css','/quote-cycle.js':'quote-cycle.js','/weather.js':'weather.js','/spotify-mark.svg':'spotify-mark.svg','/licenses/spotify-mark.txt':'licenses/spotify-mark.txt','/fonts/inter-400.woff2':'fonts/inter-400.woff2','/fonts/inter-500.woff2':'fonts/inter-500.woff2','/fonts/inter-600.woff2':'fonts/inter-600.woff2','/fonts/inter-700.woff2':'fonts/inter-700.woff2','/fonts/inter-OFL.txt':'fonts/inter-OFL.txt','/air-quality.js':'air-quality.js','/calendar-google.js':'calendar-google.js','/dashboard-polish.css':'dashboard-polish.css','/agenda.css':'agenda.css','/agenda-layout.js':'agenda-layout.js','/connection-bundle.js':'connection-bundle.js','/calendar-import.js':'calendar-import.js','/vendor/ical.js':'vendor/ical.js','/licenses/ical.txt':'licenses/ical.txt','/music-colors.js':'music-colors.js','/spotify-link.js':'spotify-link.js','/':'index.html','/index.html':'index.html','/screen.js':'screen.js','/music-orbit.js':'music-orbit.js','/app.js':'app.js','/hub-tools.js':'hub-tools.js','/connectors.js':'connectors.js','/lyrics.js':'lyrics.js','/home-assistant.js':'home-assistant.js','/data.js':'data.js','/budget-recipes.js':'budget-recipes.js','/quotes.js':'quotes.js','/github.js':'github.js','/styles.css':'styles.css','/dashboard.css':'dashboard.css','/home-assistant.css':'home-assistant.css','/icon.svg':'icon.svg','/logo.svg':'logo.svg','/licenses/lucide.txt':'licenses/lucide.txt','/licenses/outfit.txt':'licenses/outfit.txt','/licenses/syne.txt':'licenses/syne.txt','/licenses/geist.txt':'licenses/geist.txt'};
    if(/^\/fonts\/(dm-sans|manrope)(?:-(400|500|600|700|800))?(\.woff2|-OFL\.txt)$/.test(path))files[path]=path.slice(1);
    if(/^\/weather-icons\/(clear-day|clear-night|partly-cloudy-day|partly-cloudy-night|overcast|fog|drizzle|rain|snow|thunderstorms|not-available)\.svg$/.test(path))files[path]=path.slice(1);
    if(path==='/licenses/meteocons.txt')files[path]='licenses/meteocons.txt';
    if(!files[path])return json(res,404,{error:'Fichier introuvable.'});
    const font=path.match(/^\/fonts\/(dm-sans|manrope)(?:-(400|500|600|700|800))?(\.woff2|-OFL\.txt)$/);
    if(font)files[path]=path.slice(1);
    const file=files[path],content=await readFile(join(root,'dist',file));
    res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain'}[extname(file)])+'; charset=utf-8','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);
  } catch (e) { if(!res.headersSent)json(res,502,{error:e.message||'Connexion indisponible.'});else res.end(); }
});
server.listen(port,host,()=>console.log(`Hub. · ${origin}\nÉcoute : ${host}:${port}\nLes comptes externes restent non connectés tant que leur configuration est absente.`));
function stop(){server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),2000).unref();}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
