# CommitLedger

**Canton-native settlement infrastructure for verified open-source work.**

CommitLedger binds real contribution evidence to role-separated authorization and an auditable settlement receipt.

## Current competition targets

CommitLedger is currently being prepared for exactly two programs:

1. **Crypto World's Fair — Colosseum**
2. **Ideathon Bangladesh 2026**

See [Competition Targets](docs/COMPETITION_TARGETS.md) for the canonical plan, eligibility-first rules, and next-session order.

HackCanton Season 3 is no longer an active submission target. Its technical work is preserved as product proof/history.

## Product thesis

`GitHub Issue -> Bounty -> Claim -> Pull Request -> Merge Evidence -> Canton Settlement -> SettlementReceipt`

Canton is the current trust and settlement layer, not a cosmetic integration. Removing the ledger authorization layer removes the product's role controls, provenance, replay protection and final settlement record.

## Core guarantees

- **Maintainer** creates the bounty, accepts the claim and settles verified work.
- **Contributor** creates the claim and submits the exact PR.
- **Verifier** can attest only canonical merge evidence.
- Merge evidence includes the exact bounty issue number.
- Wrong issue, wrong SHA, unmerged work and unauthorized actions are rejected.
- Settlement consumes the verified contract, blocking duplicate settlement.
- `DEMO_CREDIT` is explicitly non-production test value.

## Verified proof fixture — not the product repository

The current reproducible external evidence fixture is:

- Repository: `Saidur-droid/MergeEarn`
- Open issue: `#69`
- Merged PR: `#73`
- Contributor: `Saidur-droid`
- Base branch: `main`

**CommitLedger is the product. MergeEarn is only the external GitHub issue/PR evidence source used to prove that CommitLedger can verify and settle work from another repository.**

Frozen fully executed technical proof commit:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Live proof:

https://commitledger-proof-final.onrender.com

Proof JSON:

https://commitledger-proof-final.onrender.com/api/proof

## Run locally

Requires Node.js 22+.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`.

Because this repository may be private during preparation, set `GITHUB_TOKEN` with the required read access before using the canonical GitHub verifier locally.

## Run the full Canton proof

Configure the documented Canton environment values, then run:

```bash
bash scripts/run-local-proof.sh
```

The proof path reruns tests, builds/tests Daml, starts a fresh Canton sandbox, captures each ledger transition, executes negative authorization/replay checks, validates one coherent evidence bundle, and finishes at SettlementReceipt.

## Canton / Daml

The Daml project is under `daml/` and uses the pinned open-source DPM SDK bundle **3.5.12**.

## Planning and governance

- [Competition Targets](docs/COMPETITION_TARGETS.md)
- [Next Session Handoff](docs/NEXT_SESSION_HANDOFF.md)
- [Dual-Program Final Checklist](docs/FINAL_CHECKLIST.md)
- [Dual-Program Submission Master Draft](docs/SUBMISSION_DRAFT.md)
- [Delivery Status](docs/DELIVERY_STATUS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Threat Model](docs/THREAT_MODEL.md)
- [Evidence Manifest](docs/EVIDENCE_MANIFEST.md)

## Integrity

CommitLedger does not claim Canton Coin transfer, fiat settlement, external adoption, mainnet usage, revenue, paying customers, or production custody without evidence.

`DEMO_CREDIT` is test value only.

Canton is a registered trademark of Digital Asset (Switzerland) GmbH. CommitLedger is an independent project and is not sponsored or endorsed by Digital Asset.
