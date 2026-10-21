import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, readdir, lstat, mkdtemp, writeFile, rm, copyFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = '/data/local/hub';
const busybox = '/system/bin/busybox-smp';
export const quote = value => "'" + String(value).replaceAll("'", "'\\''") + "'";

export function validateConnection(c) {
  const octets = String(c.host || '').split('.');
  const valid = octets.length === 4 && octets.every(x => /^\d{1,3}$/.test(x) && Number(x) <= 255);
  const privateIP = valid && (octets[0] === '10' || (octets[0] === '192' && octets[1] === '168') || (octets[0] === '172' && +octets[1] >= 16 && +octets[1] <= 31));
  if (!privateIP || c.port !== 2222 || c.user !== 'root' || typeof c.key !== 'string' || !c.key.startsWith('/')) throw Error('Configuration SSH locale invalide : adresse privée, port 2222, root et clé absolue requis.');
  return c;
}

export async function collectAssets(directory, prefix = '') {
  const list = [];
  for (const name of (await readdir(join(directory, prefix))).sort()) {
    const relative = prefix ? prefix + '/' + name : name;
    if (!/^[a-zA-Z0-9_./-]+$/.test(relative) || name.startsWith('.')) throw Error('Fichier non publiable : ' + relative);
    const file = join(directory, relative), info = await lstat(file);
    if (info.isSymbolicLink()) throw Error('Lien symbolique interdit : ' + relative);
    if (info.isDirectory()) list.push(...await collectAssets(directory, relative));
    else if (info.isFile() && /\.(html|js|css|svg|woff2|txt|json|png|jpg|jpeg|webp)$/.test(name)) {
      list.push({ path: relative, sha256: createHash('sha256').update(await readFile(file)).digest('hex') });
    } else throw Error('Type non publiable : ' + relative);
  }
  return list;
}

function run(bin, args, input) {
  return new Promise((ok, fail) => {
    const child = spawn(bin, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    const out = [], err = [];
    const timer = setTimeout(() => child.kill('SIGTERM'), 60000);
    child.on('error', error => { clearTimeout(timer); fail(error); });
    child.stdout.on('data', x => out.push(x));
    child.stderr.on('data', x => err.push(x));
    child.stdin.on('error', () => {});
    child.on('close', code => { clearTimeout(timer); code === 0 ? ok(Buffer.concat(out).toString()) : fail(Error(Buffer.concat(err).toString() || 'Commande interrompue (' + code + ')')); });
    child.stdin.end(input);
  });
}

function startScript() {
  return `set -e
[ -f ${base}/.hub-managed ] && [ -f ${base}/www/index.html ]
if [ -f ${base}/httpd.pid ]; then
  pid=$(cat ${base}/httpd.pid)
  case "$pid" in ''|*[!0-9]*) exit 1;; esac
  if [ -r /proc/$pid/cmdline ]; then
    cmd=$(${busybox} tr '\\000' ' ' </proc/$pid/cmdline)
    case "$cmd" in *'httpd -f -p 127.0.0.1:4173 -h ${base}/www -c ${base}/httpd.conf'*) kill "$pid";; *) echo 'PID non reconnu' >&2; exit 1;; esac
  fi
fi
${busybox} nohup ${busybox} httpd -f -p 127.0.0.1:4173 -h ${base}/www -c ${base}/httpd.conf >${base}/httpd.log 2>&1 </dev/null &
echo $! >${base}/httpd.pid
`;
}

async function main() {
  const [command, flag, configFile] = process.argv.slice(2);
  if (!['status', 'deploy', 'start', 'open'].includes(command) || flag !== '--config' || !configFile) throw Error('Usage : npm run frame -- status|deploy|start|open --config /chemin/prive/connection.json');
  const configPath = resolve(configFile), config = validateConnection(JSON.parse(await readFile(configPath, 'utf8')));
  const known = join(dirname(configPath), 'known_hosts');
  await readFile(known); // Pin the host key over trusted USB before using this command.
  const sshArgs = ['-T', '-p', '2222', '-i', config.key, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=8', '-o', 'StrictHostKeyChecking=yes', '-o', 'UserKnownHostsFile="' + known.replaceAll('"', '\\"') + '"', config.user + '@' + config.host];
  const remote = (script, input) => run('ssh', [...sshArgs, script], input);
  const identity = await remote('id; getprop ro.hardware; getprop ro.build.version.release; getprop ro.product.cpu.abi; getprop ro.build.display.id; wm size');
  if (!/uid=0\(root\)/.test(identity) || !/\bsun8i\b/.test(identity) || !/\b6\.0\.1\b/.test(identity) || !/armeabi-v7a/.test(identity) || !/20260529/.test(identity) || !/1280x800/.test(identity)) throw Error('Identité du cadre différente du matériel vérifié ; aucune écriture effectuée.');
  if (command === 'status') {
    console.log('Cadre vérifié · Android 6.0.1 · ARMv7 · 1280 × 800 · SSH root par clé');
    const manifest = await remote('if [ -f ' + base + '/www/hub-release.json ]; then cat ' + base + '/www/hub-release.json; fi');
    console.log(manifest ? 'Hub v' + JSON.parse(manifest).version + ' installé' : 'Hub pas encore installé');
    return;
  }
  if (command === 'deploy') {
    const { version } = JSON.parse(await readFile(join(project, 'package.json'), 'utf8'));
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('Version invalide');
    const assets = await collectAssets(join(project, 'dist'));
    const screenScript = await readFile(join(project, 'scripts/device/screen.cgi'));
    const activityScript = await readFile(join(project, 'scripts/device/activity.cgi'));
    assets.push({ path: 'cgi-bin/activity.cgi', sha256: createHash('sha256').update(activityScript).digest('hex') });
    assets.push({ path: 'cgi-bin/screen.cgi', sha256: createHash('sha256').update(screenScript).digest('hex') });
    if (!assets.some(x => x.path === 'index.html')) throw Error('index.html absent');
    const manifest = JSON.stringify({ version, assets });
    const target = base + '/releases/v' + version;
    const restore = await readFile(join(project, 'scripts/device/screen-restore.sh'));
    const startup = await readFile(join(project, 'scripts/frame-autostart.sh'));
    const startupHash = createHash('sha256').update(startup).digest('hex');
    // Only migrate our known managed startup file; preserve any unexpected edits.
    const oldStartupHash = 'bbb626b3e3a04374d1e959851b96dc82320e6422e276a495689454354202c586';
    const actualStartup = (await remote(`if [ -f ${base}/autostart.sh ]; then ${busybox} sha256sum ${base}/autostart.sh; fi`)).trim().split(/\s/)[0];
    if (actualStartup && ![oldStartupHash, '860a384633ab0802fbe31e6db6648fdd2cf115eba184cbd3b779b4a9c3e64ac7', startupHash].includes(actualStartup)) throw Error('Script de démarrage modifié : conserver et examiner ses différences avant migration.');
    const preparation = `set -e
if [ -e ${base} ] && [ ! -f ${base}/.hub-managed ]; then echo 'Dossier distant non géré' >&2; exit 1; fi
mkdir -p ${base}/releases
touch ${base}/.hub-managed
if [ -e ${target} ]; then echo 'Version déjà présente : incrémenter la version avant un nouveau déploiement' >&2; exit 1; fi
if [ -L ${base}/incoming ]; then exit 1; fi
rm -rf ${base}/incoming
mkdir -p ${base}/incoming
`;
    await remote(preparation);
    await remote(`umask 077; cat >${base}/screen-restore.next`, restore);
    await remote(`umask 077; cat >${base}/autostart-screen.next`, startup);
    await remote(`set -e
[ "$(${busybox} sha256sum ${base}/screen-restore.next | ${busybox} cut -d' ' -f1)" = '${createHash('sha256').update(restore).digest('hex')}' ]
[ "$(${busybox} sha256sum ${base}/autostart-screen.next | ${busybox} cut -d' ' -f1)" = '${startupHash}' ]
chmod 700 ${base}/screen-restore.next ${base}/autostart-screen.next
mv ${base}/screen-restore.next ${base}/screen-restore.sh
if [ -f ${base}/autostart.sh ]; then
  [ -f ${base}/autostart.before-v0.20.sh ] || cp ${base}/autostart.sh ${base}/autostart.before-v0.20.sh
  [ -f ${base}/autostart.before-screen.sh ] || cp ${base}/autostart.sh ${base}/autostart.before-screen.sh
  mv ${base}/autostart-screen.next ${base}/autostart.sh
else
  rm ${base}/autostart-screen.next
fi
`);
    for (const name of ['nightly-restart.sh','fullscreen.sh']) {
      const content=await readFile(join(project,'scripts/device',name));
      const hash=createHash('sha256').update(content).digest('hex');
      await remote(`umask 077; cat >${base}/${name}.next`,content);
      await remote(`set -e
[ "$(${busybox} sha256sum ${base}/${name}.next | ${busybox} cut -d' ' -f1)" = '${hash}' ]
/system/bin/sh -n ${base}/${name}.next
chmod 700 ${base}/${name}.next
if [ -f ${base}/${name} ] && [ ! -f ${base}/${name}.before-v0.20 ]; then cp ${base}/${name} ${base}/${name}.before-v0.20; fi
mv ${base}/${name}.next ${base}/${name}
`);
    }
    const temp = await mkdtemp(join(tmpdir(), 'hub-frame-'));
    try {
      const payload = join(temp, 'www'); await mkdir(payload);
      for (const asset of assets) {
        await mkdir(dirname(join(payload, asset.path)), { recursive: true });
        if (asset.path === 'cgi-bin/screen.cgi') await writeFile(join(payload, asset.path), screenScript, { mode: 0o700 });
        else if (asset.path === 'cgi-bin/activity.cgi') await writeFile(join(payload, asset.path), activityScript, { mode: 0o700 });
        else await copyFile(join(project, 'dist', asset.path), join(payload, asset.path));
      }
      await writeFile(join(payload, 'hub-release.json'), manifest);
      await writeFile(join(payload, 'SHA256SUMS'), assets.map(x => x.sha256 + '  ' + x.path).join('\n') + '\n');
      const archive = join(temp, 'hub.tar');
      await run('tar', ['-C', payload, '-cf', archive, '.']);
      await remote(`${busybox} tar -xf - -C ${base}/incoming`, await readFile(archive));
      await remote(`set -e
cd ${base}/incoming
${busybox} sha256sum -c SHA256SUMS >/dev/null
chmod 700 cgi-bin/screen.cgi
if [ ! -f ${base}/screen-key ]; then
  umask 077
  ${busybox} od -An -N32 -tx1 /dev/urandom | ${busybox} tr -d ' \\n' >${base}/screen-key
fi
[ "$(wc -c <${base}/screen-key)" -eq 64 ]
mv ${base}/incoming ${target}
if [ -L ${base}/www ]; then ${busybox} readlink ${base}/www >${base}/previous; elif [ -e ${base}/www ]; then exit 1; fi
${busybox} ln -sfn ${target} ${base}/www
cat >${base}/httpd.conf <<'HUBCONF'
A:127.0.0.1
D:*
.js:application/javascript
.css:text/css
.svg:image/svg+xml
.woff2:font/woff2
.json:application/json
HUBCONF
`);
      try {
        await remote(startScript());
        const installed = JSON.parse(await remote(`${busybox} wget -q -O - http://127.0.0.1:4173/hub-release.json`));
        if (JSON.stringify(installed) !== manifest) throw Error('Le contenu servi ne correspond pas au déploiement.');
      } catch (error) {
        const previous = (await remote('cat ' + base + '/previous 2>/dev/null || true')).trim();
        if (new RegExp('^' + base + '/releases/v\\d+\\.\\d+\\.\\d+$').test(previous)) {
          await remote(`${busybox} ln -sfn ${quote(previous)} ${base}/www`);
          await remote(startScript());
        }
        throw error;
      }
      console.log('Hub v' + version + ' vérifié et servi sur le cadre, uniquement en boucle locale.');
    } finally { await rm(temp, { recursive: true, force: true }); }
    console.log('Actualise l’onglet Hub existant sur le cadre. Aucun nouvel onglet ouvert.');
    return;
  }
  if (command === 'start') {
    await remote(startScript());
    await remote(`${busybox} wget -q -O /dev/null http://127.0.0.1:4173/`);
    console.log('Service Hub relancé. Actualise l’onglet existant ; frame open reste disponible pour une ouverture explicite.');
    return;
  }
  const current = JSON.parse(await remote('cat ' + base + '/www/hub-release.json'));
  if (!/^\d+\.\d+\.\d+$/.test(current.version)) throw Error('Version installée invalide');
  console.log(await remote('am start -a android.intent.action.VIEW -d ' + quote('http://127.0.0.1:4173/?v=' + current.version) + ' -p org.mozilla.firefox'));
  console.log('Firefox ouvert. Dans Hub : Réglages → Plein écran. Le démarrage automatique reste à valider.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
