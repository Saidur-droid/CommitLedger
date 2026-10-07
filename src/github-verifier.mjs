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
  if (url.protocol !== "https:" || url.username || url.password || url.port) throw new Error("Issue URL must use HTTPS without credentials or a custom port");
  if (!["github.com", "www.github.com"].includes(url.hostname)) throw new Error("Issue URL must point to github.com");
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 4 || parts[2] !== "issues") throw new Error("Use github.com/owner/repo/issues/123");
  if (!/^[1-9][0-9]*$/.test(parts[3])) throw new Error("Invalid GitHub issue number");
  const issueNumber = Number(parts[3]);
  if (!Number.isSafeInteger(issueNumber) || issueNumber <= 0) throw new Error("Invalid GitHub issue number");
  return { owner: parts[0], repo: parts[1], repository: `${parts[0]}/${parts[1]}`, issueNumber };
}

export function normalizeIssue(payload, repository) {
  if (!payload || typeof payload !== "object") throw new Error("GitHub issue payload is required");
  if (payload.pull_request) throw new Error("That URL points to a pull request, not an issue");
  if (!Number.isInteger(payload.number) || !payload.html_url || !payload.title) {
    throw new Error("Incomplete GitHub issue payload");
  }
  const canonical = parseGitHubIssueUrl(payload.html_url);
  if (canonical.repository.toLowerCase() !== repository.toLowerCase() || canonical.issueNumber !== payload.number) {
    throw new Error("canonical GitHub issue identity mismatch");
  }
  return {
    repository: canonical.repository,
    issueNumber: payload.number,
    issueUrl: payload.html_url,
    title: payload.title,
    state: payload.state,
    author: payload.user?.login ?? "",
    body: payload.body ?? ""
  };
}

export async function fetchGitHubIssue({ issueUrl, token, requireOpen = true }) {
  const parsed = parseGitHubIssueUrl(issueUrl);
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}/issues/${parsed.issueNumber}`,
    { headers: githubHeaders(token), signal: AbortSignal.timeout(30_000) }
  );
  if (!response.ok) throw new Error(`GitHub issue lookup failed: ${response.status} ${response.statusText}`);
  const issue = normalizeIssue(await response.json(), parsed.repository);
  if (issue.issueNumber !== parsed.issueNumber) throw new Error("GitHub issue number mismatch");
  if (requireOpen && issue.state !== "open") throw new Error("Bounty source issue must be open");
  return issue;
}

export function normalizePullRequest(payload) {
  if (!payload || typeof payload !== "object") throw new Error("GitHub payload is required");
  const repository = payload.base?.repo?.full_name;
  const prNumber = payload.number;
  const prUrl = payload.html_url;
  const headSha = payload.head?.sha;
  const mergeCommitSha = payload.merge_commit_sha ?? "";
  const baseBranch = payload.base?.ref;
  const merged = payload.merged === true;
  const mergedAt = payload.merged_at ?? "";
  const author = payload.user?.login ?? "";
  const body = payload.body ?? "";

  if (!repository || !Number.isInteger(prNumber) || !prUrl || !headSha || !baseBranch) {
    throw new Error("Incomplete GitHub pull request payload");
  }

  return { repository, prNumber, prUrl, headSha, mergeCommitSha, baseBranch, merged, mergedAt, author, body };
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
  if (!pr.mergedAt || !Number.isFinite(Date.parse(pr.mergedAt))) throw new Error("merged pull request is missing valid merged_at");
  if (!/^[a-f0-9]{40}$/i.test(pr.headSha)) throw new Error("invalid head SHA");
  if (!/^[a-f0-9]{40}$/i.test(pr.mergeCommitSha)) throw new Error("merged pull request is missing valid merge commit SHA");
  if (expected.mergeCommitSha && pr.mergeCommitSha !== expected.mergeCommitSha) throw new Error("merge commit SHA mismatch");
  const prUrl = new URL(pr.prUrl);
  if (prUrl.protocol !== "https:" || prUrl.hostname !== "github.com" || prUrl.username || prUrl.password || prUrl.port ||
      prUrl.pathname.toLowerCase() !== `/${pr.repository}/pull/${pr.prNumber}`.toLowerCase()) {
    throw new Error("canonical pull request URL mismatch");
  }
  if (expected.issueNumber !== undefined) {
    const issueNumber = Number(expected.issueNumber);
    if (!Number.isSafeInteger(issueNumber) || issueNumber <= 0) throw new Error("invalid bounty issue number");
    if (!referencesIssue(pr.body, expected.repository, issueNumber)) throw new Error("pull request does not reference the bounty issue");
    pr.issueNumber = issueNumber;
  }
  return pr;
}

export function buildMergeEvidence(pr) {
  if (!Number.isInteger(pr.issueNumber) || pr.issueNumber <= 0) {
    throw new Error("verified pull request is missing the bounty issue number");
  }
  if (!pr.merged || !/^[a-f0-9]{40}$/i.test(pr.mergeCommitSha)) throw new Error("valid merged commit evidence is required");
  const canonical = JSON.stringify({
    repository: pr.repository,
    issueNumber: pr.issueNumber,
    prNumber: pr.prNumber,
    prUrl: pr.prUrl,
    headSha: pr.headSha,
    mergeCommitSha: pr.mergeCommitSha,
    baseBranch: pr.baseBranch,
    merged: pr.merged,
    mergedAt: pr.mergedAt
  });
  return {
    repository: pr.repository,
    issueNumber: pr.issueNumber,
    prNumber: pr.prNumber,
    prUrl: pr.prUrl,
    headSha: pr.headSha,
    mergeCommitSha: pr.mergeCommitSha,
    baseBranch: pr.baseBranch,
    merged: pr.merged,
    mergedAt: pr.mergedAt,
    evidenceHash: "sha256:" + crypto.createHash("sha256").update(canonical).digest("hex")
  };
}

/** Explicit issue references only; mentions are not proof of semantic issue resolution. */
export function referencesIssue(body, repository, issueNumber) {
  let found = false;
  const expected = repository.toLowerCase();
  function inspectUrl(raw) {
    try {
      const url = new URL(raw.replace(/[.,;!?]+$/, ""));
      if (url.protocol === "https:" && url.hostname === "github.com" && !url.username && !url.password && !url.port &&
          url.pathname.replace(/\/$/, "").toLowerCase() === `/${expected}/issues/${issueNumber}`) found = true;
    } catch { /* Unknown URL shapes never become local references. */ }
  }
  let text = String(body || "").replace(/<!--[\s\S]*?-->|```[\s\S]*?```|`[^`]*`/g, " ");
  // Remove entire Markdown links so a misleading label cannot override its target.
  text = text.replace(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, (_match, url) => {
    inspectUrl(url);
    return " ";
  });
  // Consume even foreign URLs before looking for bare #number references.
  text = text.replace(/(?:[a-z][a-z0-9+.-]*:\/\/|www\.)[^\s<>"'`()]+/gi, url => {
    inspectUrl(url);
    return " ";
  });
  text = text.replace(/(?:^|[^\w./-])([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)#([1-9][0-9]*)(?![\w/-])/g, (_match, repo, number) => {
    if (repo.toLowerCase() === expected && Number(number) === issueNumber) found = true;
    return " ";
  });
  const local = /(?:^|[\s([{,:;])#([1-9][0-9]*)(?=$|[\s)\]},.!?;:])/g;
  for (const match of text.matchAll(local)) if (Number(match[1]) === issueNumber) found = true;
  return found;
}

async function githubJson(path, token) {
  const response = await fetch(`https://api.github.com/repos/${path}`, {
    headers: githubHeaders(token), signal: AbortSignal.timeout(30_000)
  });
  if (!response.ok) throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);
  return response.json();
}

export async function fetchVerifiedPullRequest({ repository, prNumber, token, expected = {} }) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) || !Number.isSafeInteger(prNumber) || prNumber <= 0) {
    throw new Error("invalid repository or pull request number");
  }
  const pr = normalizePullRequest(await githubJson(`${repository}/pulls/${prNumber}`, token));
  // Expected values cannot override the canonical repository/PR requested above.
  assertExpectedPullRequest(pr, { ...expected, repository, prNumber });
  const commit = await githubJson(`${repository}/commits/${pr.mergeCommitSha}`, token);
  if (commit.sha !== pr.mergeCommitSha) throw new Error("canonical merge commit SHA mismatch");
  const comparison = await githubJson(`${repository}/compare/${pr.mergeCommitSha}...${encodeURIComponent(pr.baseBranch)}`, token);
  if (!["ahead", "identical"].includes(comparison.status)) throw new Error("merge commit is not reachable from the expected base branch");
  return buildMergeEvidence(pr);
}
