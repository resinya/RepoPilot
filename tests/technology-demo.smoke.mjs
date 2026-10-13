// Run the exact complete code blocks in the published example, using separately installed deps.
// Usage: node tests/technology-demo.smoke.mjs <isolated-demo-node_modules>
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

const dependencies = process.argv[2];
if (!dependencies) throw new Error('Provide isolated node_modules; this test does not install packages.');
const source = await readFile(new URL('../skills/repo-pilot/references/examples/technology-demo.md', import.meta.url), 'utf8');
const directory = await mkdtemp(path.join(tmpdir(), 'repopilot-grpc-doc-'));
let server;
const exitOf = (child) => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('close', (code) => resolve(code));
});
const launch = (file, args = [], extra = {}) => spawn(process.execPath, [file, ...args], {
  cwd: directory,
  env: { ...process.env, NODE_PATH: path.resolve(dependencies), ...extra },
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});
try {
  for (const file of ['package.json', 'hello.proto', 'server.js', 'client.js']) {
    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = source.match(new RegExp(`^### ${escaped}\\r?\\n\\r?\\n\x60\x60\x60[^\\n]*\\n([\\s\\S]*?)\\r?\\n\x60\x60\x60`, 'm'));
    assert.ok(match, `Missing complete block for ${file}`);
    await writeFile(path.join(directory, file), `${match[1]}\n`);
  }
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
  for (const [name, version] of Object.entries(manifest.dependencies)) {
    const actual = JSON.parse(await readFile(path.join(dependencies, ...name.split('/'), 'package.json'), 'utf8'));
    assert.equal(actual.version, version, `Example dependency mismatch: ${name}`);
  }
  // Ask the OS for an unused loopback port; neither target project nor real service is contacted.
  const probe = net.createServer();
  await new Promise((resolve, reject) => probe.once('error', reject).listen(0, '127.0.0.1', resolve));
  const port = String(probe.address().port);
  await new Promise((resolve) => probe.close(resolve));
  server = launch('server.js', [], { DEMO_PORT: port });
  const serverExit = exitOf(server);
  let serverOutput = '';
  let serverError = '';
  server.stderr.on('data', (chunk) => { serverError += chunk; });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server startup timeout: ${serverError}`)), 10000);
    server.stdout.on('data', (chunk) => {
      serverOutput += chunk;
      if (serverOutput.includes(`服务端监听 127.0.0.1:${port}`)) { clearTimeout(timer); resolve(); }
    });
    serverExit.then((code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${serverError}`)); });
  });
  const call = async (args) => {
    const client = launch('client.js', args, { DEMO_PORT: port });
    let stdout = '', stderr = '';
    client.stdout.on('data', (chunk) => { stdout += chunk; });
    client.stderr.on('data', (chunk) => { stderr += chunk; });
    const timeout = setTimeout(() => client.kill(), 10000);
    try { return { code: await exitOf(client), stdout: stdout.trim(), stderr: stderr.trim() }; }
    finally { clearTimeout(timeout); }
  };
  for (const [args, name] of [[['小王'], '小王'], [['小李'], '小李'], [[], '小王']]) {
    const result = await call(args);
    assert.equal(result.code, 0, result.stderr);
    assert.equal(result.stdout, `你好，${name}！`);
    assert.ok(serverOutput.includes(`收到 name: ${name}`));
  }
  server.kill();
  await serverExit;
  const unavailable = await call(['小王']);
  assert.equal(unavailable.code, 1);
  assert.match(unavailable.stderr, /调用失败: 14 /);
  assert.equal(unavailable.stdout, '');
  console.log('PASS: documented source, pinned deps, Unicode/default inputs, separate-process reply, and unavailable-server error.');
} finally {
  if (server && server.exitCode === null && server.signalCode === null) {
    const closed = exitOf(server);
    server.kill();
    await closed;
  }
  assert.equal(path.dirname(path.resolve(directory)), path.resolve(tmpdir()));
  assert.ok(path.basename(directory).startsWith('repopilot-grpc-doc-'));
  await rm(directory, { recursive: true, force: true });
}
