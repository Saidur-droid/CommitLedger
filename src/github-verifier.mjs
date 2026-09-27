import crypto from "node:crypto";

export function normalizePullRequest(payload) {
  if (!payload || typeof payload !== "object") throw new Error("GitHub payload is required");
  const repository = payload.base?.repo?.full_name;
  const prNumber = payload.number;
  const prUrl = payload.html_url;
  const headSha = payload.head?.sha;
  const baseBranch = payload.base?.ref;
  const merged = payload.merged === true;
  const mergedAt = payload.merged_at ?? "";
  const author = payload.user?.login ?? "";

  if (!repository || !Number.isInteger(prNumber) || !prUrl || !headSha || !baseBranch) {
    throw new Error("Incomplete GitHub pull request payload");
  }

  return { repository, prNumber, prUrl, headSha, baseBranch, merged, mergedAt, author };
}

export function assertExpectedPullRequest(pr, expected) {
  if (pr.repository !== expected.repository) throw new Error("repository mismatch");
  if (pr.prNumber !== expected.prNumber) throw new Error("pull request number mismatch");
  if (expected.headSha && pr.headSha !== expected.headSha) throw new Error("head SHA mismatch");
  if (expected.baseBranch && pr.baseBranch !== expected.baseBranch) throw new Error("base branch mismatch");
  if (expected.contributorGithub && pr.author.toLowerCase() !== expected.contributorGithub.toLowerCase()) {
    throw new Error("pull request author mismatch");
  }
  if (!pr.merged) throw new Error("pull request is not merged");
  if (!pr.mergedAt) throw new Error("merged pull request is missing merged_at");
  return pr;
}

export function buildMergeEvidence(pr) {
  const canonical = JSON.stringify({
    repository: pr.repository,
    prNumber: pr.prNumber,
    prUrl: pr.prUrl,
    headSha: pr.headSha,
    baseBranch: pr.baseBranch,
    merged: pr.merged,
    mergedAt: pr.mergedAt
  });
  return {
    repository: pr.repository,
    prNumber: pr.prNumber,
    prUrl: pr.prUrl,
    headSha: pr.headSha,
    baseBranch: pr.baseBranch,
    merged: pr.merged,
    mergedAt: pr.mergedAt,
    evidenceHash: "sha256:" + crypto.createHash("sha256").update(canonical).digest("hex")
  };
}

export async function fetchVerifiedPullRequest({ repository, prNumber, token, expected = {} }) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "CommitLedger"
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.github.com/repos/${repository}/pulls/${prNumber}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const pr = normalizePullRequest(payload);
  assertExpectedPullRequest(pr, { repository, prNumber, ...expected });
  return buildMergeEvidence(pr);
}
