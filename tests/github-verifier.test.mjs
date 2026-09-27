import test from "node:test";
import assert from "node:assert/strict";
import { normalizePullRequest, assertExpectedPullRequest, buildMergeEvidence } from "../src/github-verifier.mjs";

const payload = {
  number: 7,
  html_url: "https://github.com/Saidur-droid/CommitLedger/pull/7",
  merged: true,
  merged_at: "2026-09-27T00:00:00Z",
  user: { login: "octocat" },
  head: { sha: "abc123" },
  base: { ref: "main", repo: { full_name: "Saidur-droid/CommitLedger" } }
};

test("normalizes and validates exact merged PR evidence", () => {
  const pr = normalizePullRequest(payload);
  assertExpectedPullRequest(pr, {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 7,
    headSha: "abc123",
    baseBranch: "main",
    contributorGithub: "octocat"
  });
  const evidence = buildMergeEvidence(pr);
  assert.equal(evidence.merged, true);
  assert.match(evidence.evidenceHash, /^sha256:[a-f0-9]{64}$/);
});

test("rejects an unmerged PR", () => {
  const pr = normalizePullRequest({ ...payload, merged: false, merged_at: null });
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 7
  }), /not merged/);
});

test("rejects repository or author mismatch", () => {
  const pr = normalizePullRequest(payload);
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "another/repo",
    prNumber: 7
  }), /repository mismatch/);
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 7,
    contributorGithub: "mallory"
  }), /author mismatch/);
});
