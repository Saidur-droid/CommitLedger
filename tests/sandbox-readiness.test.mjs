import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const script = await fs.readFile(new URL('../scripts/run-local-proof.sh', import.meta.url), 'utf8');

test('waits for DPM sandbox ready port-file before allocating parties', () => {
  assert.match(script, /--port-file\s+[^\n]*ledger-api\.port/);
  assert.match(script, /--json-api-port-file\s+[^\n]*json-api\.port/);
  const waitIndex = script.indexOf('test -s evidence/ledger-api.port');
  const bootstrapIndex = script.indexOf('node scripts/bootstrap-local.mjs');
  assert.ok(waitIndex >= 0, 'must wait for non-empty ledger-api.port');
  assert.ok(bootstrapIndex > waitIndex, 'party bootstrap must happen after sandbox ready signal');
});
