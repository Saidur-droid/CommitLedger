# CommitLedger

**Canton-native settlement infrastructure for verified open-source work.**

CommitLedger binds canonical contribution evidence to role-separated authorization and an auditable settlement receipt.

## Active competition targets — 7 October 2026

This sprint has exactly two active submission targets:

1. **HackCanton Season 3**
   - Submission deadline: **9 Oct 2026, 23:59 UTC**
   - Bangladesh time: **10 Oct 2026, 05:59**
2. **Crypto World's Fair — Colosseum**
   - Contest/submission cutoff: **12 Oct 2026, 23:59 PT**
   - Bangladesh time: **13 Oct 2026, 12:59**

The 1 October plan that retired HackCanton is superseded by the owner's 7 October instruction to submit CommitLedger to both programs.

See [Competition Targets](docs/COMPETITION_TARGETS.md), [Submission Status](docs/SUBMISSION_STATUS_20261007.md), [Final Checklist](docs/FINAL_CHECKLIST.md), and [Submission Draft](docs/SUBMISSION_DRAFT.md).

## Product thesis

`GitHub Issue -> Bounty -> Claim -> Pull Request -> Merge Evidence -> Canton Settlement -> SettlementReceipt`

Canton/Daml is the authorization and workflow-state layer, not a cosmetic integration. GitHub remains the canonical external work-evidence source.

## Core guarantees

- **Maintainer** creates the bounty, accepts the claim and settles verified work.
- **Contributor** claims work and submits the exact PR.
- **Verifier** attests canonical merge evidence.
- Merge evidence is bound to the exact issue and PR metadata.
- Wrong evidence, unauthorized actions and replay/duplicate settlement are rejected.
- Settlement consumes the verified contract and creates an auditable `SettlementReceipt`.
- `DEMO_CREDIT` is explicitly non-production test value.

## Frozen technical proof

The last fully executed, source-bound technical proof is:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Verified at that exact code commit:

- Node tests: **86/86 PASS**
- DPM **3.5.12** PASS
- Daml build PASS
- Daml Script tests PASS
- fresh Canton sandbox PASS
- six ledger transitions PASS
- `SettlementReceipt` generated
- wrong-evidence rejection captured
- unauthorized-settlement rejection captured
- duplicate/replay rejection captured

External GitHub evidence fixture:

- Repository: `Saidur-droid/MergeEarn`
- Open issue: `#69`
- Merged PR: `#73`

**MergeEarn is only the external proof fixture. CommitLedger is the product being submitted.**

Canonical proof service:

https://commitledger-proof-final.onrender.com

Proof JSON:

https://commitledger-proof-final.onrender.com/api/proof

Planning/documentation commits after the frozen proof do not become runtime-proven automatically. If executable code changes, rerun the complete proof on the exact new commit.

## Run locally

Requires Node.js 22+.

```bash
npm test
npm start
```

Open `http://127.0.0.1:4173`.

## Run the full Canton proof

Configure the documented Canton environment values, then run:

```bash
bash scripts/run-local-proof.sh
```

The proof path reruns tests, builds/tests Daml, starts a fresh Canton sandbox, captures each ledger transition, executes negative authorization/replay checks, validates one coherent evidence bundle, and finishes at `SettlementReceipt`.

## Submission assets

- [Rules recheck — 7 Oct](docs/RULES_RECHECK_20261007.md)
- [Submission status — 7 Oct](docs/SUBMISSION_STATUS_20261007.md)
- [Competition targets](docs/COMPETITION_TARGETS.md)
- [Final checklist](docs/FINAL_CHECKLIST.md)
- [Submission master draft](docs/SUBMISSION_DRAFT.md)
- [HackCanton pitch](docs/PITCH.md)
- [HackCanton demo script](docs/DEMO_SCRIPT.md)
- [Colosseum pitch script](docs/COLOSSEUM_PITCH_SCRIPT.md)
- [Colosseum demo script](docs/COLOSSEUM_DEMO_SCRIPT.md)
- [Hackathon work disclosure](docs/HACKATHON_WORK_DISCLOSURE.md)
- [AI assistance disclosure](docs/AI_DISCLOSURE.md)
- [Delivery status](docs/DELIVERY_STATUS.md)

## Integrity

CommitLedger does not claim Canton Coin transfer, fiat settlement, external adoption, MainNet usage, revenue, paying customers, or production custody without evidence.

`DEMO_CREDIT` is test value only.

Canton is a registered trademark of Digital Asset (Switzerland) GmbH. CommitLedger is an independent project and is not sponsored or endorsed by Digital Asset.
