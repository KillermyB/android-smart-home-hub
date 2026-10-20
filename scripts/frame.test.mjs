import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, symlink, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateConnection, collectAssets, quote } from './frame.mjs';

test('frame connection restricts the configured key to a private IPv4 SSH endpoint', () => {
  const c = { host: '192.168.1.42', port: 2222, user: 'root', key: '/private/frame key' };
  assert.equal(validateConnection(c), c);
  for (const change of [{ host: '8.8.8.8' }, { host: '192.168.1.42; id' }, { port: 22 }, { user: 'guest' }, { key: 'relative' }]) assert.throws(() => validateConnection({ ...c, ...change }));
  assert.equal(quote("a'b"), "'a'\\''b'");
});

test('frame payload hashes only static assets and rejects dotfiles or symlinks', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hub-assets-'));
  try {
    await writeFile(join(dir, 'index.html'), 'Hub');
    const assets = await collectAssets(dir);
    assert.equal(assets[0].path, 'index.html');
    assert.match(assets[0].sha256, /^[a-f0-9]{64}$/);
    await writeFile(join(dir, '.env'), 'private');
    await assert.rejects(collectAssets(dir), /non publiable/);
    await rm(join(dir, '.env'));
    await symlink('/etc/hosts', join(dir, 'hosts.txt'));
    await assert.rejects(collectAssets(dir), /symbolique/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
