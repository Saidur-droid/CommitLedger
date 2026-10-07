# CommitLedger

**Canton-native settlement infrastructure for verified open-source work.**

CommitLedger binds a real GitHub bounty issue and merged pull request to role-separated Daml authorization and an auditable Canton settlement receipt.

## Crypto World's Fair 2026

CommitLedger is being submitted to **Colosseum Crypto World's Fair 2026** as a general-pool entry. Colosseum accepts products across blockchain ecosystems; CommitLedger uses Canton because multi-party authorization and auditable settlement are core to the product, not a cosmetic integration.

**Competition deadline:** October 12, 2026 at 11:59 PM PT.

## Product thesis

`GitHub Issue -> Bounty -> Claim -> Pull Request -> Merge Evidence -> Canton Settlement -> SettlementReceipt`

GitHub proves the work event. Daml defines who may move the bounty state. Canton records the authorized settlement state and proof.

## Core guarantees

- **Maintainer** creates the bounty, accepts the claim and settles verified work.
- **Contributor** creates the claim and submits the exact PR.
- **Verifier** can attest only canonical GitHub merge evidence.
- Merge evidence includes the **exact bounty issue number**.
- Wrong issue, wrong SHA, unmerged work and unauthorized actions are rejected.
- Settlement consumes the verified contract, blocking duplicate settlement.
- `DEMO_CREDIT` is explicitly non-production test value.

## Real GitHub fixture

The reproducible competition fixture is:

- Open issue: `#5`
- Merged PR: `#6`
- PR #6 references issue #5 without closing it.

This lets a judge repeatedly prove the issue -> merged PR trust boundary without fake users or fake traction.

## Run locally

Requires Node.js 22+.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`.

If this repository is private, set `GITHUB_TOKEN` with read access before using the canonical GitHub verifier.

## Run the full Canton proof

Configure `.env.example` values for:
- Canton JSON Ledger API URL;
- package ID;
- three distinct parties;
- one LocalNet token with rights to all demo parties, or role-specific tokens.

Then:

```bash
npm run demo:full
```

The runner captures Canton `updateId`, `completionOffset` and active `contractId`, executes negative authorization/replay checks, and finishes at the active `SettlementReceipt`.

See [Judge Runbook](docs/JUDGE_RUNBOOK.md) for the exact operator path.

## Canton / Daml

The Daml project is under `daml/` and is pinned to the stable open-source DPM SDK bundle **3.5.12**.

```bash
bash scripts/bootstrap-dpm.sh
bash scripts/verify-all.sh
```

## Colosseum submission package

- [Competition compliance](docs/COMPETITION_COMPLIANCE.md)
- [Verified rules snapshot](docs/RULES_SNAPSHOT.md)
- [Submission copy](docs/COLOSSEUM_SUBMISSION.md)
- [Pitch script](docs/PITCH_SCRIPT.md)
- [Technical demo script](docs/DEMO_SCRIPT.md)
- [Final submission checklist](docs/SUBMISSION_CHECKLIST.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Judge runbook](docs/JUDGE_RUNBOOK.md)
- [Evidence manifest](docs/EVIDENCE_MANIFEST.md)
- [Build status](docs/BUILD_STATUS.md)

## Integrity

CommitLedger does not claim Canton Coin transfer, fiat settlement, external adoption, mainnet usage, green CI, or runtime Canton success unless that evidence has actually been produced.

Canton is a registered trademark of Digital Asset (Switzerland) GmbH. CommitLedger is an independent project and is not sponsored or endorsed by Digital Asset or Colosseum.
