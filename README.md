# CommitLedger

**Canton-native settlement infrastructure for verified open-source work.**

CommitLedger binds canonical GitHub merge evidence to Daml authorization and an auditable Canton settlement receipt.

## Competition thesis

`GitHub Issue -> Daml Bounty -> Claim -> Pull Request -> Canonical Merge Verification -> Canton Settlement -> SettlementReceipt`

Canton is the trust and settlement layer, not a cosmetic integration. Daml controls who may claim, submit, verify and settle; the final consuming transition prevents replay of the same verified work.

## What is implemented

- Daml lifecycle contracts and authorization rules.
- Daml negative tests for unauthorized verification, bad evidence, unauthorized settlement and replay.
- Canonical GitHub PR verifier with SHA-256 evidence hashing.
- Canton JSON Ledger API client and demo bounty command.
- Local zero-dependency Node web app with judge-facing verification UI.
- Real GitHub evidence fixture: issue #1 -> PR #2 -> merged.
- Competition compliance, architecture, threat model, runbook and evidence gates.
- No Vercel, Supabase or paid API dependency.
- No fake users, fake traction or real-money claims.

## Run the local product

Requires Node.js 22+.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`.

If this repository is private, set `GITHUB_TOKEN` with read access so the UI can verify PR #2.

## Canton / Daml

The Daml project is under `daml/` and is pinned to the stable open-source DPM SDK bundle 3.5.12.

See:
- [Locked decisions](LOCKED_DECISIONS.md)
- [Competition compliance](docs/COMPETITION_COMPLIANCE.md)
- [Winning standard](docs/WINNING_STANDARD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Judge runbook](docs/JUDGE_RUNBOOK.md)
- [Evidence manifest](docs/EVIDENCE_MANIFEST.md)
- [Build status](docs/BUILD_STATUS.md)

## Integrity

`DEMO_CREDIT` is a non-production test unit. CommitLedger does not claim Canton Coin transfer, fiat settlement, external adoption, or mainnet usage unless those are actually demonstrated and captured as evidence.


## One-command verification

On an internet-connected Linux/macOS machine:

```bash
bash scripts/bootstrap-dpm.sh
bash scripts/verify-all.sh
```

The first command installs the pinned open-source DPM SDK if needed. The second runs Node tests and Daml build/tests.

---

Canton is a registered trademark of Digital Asset (Switzerland) GmbH. CommitLedger is an independent project and is not sponsored or endorsed by Digital Asset.
