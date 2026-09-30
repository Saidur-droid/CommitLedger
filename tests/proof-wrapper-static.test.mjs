import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const wrapper = await fs.readFile(new URL('../scripts/prove-and-report.sh', import.meta.url), 'utf8');
const shellVerify = await fs.readFile(new URL('../scripts/verify-all.sh', import.meta.url), 'utf8');
const nodeVerify = await fs.readFile(new URL('../scripts/verify-all.mjs', import.meta.url), 'utf8');
const runner = await fs.readFile(new URL('../scripts/run-local-proof.sh', import.meta.url), 'utf8');

test('single proof wrapper always reports exit status and useful diagnostics', () => {
  assert.match(wrapper, /EXIT STATUS/);
  assert.match(wrapper, /canton-demo\.log/);
  assert.match(wrapper, /canton-sandbox\.log/);
  assert.match(wrapper, /daml-tests\.log/);
  assert.match(wrapper, /node-tests\.log/);
});

test('shell verifier is only a compatibility exec wrapper', () => {
  assert.match(shellVerify, /exec node scripts\/verify-all\.mjs/);
  assert.doesNotMatch(shellVerify, /npm test/);
  assert.doesNotMatch(shellVerify, /dpm build/);
});

test('Node verifier owns all four deterministic verification stages', () => {
  for (const marker of ['STAGE 1/4: Node','STAGE 2/4: DPM','STAGE 3/4: Daml build','STAGE 4/4: Daml tests']) {
    assert.match(nodeVerify, new RegExp(marker.replaceAll('/', '\\/')));
  }
  assert.match(nodeVerify, /function run\(label, command, args/);
  assert.match(nodeVerify, /spawnSync\(command, args/);
  assert.match(nodeVerify, /run\("STAGE 1\/4: Node", "npm", \["test"\]/);
  assert.match(nodeVerify, /spawnSync\("dpm", \["version", "--active"\]/);
  assert.match(nodeVerify, /run\("STAGE 3\/4: Daml build", "dpm", \["build"\]/);
  assert.match(nodeVerify, /run\("STAGE 4\/4: Daml tests", "dpm", \["test"\]/);
  assert.match(nodeVerify, /BUILD\/TEST VERIFICATION COMPLETE/);
});

test('real proof runner invokes the Node verifier directly', () => {
  assert.match(runner, /node scripts\/verify-all\.mjs/);
  assert.doesNotMatch(runner, /bash scripts\/verify-all\.sh/);
});
