import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchGitHubIssue, fetchVerifiedPullRequest } from "./github-verifier.mjs";
import { validateBountyDraft } from "./domain.mjs";
import {
  buildCreateBountyCommand,
  buildClaimRequestCommand,
  buildAcceptClaimCommand,
  buildSubmitPullRequestCommand,
  buildReturnForRevisionCommand,
  buildVerifyMergedCommand,
  buildSettleCommand
} from "./canton-commands.mjs";
import { CantonJsonApi } from "./canton-json-api.mjs";
import { runtimeConfigFromEnv, runFullLifecycle } from "./orchestrator.mjs";

const root = fileURLToPath(new URL("../web/", import.meta.url));
const port = Number(process.env.PORT || 4173);

function json(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("request body too large");
  }
  return body ? JSON.parse(body) : {};
}

function contentType(path) {
  return ({
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml"
  })[extname(path)] || "application/octet-stream";
}

async function serveStatic(urlPath, res) {
  const clean = normalize(urlPath === "/" ? "/index.html" : urlPath).replace(/^([.][.][/\\])+/, "");
  const target = join(root, clean);
  if (!target.startsWith(root)) return json(res, 403, { error: "forbidden" });
  try {
    const body = await readFile(target);
    res.writeHead(200, { "Content-Type": contentType(target), "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    json(res, 404, { error: "not found" });
  }
}

function cantonConfigured() {
  return Boolean(process.env.CANTON_JSON_API_URL && (process.env.CANTON_TOKEN || process.env.CANTON_MAINTAINER_TOKEN));
}

function lifecycleConfigured() {
  try {
    runtimeConfigFromEnv();
    return true;
  } catch {
    return false;
  }
}

function cantonApi() {
  const token = process.env.CANTON_TOKEN || process.env.CANTON_MAINTAINER_TOKEN;
  if (!process.env.CANTON_JSON_API_URL || !token) return null;
  return new CantonJsonApi({ baseUrl: process.env.CANTON_JSON_API_URL, token });
}

async function submitCanton(command, actAs, workflowId) {
  const api = cantonApi();
  if (!api) throw new Error("Canton LocalNet is not configured");
  return api.submitAndWait({
    commands: [command],
    actAs,
    workflowId,
    commandId: `commitledger-${workflowId}-${Date.now()}`
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, 200, {
        ok: true,
        service: "CommitLedger",
        cantonConfigured: cantonConfigured(),
        lifecycleConfigured: lifecycleConfigured(),
        githubAuthenticated: Boolean(process.env.GITHUB_TOKEN),
        packageConfigured: Boolean(process.env.CANTON_PACKAGE_ID)
      });
    }

    if (req.method === "POST" && url.pathname === "/api/bounty/prepare") {
      const input = await readJson(req);
      const issue = await fetchGitHubIssue({ issueUrl: input.issueUrl, token: process.env.GITHUB_TOKEN });
      const bounty = validateBountyDraft({
        repository: issue.repository,
        issueNumber: issue.issueNumber,
        issueUrl: issue.issueUrl,
        title: input.title || issue.title,
        rewardAmount: input.rewardAmount,
        rewardUnit: "DEMO_CREDIT"
      });
      return json(res, 200, { ok: true, issue, bounty });
    }

    if (req.method === "POST" && url.pathname === "/api/github/verify") {
      const input = await readJson(req);
      const evidence = await fetchVerifiedPullRequest({
        repository: input.repository,
        prNumber: Number(input.prNumber),
        token: process.env.GITHUB_TOKEN,
        expected: {
          headSha: input.headSha || "",
          baseBranch: input.baseBranch || "",
          contributorGithub: input.contributorGithub || ""
        }
      });
      return json(res, 200, { ok: true, evidence });
    }

    if (req.method === "POST" && url.pathname === "/api/demo/run") {
      if (!lifecycleConfigured()) {
        return json(res, 503, { error: "Full Canton lifecycle is not configured. Set package, party and token environment variables." });
      }
      const input = await readJson(req);
      const proof = await runFullLifecycle({
        runtime: runtimeConfigFromEnv(),
        issueUrl: input.issueUrl,
        rewardAmount: Number(input.rewardAmount || 100),
        contributorGithub: input.contributorGithub,
        prNumber: Number(input.prNumber),
        baseBranch: input.baseBranch || "main",
        githubToken: process.env.GITHUB_TOKEN || ""
      });
      return json(res, 200, { ok: true, proof });
    }

    if (req.method === "POST" && url.pathname === "/api/canton/build-command") {
      const input = await readJson(req);
      const packageId = input.packageId || process.env.CANTON_PACKAGE_ID;
      if (!packageId) throw new Error("CANTON_PACKAGE_ID is required");
      let command;
      switch (input.action) {
        case "createBounty":
          command = buildCreateBountyCommand({ packageId, ...input.payload });
          break;
        case "claimRequest":
          command = buildClaimRequestCommand({ packageId, ...input.payload });
          break;
        case "acceptClaim":
          command = buildAcceptClaimCommand({ packageId, ...input.payload });
          break;
        case "submitPullRequest":
          command = buildSubmitPullRequestCommand({ packageId, ...input.payload });
          break;
        case "returnForRevision":
          command = buildReturnForRevisionCommand({ packageId, ...input.payload });
          break;
        case "verifyMerged":
          command = buildVerifyMergedCommand({ packageId, ...input.payload });
          break;
        case "settle":
          command = buildSettleCommand({ packageId, ...input.payload });
          break;
        default:
          throw new Error("Unknown Canton action");
      }
      return json(res, 200, { ok: true, command });
    }

    if (req.method === "POST" && url.pathname === "/api/canton/submit-command") {
      const input = await readJson(req);
      const result = await submitCanton(input.command, input.actAs, input.workflowId || "web");
      return json(res, 200, { ok: true, result });
    }

    if (req.method === "GET") return serveStatic(url.pathname, res);
    json(res, 405, { error: "method not allowed" });
  } catch (error) {
    const status = /not configured|required|invalid|mismatch|must|Unknown|distinct/.test(error.message) ? 400 : 500;
    json(res, status, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CommitLedger running at http://127.0.0.1:${port}`);
});
