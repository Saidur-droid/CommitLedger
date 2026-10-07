import test from "node:test";
import assert from "node:assert/strict";
import {
  parseGitHubIssueUrl,
  normalizeIssue,
  normalizePullRequest,
  assertExpectedPullRequest,
  buildMergeEvidence
} from "../src/github-verifier.mjs";

const payload = {
  number: 6,
  html_url: "https://github.com/Saidur-droid/CommitLedger/pull/6",
  body: "Competition/demo evidence for #5.",
  merged: true,
  merge_commit_sha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  merged_at: "2026-09-27T10:57:30Z",
  user: { login: "Saidur-droid" },
  head: { sha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
  base: { ref: "main", repo: { full_name: "Saidur-droid/CommitLedger" } }
};

test("parses and normalizes a real GitHub issue reference", () => {
  const parsed = parseGitHubIssueUrl("https://github.com/Saidur-droid/CommitLedger/issues/5");
  assert.equal(parsed.repository, "Saidur-droid/CommitLedger");
  assert.equal(parsed.issueNumber, 5);

  const issue = normalizeIssue({
    number: 5,
    html_url: "https://github.com/Saidur-droid/CommitLedger/issues/5",
    title: "Live Canton fixture",
    state: "open",
    user: { login: "Saidur-droid" },
    body: "proof"
  }, parsed.repository);
  assert.equal(issue.state, "open");
  assert.equal(issue.issueNumber, 5);
});

test("rejects a pull request masquerading as an issue", () => {
  assert.throws(() => normalizeIssue({
    number: 6,
    html_url: "https://github.com/Saidur-droid/CommitLedger/pull/6",
    title: "PR",
    state: "open",
    pull_request: {}
  }, "Saidur-droid/CommitLedger"), /pull request/);
});

test("binds the exact bounty issue into canonical merge evidence", () => {
  const pr = normalizePullRequest(payload);
  assertExpectedPullRequest(pr, {
    repository: "saidur-droid/commitledger",
    prNumber: 6,
    headSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    baseBranch: "main",
    contributorGithub: "Saidur-droid",
    issueNumber: 5
  });
  const evidence = buildMergeEvidence(pr);
  assert.equal(evidence.issueNumber, 5);
  assert.equal(evidence.merged, true);
  assert.match(evidence.evidenceHash, /^sha256:[a-f0-9]{64}$/);
});

test("rejects an unmerged PR", () => {
  const pr = normalizePullRequest({ ...payload, merged: false, merged_at: null });
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 6,
    issueNumber: 5
  }), /not merged/);
});

test("rejects repository, author, or bounty-issue mismatch", () => {
  const pr = normalizePullRequest(payload);
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "another/repo",
    prNumber: 6
  }), /repository mismatch/);
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 6,
    contributorGithub: "mallory"
  }), /author mismatch/);
  assert.throws(() => assertExpectedPullRequest(pr, {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 6,
    issueNumber: 999
  }), /does not reference/);
});
