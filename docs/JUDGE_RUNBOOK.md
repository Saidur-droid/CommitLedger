# Judge Runbook

The target judge path is short, deterministic and evidence-first.

## A. Inspect the real GitHub fixture

- Issue: https://github.com/Saidur-droid/CommitLedger/issues/5
- Pull request: https://github.com/Saidur-droid/CommitLedger/pull/6
- The PR closes the issue through a real GitHub merge.
- This is a competition evidence fixture, not a traction claim.

## B. Run the zero-dependency verifier

Requirements: Node.js 22+.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`.

For a private repository, export a GitHub token with read access before starting:

```bash
export GITHUB_TOKEN=...
npm start
```

The UI asks GitHub directly for PR #6 and prints canonical merge evidence plus its SHA-256 evidence hash.

## C. Run Daml contract tests

The Daml project is in `daml/` and targets SDK 3.5.2.

Using the supported Daml/DPM toolchain, build/test the project from that directory. The tests cover:
- happy path;
- unauthorized verifier;
- unmerged evidence;
- unauthorized settlement;
- duplicate settlement replay.

## D. Connect to Canton LocalNet

The repository follows the Canton Network Quickstart JSON Ledger API pattern. Configure:

```bash
cp .env.example .env
export CANTON_JSON_API_URL=http://localhost:3975
export CANTON_TOKEN=...
export CANTON_ACT_AS=...
export CANTON_PACKAGE_ID=...
```

Then submit a real Bounty create command:

```bash
bash scripts/create-demo-bounty.sh
```

The expected success proof is the JSON Ledger API response containing an update identifier/completion result and an active `Bounty` contract visible from the configured participant.

## E. Final evidence capture

Before competition submission, capture:
- Daml build/test output;
- Node test output;
- PR #6 canonical GitHub evidence;
- Canton JSON Ledger API response;
- active contract / final `SettlementReceipt` evidence;
- one unauthorized transition failure;
- one duplicate-settlement failure.

Do not call the project fully verified until those runtime artifacts are captured.
