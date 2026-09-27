import crypto from "node:crypto";

function githubHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "CommitLedger"
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function parseGitHubIssueUrl(value) {
  let url;
  try {
    url = new URL(String(value || "").trim());
  } catch {
    throw new Error("Enter a valid GitHub issue URL");
  }
  if (!["github.com", "www.github.com"].includes(url.hostname)) throw new Error("Issue URL must point to github.com");
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 4 || parts[2] !== "issues") throw new Error("Use github.com/owner/repo/issues/123");
  const issueNumber = Number(parts[3]);
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) throw new Error("Invalid GitHub issue number");
  return { owner: parts[0], repo: parts[1], repository: `${parts[0]}/${parts[1]}`, issueNumber };
}

export function normalizeIssue(payload, repository) {
  if (!payload || typeof payload !== "object") throw new Error("GitHub issue payload is required");
  if (payload.pull_request) throw new Error("That URL points to a pull request, not an issue");
  if (!Number.isInteger(payload.number) || !payload.html_url || !payload.title) {
    throw new Error("Incomplete GitHub issue payload");
  }
  return {
    repository,
    issueNumber: payload.number,
    issueUrl: payload.html_url,
    title: payload.title,
    state: payload.state,
    author: payload.user?.login ?? "",
    body: payload.body ?? ""
  };
}

export async function fetchGitHubIssue({ issueUrl, token }) {
  const parsed = parseGitHubIssueUrl(issueUrl);
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}/issues/${parsed.issueNumber}`,
    { headers: githubHeaders(token) }
  );
  if (!response.ok) throw new Error(`GitHub issue lookup failed: ${response.status} ${response.statusText}`);
  const issue = normalizeIssue(await response.json(), parsed.repository);
  if (issue.state !== "open") throw new Error("Bounty source issue must be open");
  return issue;
}

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
  if (pr.repository.toLowerCase() !== expected.repository.toLowerCase()) throw new Error("repository mismatch");
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
  const response = await fetch(`https://api.github.com/repos/${repository}/pulls/${prNumber}`, {
    headers: githubHeaders(token)
  });
  if (!response.ok) throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);

  const pr = normalizePullRequest(await response.json());
  assertExpectedPullRequest(pr, { repository, prNumber, ...expected });
  return buildMergeEvidence(pr);
}
