# Build Status

_Last updated: 2026-09-27._

## Verified now

- Repository initialized with locked competition decisions.
- Real GitHub issue #1 created.
- Real GitHub PR #2 created and merged.
- Canonical GitHub verifier implemented.
- Node verifier unit tests executed in Node.js 22: **3 passed, 0 failed**.
- Local web product shell implemented.
- Canton JSON Ledger API adapter implemented using the v2 command pattern.
- Daml contract lifecycle and negative-test source implemented.
- Architecture, threat model, judge runbook, evidence manifest and compliance gates implemented.
- Daml project pinned to the current stable DPM 3.5 bundle: **SDK 3.5.12**.

## Current official toolchain baseline

The upstream open-source DPM 3.5 stable manifest currently reports:
- SDK bundle: 3.5.12
- Canton open source: 3.5.19
- damlc: 3.5.3
- Daml Script: 3.5.3

CommitLedger pins `sdk-version: 3.5.12` to the stable bundle instead of a snapshot.

## Runtime evidence gate

The ChatGPT execution container has Node.js but no DPM/Daml installation and no outbound DNS, so it cannot download the SDK here. The repository therefore provides a one-command bootstrap for any normal internet-connected Linux/macOS environment:

```bash
bash scripts/bootstrap-dpm.sh
bash scripts/verify-all.sh
```

These commands are the canonical path for Daml build/test evidence.

Still required before final submission:
- captured Daml build success;
- captured Daml Script test success;
- DAR deployment to Canton LocalNet;
- end-to-end JSON Ledger API transitions through `SettlementReceipt`;
- captured Canton update IDs / contract IDs;
- final recorded demo video.

## GitHub Actions decision

Automatic push/PR CI is disabled because this private repository's observed GitHub-hosted jobs are failing before any runner step executes. That is an account/runner availability issue, not a code-test result.

A **manual verification workflow** remains in `.github/workflows/ci.yml`. Run it whenever GitHub-hosted Actions capacity is available. Until then, local `scripts/verify-all.sh` is the source of truth.

## Submission rule

The project is not allowed to call itself final-submission-ready until every runtime gate in `docs/EVIDENCE_MANIFEST.md` has real captured evidence.
