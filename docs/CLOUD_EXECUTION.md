# Cloud execution — no always-on local PC required

CommitLedger does **not** fundamentally depend on Remote Desktop Commander.

A real Canton/Daml proof only needs a Linux-capable environment that can:
- run Node.js 22;
- run Java 21;
- install the pinned DPM bundle;
- access GitHub and Digital Asset download endpoints;
- keep local ports available while the proof runs.

## Preferred automation order

### 1. GitHub Actions — zero-touch target

This is the preferred final state. A push/PR should execute Node tests, Daml build/tests, a fresh Canton sandbox, evidence capture and repository gates automatically.

At the moment the repository's hosted jobs are failing before a runner is allocated (`steps: []`, `runner_id: 0`). That is an infrastructure/account-level blocker until GitHub actually assigns a runner. Do not treat it as a failing test.

When hosted Actions begins allocating runners, no personal computer or Remote Desktop session is needed.

### 2. GitHub Codespaces — easiest manual fallback

The repository contains `.devcontainer/devcontainer.json`.

Open the repository in a Codespace and let the container bootstrap. It installs:
- Node 22;
- Java 21;
- Python 3;
- pinned DPM via `scripts/bootstrap-dpm.sh`;
- then runs the Node test suite.

After creation, run:

```bash
export GITHUB_TOKEN=...
bash scripts/run-local-proof.sh
```

If the repository becomes public and the fixture is public, the GitHub token requirement may be removable depending on GitHub API/rate-limit needs.

To keep the judge UI open after a successful proof:

```bash
COMMITLEDGER_SERVE_AFTER_PROOF=true bash scripts/run-local-proof.sh
```

Codespaces usage/availability depends on the GitHub account and its configured quota/billing. CommitLedger does not change billing settings automatically.

### 3. Remote Desktop Commander — optional fallback

Use only when a local development machine is convenient. It is useful because the agent can execute commands and inspect the running browser, but it is not an architectural dependency.

The device must be online only while the agent is actively executing local commands. It does not need to remain connected after evidence has been captured and retained.

## One coherent proof rule

Regardless of environment, the final evidence must come from:
- one source commit;
- one run ID;
- one real Canton runtime;
- retained Node/Daml/runtime logs.

Never combine a Node log from one commit with a Canton proof from another and mark the result green.
