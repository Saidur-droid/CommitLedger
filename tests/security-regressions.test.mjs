import test from 'node:test';
import assert from 'node:assert/strict';
import { referencesIssue, normalizePullRequest, assertExpectedPullRequest, buildMergeEvidence, fetchVerifiedPullRequest, parseGitHubIssueUrl } from '../src/github-verifier.mjs';
import { CantonApiError, expectLedgerFailure } from '../src/ledger-errors.mjs';
import { CantonJsonApi } from '../src/canton-json-api.mjs';
import { runtimeConfigFromEnv } from '../src/orchestrator.mjs';

const repository = 'Saidur-droid/CommitLedger';
const head = 'a'.repeat(40);
const merge = 'b'.repeat(40);
const payload = {
  number: 6, html_url: `https://github.com/${repository}/pull/6`, body: 'References #5.',
  merged: true, merged_at: '2026-09-27T10:57:30Z', merge_commit_sha: merge,
  user: {login: 'Saidur-droid'}, head: {sha: head}, base: {ref: 'main', repo: {full_name: repository}}
};
for (const body of [
  '#5', 'Refs #5.', '(#5)', 'References Saidur-droid/CommitLedger#5',
  `https://github.com/${repository}/issues/5`, `[issue](https://github.com/${repository}/issues/5)`,
  'Refs saidur-droid/commitledger#5'
]) test(`accepts explicit matching issue reference: ${body}`, () => {
  assert.equal(referencesIssue(body, repository, 5), true);
});
for (const body of [
  'another/repository#5', 'https://github.com/another/repository/issues/5',
  'https://example.com/issues/5', 'https://example.com/#5', '#50', '#5foo',
  '[#5](https://github.com/another/repository/issues/5)', '`#5`', '<!-- #5 -->',
  '\\#5', 'issue #500', 'https://github.com.evil.example/Saidur-droid/CommitLedger/issues/5',
  'evil/Saidur-droid/CommitLedger#5', 'http://github.com/Saidur-droid/CommitLedger/issues/5'
]) test(`rejects misleading issue reference: ${body}`, () => {
  assert.equal(referencesIssue(body, repository, 5), false);
});
test('rejects issue URLs with unsafe schemes or identity mismatch', () => {
  for (const url of ['http://github.com/a/b/issues/5', 'https://user@github.com/a/b/issues/5', 'https://github.com/a/b/issues/9007199254740992']) {
    assert.throws(() => parseGitHubIssueUrl(url));
  }
});
test('merge commit SHA is required and included in the hash', () => {
  const expected = { repository, prNumber: 6, issueNumber: 5 };
  for (const value of [null, '', 'abc', 'z'.repeat(40)]) {
    assert.throws(() => assertExpectedPullRequest(normalizePullRequest({...payload, merge_commit_sha: value}), expected), /merge commit SHA/);
  }
  const a = buildMergeEvidence(assertExpectedPullRequest(normalizePullRequest(payload), expected));
  const b = buildMergeEvidence(assertExpectedPullRequest(normalizePullRequest({...payload, merge_commit_sha: 'c'.repeat(40)}), expected));
  assert.equal(a.mergeCommitSha, merge);
  assert.notEqual(a.evidenceHash, b.evidenceHash);
  assert.throws(() => assertExpectedPullRequest(normalizePullRequest(payload), {...expected, mergeCommitSha: 'd'.repeat(40)}), /merge commit SHA mismatch/);
});
test('canonical merge commit and ancestry are verified server-side', async t => {
  const urls = [];
  t.mock.method(globalThis, 'fetch', async url => {
    urls.push(url);
    const value = url.includes('/pulls/') ? payload : url.includes('/commits/') ? {sha:merge} : {status:'ahead'};
    return Response.json(value);
  });
  const evidence = await fetchVerifiedPullRequest({repository, prNumber:6, expected:{issueNumber:5, baseBranch:'main'}});
  assert.equal(evidence.mergeCommitSha, merge);
  assert.equal(urls.length, 3);
  assert.match(urls[1], /\/commits\/b{40}$/);
  assert.match(urls[2], /\/compare\/b{40}\.\.\.main$/);
});
test('a diverged base branch does not produce merge evidence', async t => {
  t.mock.method(globalThis, 'fetch', async url => Response.json(url.includes('/pulls/') ? payload : url.includes('/commits/') ? {sha:merge} : {status:'diverged'}));
  await assert.rejects(fetchVerifiedPullRequest({repository, prNumber:6, expected:{issueNumber:5}}), /not reachable/);
});
test('a wrong canonical merge commit is rejected', async t => {
  t.mock.method(globalThis, 'fetch', async url => Response.json(url.includes('/pulls/') ? payload : {sha:'c'.repeat(40)}));
  await assert.rejects(fetchVerifiedPullRequest({repository, prNumber:6, expected:{issueNumber:5}}), /canonical merge commit SHA mismatch/);
});
const expected = {codes:['DAML_AUTHORIZATION_ERROR']};
for (const error of [
  new TypeError('fetch failed'), new Error('timeout'),
  new CantonApiError(503, {code:'DAML_AUTHORIZATION_ERROR',cause:'server unavailable'}),
  new CantonApiError(401, {code:'DAML_AUTHORIZATION_ERROR',cause:'expired JWT'}),
  new CantonApiError(403, {code:'DAML_AUTHORIZATION_ERROR',cause:'token lacks rights'}),
  new CantonApiError(429, {code:'DAML_AUTHORIZATION_ERROR',cause:'rate limit'}),
  new CantonApiError(400, {code:'INVALID_ARGUMENT',cause:'wrong command schema'}),
  new CantonApiError(400, {raw:'DAML_AUTHORIZATION_ERROR'})
]) test(`does not treat infrastructure/configuration failure as authorization proof: ${error.message}`, async () => {
  await assert.rejects(expectLedgerFailure('unauthorized', async () => {throw error;}, expected), /Unproven ledger rejection/);
});
test('only an explicit ledger authorization error proves rejection', async () => {
  const result = await expectLedgerFailure('unauthorized', async () => {
    throw new CantonApiError(400, {code:'DAML_AUTHORIZATION_ERROR',cause:'Wrong controller'});
  }, expected);
  assert.equal(result.rejected, true);
  assert.equal(result.code, 'DAML_AUTHORIZATION_ERROR');
});
test('an unexpectedly successful negative check fails the run', async () => {
  await assert.rejects(expectLedgerFailure('unauthorized', async () => ({}), expected), /did not occur/);
});
test('wrong-issue rejection must name the issue mismatch, not another assertion', async () => {
  await assert.rejects(expectLedgerFailure('wrong issue', async () => {
    throw new CantonApiError(400, {code:'DAML_UNHANDLED_EXCEPTION',cause:'different failed assertion'});
  }, {codes:['DAML_UNHANDLED_EXCEPTION'],contains:'evidence issue number mismatch'}), /Unproven/);
});
test('Canton client preserves structured error details', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({code:'DAML_AUTHORIZATION_ERROR',cause:'wrong role'}, {status:400}));
  const api = new CantonJsonApi({baseUrl:'http://localhost:3975',token:'unit-token'});
  await assert.rejects(api.request('/unit-test'), e => e instanceof CantonApiError && e.code === 'DAML_AUTHORIZATION_ERROR' && e.status === 400);
});
test('Canton commands use v2 userId and synchronizerId names', async t => {
  let body;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {body=JSON.parse(options.body);return Response.json({});});
  await new CantonJsonApi({baseUrl:'http://localhost:3975',token:'unit-token'}).submitAndWait({commands:[],actAs:[],commandId:'unit'});
  assert.ok('userId' in body && 'synchronizerId' in body);
  assert.equal('applicationId' in body, false);
  assert.equal('domainId' in body, false);
});
test('insecure sandbox configuration cannot target a remote server', () => {
  assert.throws(() => new CantonJsonApi({baseUrl:'https://remote.example',insecureLocal:true}), /loopback/);
  assert.throws(() => runtimeConfigFromEnv({CANTON_JSON_API_URL:'https://remote.example',CANTON_INSECURE_LOCAL:'true'}), /loopback/);
});
test('ambiguous active contracts cannot silently choose an old demo receipt', async t => {
  const entry = {contractEntry:{JsActiveContract:{createdEvent:{contractId:'unit-cid',templateId:'pkg:CommitLedger:Bounty',createArgument:{}}}}};
  t.mock.method(globalThis, 'fetch', async () => Response.json([entry,entry]));
  const api=new CantonJsonApi({baseUrl:'http://localhost:3975',token:'unit-token'});
  await assert.rejects(api.findActiveContract({party:'unit-party',templateId:'pkg:CommitLedger:Bounty',activeAtOffset:1}), /Ambiguous/);
});
