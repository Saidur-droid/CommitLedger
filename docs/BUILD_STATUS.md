# Build Status

_Last updated: 2026-09-27._

## Verified now

- Repository initialized with locked competition decisions.
- Real GitHub issue #1 created.
- Real GitHub PR #2 created and merged.
- Canonical GitHub verifier implemented.
- Node verifier unit tests executed in an independent Node.js 22 environment: **3 passed, 0 failed**.
- Local web product shell implemented.
- Canton JSON Ledger API adapter implemented using the current v2 command pattern.
- Daml contract lifecycle and negative-test source implemented.
- Architecture, threat model, judge runbook, evidence manifest and compliance gates implemented.

## Runtime gate not yet truthfully verified

The current execution environment does not have DPM/Daml installed and blocks outbound installer resolution. Therefore these are intentionally **not** marked complete:

- Daml SDK compile success.
- Daml Script runtime test success.
- DAR deployment to Canton LocalNet.
- End-to-end JSON Ledger API transitions through `SettlementReceipt`.
- Captured Canton update IDs / contract IDs.
- Final recorded demo video.

This is a tooling/runtime availability limitation, not permission to fake evidence.

## GitHub Actions note

Workflow runs have been created, but the observed jobs failed/queued before useful step execution. Do not cite CI as green until a run actually executes and passes the repository jobs.

## Submission rule

The project is not allowed to call itself final-submission-ready until every runtime gate in `docs/EVIDENCE_MANIFEST.md` has real captured evidence.
