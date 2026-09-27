# Judge Runbook

The target judge path is short, reproducible, and evidence-first.

## A. Inspect the real GitHub fixture

- Open bounty source: https://github.com/Saidur-droid/CommitLedger/issues/5
- Merged pull request: https://github.com/Saidur-droid/CommitLedger/pull/6
- PR #6 explicitly references issue #5 but intentionally does **not** close it.
- This keeps the source issue valid for repeatable bounty-creation demos.
- This is competition/demo evidence, not a traction claim.

## B. Run local verification

Requirements: Node.js 22+.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`.

If this repository is private, export a GitHub token with read access:

```bash
export GITHUB_TOKEN=...
npm start
```

The canonical verifier checks repository, PR number, author, base branch, merged state, and the exact reference to issue #5. The issue number is included in the SHA-256 merge evidence.

## C. Run Daml contract tests

The Daml project is in `daml/` and is pinned to the stable open-source DPM SDK bundle **3.5.12**.

```bash
bash scripts/bootstrap-dpm.sh
bash scripts/verify-all.sh
```

Daml tests cover:
- happy path;
- explicit revision / resubmission;
- unauthorized verifier;
- unmerged evidence;
- wrong head SHA;
- wrong bounty issue number;
- unauthorized settlement;
- duplicate settlement replay.

## D. Configure three Canton roles

```bash
export CANTON_JSON_API_URL=http://localhost:3975
export CANTON_PACKAGE_ID=...
export CANTON_MAINTAINER_PARTY=...
export CANTON_CONTRIBUTOR_PARTY=...
export CANTON_VERIFIER_PARTY=...
```

For LocalNet, one token with rights for all demo parties may be used:

```bash
export CANTON_TOKEN=...
```

Or use role-specific tokens:

```bash
export CANTON_MAINTAINER_TOKEN=...
export CANTON_CONTRIBUTOR_TOKEN=...
export CANTON_VERIFIER_TOKEN=...
```

## E. Run the full real lifecycle

```bash
npm run demo:full
```

The runner performs:

`Issue #5 -> Bounty -> ClaimRequest -> ClaimedBounty -> SubmittedBounty -> VerifiedBounty -> SettlementReceipt`

For every Canton transition it captures:
- `updateId`;
- `completionOffset`;
- active `contractId`;
- template and create argument.

The final proof bundle contains the GitHub evidence hash and the active `SettlementReceipt`.

To persist the evidence bundle:

```bash
export COMMITLEDGER_EVIDENCE_FILE=./commitledger-evidence.json
npm run demo:full
```

## F. UI judge path

Run `npm start`, open the local app, and use **Run live Canton lifecycle**.

The button remains disabled until package, three distinct parties, and token configuration are present. The UI never fabricates a green Canton state.

## Final evidence capture

Before submission capture:
- Daml build/test output;
- Node test output;
- issue #5 + PR #6 canonical GitHub evidence;
- each Canton update ID and contract ID;
- final `SettlementReceipt`;
- one authorization failure;
- duplicate-settlement failure;
- final demo video.

Do not call the project fully runtime-verified until these artifacts exist.
