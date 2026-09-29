import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const script = await fs.readFile(new URL('../scripts/run-local-proof.sh', import.meta.url), 'utf8');

test('uses the DPM 3.5.12 canton-port-file readiness flag only', () => {
  assert.match(script, /--canton-port-file\s+evidence\/canton-ports\.json/);
  assert.doesNotMatch(script, /--port-file\b/);
  assert.doesNotMatch(script, /--json-api-port-file\b/);
});

test('chooses a free loopback JSON API port per run', () => {
  assert.match(script, /socket\.bind\(\("127\.0\.0\.1",0\)\)/);
  assert.match(script, /CANTON_JSON_API_URL="http:\/\/127\.0\.0\.1:\$CANTON_JSON_API_PORT"/);
});

test('waits for Canton ready signal before allocating parties', () => {
  const waitIndex = script.indexOf('test -s evidence/canton-ports.json');
  const bootstrapIndex = script.indexOf('node scripts/bootstrap-local.mjs');
  assert.ok(waitIndex >= 0, 'must wait for canton-port-file');
  assert.ok(bootstrapIndex > waitIndex, 'party bootstrap must happen after ready signal');
});
