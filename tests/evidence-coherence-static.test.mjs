import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const checker = await fs.readFile(new URL('../scripts/check-evidence.mjs', import.meta.url), 'utf8');
const verifier = await fs.readFile(new URL('../scripts/verify-all.sh', import.meta.url), 'utf8');
const runner = await fs.readFile(new URL('../scripts/run-local-proof.sh', import.meta.url), 'utf8');

test('verification and Canton proof must be bound to the same exact commit', () => {
  assert.match(verifier, /git rev-parse HEAD/);
  assert.match(checker, /proof\.sourceCommit!==verification\.commit/);
  assert.match(checker, /\^\[a-f0-9\]\{40\}\$/);
  assert.match(runner, /export GITHUB_SHA/);
});
