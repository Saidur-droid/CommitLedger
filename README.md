# CommitLedger

**Verified work. Authorized settlement. Replay-safe receipt.**

CommitLedger is a Canton-native business workflow that turns canonical GitHub contribution evidence into a role-authorized settlement state and an auditable `SettlementReceipt`.

## HackCanton Season 4 target

**Primary track:** Real-World Asset (RWA) & Business Workflows

Business story:

> A foundation pays contributors only after independently verified work, with no duplicate settlement and a permanent audit receipt.

Core flow:

`GitHub Issue -> Bounty -> Claim -> Pull Request -> Verify -> Settle -> SettlementReceipt`

### Why Canton is essential

GitHub proves the work event. Canton/Daml controls what each party is allowed to do next.

- Maintainer creates, accepts and settles.
- Contributor claims work and submits the PR.
- Verifier attests canonical merge evidence.
- Wrong evidence is rejected.
- Unauthorized settlement is rejected.
- Duplicate settlement is rejected because the verified contract is consumed.
- Settlement creates an inspectable receipt.

## Season 4 judge experience

The Season 4 branch adds only judge-facing upgrades around the proven core:

- **60-second Judge Mode**
- **Evidence Passport**
- **same-run replay/duplicate rejection spotlight**
- **business-first workflow framing**
- **authenticated DevNet-ready proof path**
- **real validation sprint kit**

The Daml authorization model, GitHub verifier, six-step lifecycle and settlement semantics are intentionally not rewritten.

## Proven technical baseline

Last fully executed frozen proof before Season 4 polish:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Verified there:

- Node tests: 86/86 PASS
- DPM 3.5.12 PASS
- Daml build PASS
- Daml Script tests PASS
- fresh Canton sandbox PASS
- six ledger transitions PASS
- SettlementReceipt generated
- wrong-evidence rejection captured
- unauthorized-settlement rejection captured
- duplicate/replay rejection captured

Current Season 4 branch must pass the same proof pipeline before being called technically complete.

## Real evidence fixture

- Repository: `Saidur-droid/MergeEarn`
- Open issue: `#69`
- Merged PR: `#73`

MergeEarn is only the external GitHub evidence fixture. CommitLedger is the product.

## Public proof service

https://commitledger-proof-final.onrender.com

Proof JSON:

https://commitledger-proof-final.onrender.com/api/proof

The existing public service reflects the previously frozen proven build until the Season 4 branch is redeployed.

## Season 4 control docs

- [Rules snapshot](docs/SEASON4_RULES_SNAPSHOT.md)
- [Locked winning plan](docs/SEASON4_LOCKED_PLAN.md)
- [DevNet proof runbook](docs/DEVNET_PROOF_RUNBOOK.md)
- [Validation sprint](docs/VALIDATION_SPRINT.md)
- [Final checklist](docs/FINAL_CHECKLIST.md)

## Integrity

Do not claim DevNet, MainNet, real-money settlement, customers, revenue, traction or production custody without executed evidence.

`DEMO_CREDIT` is non-production test value.

Canton is a registered trademark of Digital Asset (Switzerland) GmbH. CommitLedger is independent and is not sponsored or endorsed by Digital Asset.
