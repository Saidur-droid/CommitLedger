# Build Status

_Last updated: 2026-09-27._

## Implemented

- Two locked goals remain the governing gates: verified competition compliance and #1-caliber judge quality.
- Role-separated Daml lifecycle: Maintainer -> Contributor -> Verifier -> Maintainer receipt.
- Explicit revision / resubmission path.
- Evidence binding across repository, source issue number, PR number, PR URL, head SHA, base branch and merge timestamp.
- Daml rejection cases for wrong issue, wrong SHA, unmerged work, unauthorized verification, unauthorized settlement and replay.
- Canton JSON Ledger API v2 client with active-contract discovery.
- Full lifecycle orchestrator that automatically carries real contract IDs from stage to stage.
- Runtime negative checks for wrong-issue evidence, unauthorized settlement and duplicate settlement.
- Final active `SettlementReceipt` discovery and proof bundle.
- Local judge UI with real update-ID / contract-ID timeline and receipt view.
- One-command CLI: `npm run demo:full`.
- Real GitHub fixture: open issue #5 + merged PR #6 that references #5 without closing it.
- Free/local-first runtime configuration; no Vercel, Supabase or paid API dependency.

## Verified external fixture

As of 2026-09-27:
- issue #5 is open;
- PR #6 is merged;
- PR #6 body references issue #5;
- repository, PR and issue all belong to `Saidur-droid/CommitLedger`.

This fixture is competition/demo evidence, not user traction.

## Toolchain baseline

CommitLedger pins the stable open-source DPM SDK bundle **3.5.12**.

The current upstream 3.5 assembly manifest used during this build reports:
- SDK bundle: 3.5.12;
- Canton open source: 3.5.19;
- damlc: 3.5.3;
- Daml Script: 3.5.3.

## Test status

An earlier Node verifier baseline was executed successfully (3 passed, 0 failed).

Since then the repository test suite has been expanded substantially to cover:
- domain transitions and distinct role enforcement;
- issue-bound GitHub evidence;
- Canton command builders;
- active-contract parsing;
- runtime configuration.

Do **not** describe the expanded suite as green until `npm test` is rerun in an execution environment with the current branch.

## Runtime evidence gate

The current ChatGPT sandbox cannot install the official DPM bundle from the Digital Asset distribution endpoint, and the private repository's GitHub-hosted Actions jobs have previously failed before runner steps execute.

Therefore these are intentionally not marked verified yet:
- current Daml compile success;
- current Daml Script test success;
- DAR deployment to Canton LocalNet;
- real full lifecycle execution through `SettlementReceipt`;
- captured runtime update IDs / contract IDs;
- captured runtime negative-check failures;
- final demo recording.

The repository contains the commands required to produce those artifacts on an internet-connected Canton development environment:

```bash
bash scripts/bootstrap-dpm.sh
bash scripts/verify-all.sh
npm run demo:full
```

## Submission rule

CommitLedger may only be called **final submission ready** after every runtime item in `docs/EVIDENCE_MANIFEST.md` has real captured evidence.
