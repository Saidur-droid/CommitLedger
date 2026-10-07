import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('../scripts/bootstrap-local.mjs', import.meta.url), 'utf8');

test('party bootstrap retries only the known synchronizer connection race', () => {
  assert.match(source, /PARTY_ALLOCATION_WITHOUT_CONNECTED_SYNCHRONIZER/);
  assert.match(source, /attempt<=30/);
  assert.match(source, /await delay\(1000\)/);
  assert.doesNotMatch(source, /catch\s*\([^)]*\)\s*\{\s*await delay/);
});
