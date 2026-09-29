import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const script = await fs.readFile(new URL('../scripts/run-local-proof.sh', import.meta.url), 'utf8');

test('uses only the DPM 3.5.12 canton-port-file readiness flag', () => {
  assert.match(script, /--canton-port-file\s+evidence\/canton-ports\.json/);
  assert.doesNotMatch(script, /--port-file\b/);
  assert.doesNotMatch(script, /--json-api-port-file\b/);
});

test('waits for Canton ready signal before allocating parties', () => {
  const waitIndex = script.indexOf('test -s evidence/canton-ports.json');
  const bootstrapIndex = script.indexOf('node scripts/bootstrap-local.mjs');
  assert.ok(waitIndex >= 0);
  assert.ok(bootstrapIndex > waitIndex);
});

test('refuses to force-kill unrelated listeners and records owned sandbox pid', () => {
  assert.match(script, /canton-open-source/);
  assert.match(script, /cannot prove it owns/);
  assert.match(script, /canton-sandbox\.pid/);
  assert.doesNotMatch(script, /kill -9/);
});
