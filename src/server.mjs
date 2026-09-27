import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchVerifiedPullRequest } from "./github-verifier.mjs";
import { CantonJsonApi } from "./canton-json-api.mjs";

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

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return json(res, 200, {
        ok: true,
        service: "CommitLedger",
        cantonConfigured: Boolean(process.env.CANTON_JSON_API_URL && process.env.CANTON_TOKEN),
        githubAuthenticated: Boolean(process.env.GITHUB_TOKEN)
      });
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

    if (req.method === "POST" && url.pathname === "/api/canton/submit") {
      if (!process.env.CANTON_JSON_API_URL || !process.env.CANTON_TOKEN) {
        return json(res, 503, { error: "Canton LocalNet is not configured" });
      }
      const input = await readJson(req);
      const api = new CantonJsonApi({
        baseUrl: process.env.CANTON_JSON_API_URL,
        token: process.env.CANTON_TOKEN
      });
      const result = await api.submitAndWait({
        commands: input.commands,
        actAs: input.actAs,
        readAs: input.readAs || [],
        workflowId: input.workflowId || "commitledger-web",
        commandId: input.commandId || `commitledger-${Date.now()}`
      });
      return json(res, 200, { ok: true, result });
    }

    if (req.method === "GET") return serveStatic(url.pathname, res);
    json(res, 405, { error: "method not allowed" });
  } catch (error) {
    json(res, 400, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`CommitLedger running at http://127.0.0.1:${port}`);
});
