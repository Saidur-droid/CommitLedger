# CommitLedger — Locked Competition Decisions

_Last updated: 2026-10-07._

This file is the source of truth for the **Colosseum Crypto World's Fair 2026** submission. If an official Colosseum rule or live portal requirement conflicts with this file, the official requirement wins and this file must be updated.

## Two locked goals

1. **Competition compliance:** satisfy every verified Colosseum requirement before submission.
2. **Winning-quality product:** present a judgeable crypto startup where Canton is technically indispensable, while never fabricating traction, transactions, evidence, or official requirements.

Neither goal may be traded away for extra features.

## Product

**Name:** CommitLedger

**Positioning:** Canton-native settlement infrastructure for verified open-source work.

**Core flow:**
GitHub Issue -> Daml Bounty -> Claim -> Pull Request -> GitHub Merge Verification -> Canton Settlement -> Auditable Ledger Proof

## Competition objective

Build a judge-ready, reproducible MVP that demonstrates why multi-party authorization and verifiable settlement improve open-source bounty workflows.

CommitLedger is a **general-pool Crypto World's Fair entry**. It must not claim a dedicated Canton track.

## Locked constraints

- Keep the current Canton-native product architecture.
- No paid infrastructure is required for the competition proof.
- No requirement for the founder to spend real money to demonstrate the product.
- No fake users, fake traction, fake transactions, fake testimonials, or fake production claims.
- Use real GitHub issues / pull requests / merge state as work evidence.
- Use Daml smart contracts for the bounty and settlement state machine.
- Use Canton Ledger API for real ledger reads/writes in the final demo.
- Provide reproducible local/dev-network execution and evidence.
- Clearly label demo/test parties and demo/test assets as non-production.
- Any unverified requirement remains PENDING, never guessed.
- Do not add an unrelated chain integration merely to chase a track prize unless it strengthens the actual product.

## Payment / settlement decision

The competition MVP proves programmable settlement using a clearly labelled demo/test unit, `DEMO_CREDIT`.

A production payment rail may be added later. It is not required for the core proof and must not be described as already implemented.

## Required technical proof

The final submission must demonstrate:

1. A bounty is created from a real GitHub issue.
2. Authorization is enforced through Daml parties/choices.
3. A contributor claims the bounty under the contract model.
4. A real GitHub pull request is linked.
5. The backend independently verifies repository, branch, relevant identity policy, issue binding and merged state.
6. Valid merge evidence enables the settlement transition.
7. Canton records the resulting state/settlement.
8. Unauthorized settlement attempts fail.
9. Duplicate settlement is prevented.
10. The judge can inspect reproducible ledger and GitHub evidence.

## Required Colosseum presentation package

Before portal submission, complete:

- accurate founder/team background and location;
- product logo/graphic;
- GitHub repository access for judges;
- 2–3 minute pitch video;
- <=3 minute technical demo video;
- GTM and distribution strategy;
- truthful demand-validation section;
- disclosure of any development completed before September 14, 2026;
- final runtime evidence capture.

## Scope control

Do not overbuild a marketplace, token, DAO, reputation network, or generalized freelancing platform before the verified-work settlement flow is excellent.

Priority:
1. competition compliance
2. real runtime proof
3. product clarity
4. judge reproducibility
5. security / authorization
6. startup narrative and GTM
7. UX polish
8. optional extensions

## Integrity rules

- Never claim MainNet usage unless actually demonstrated.
- Never call demo assets real money.
- Never fabricate users, transactions, testimonials, adoption, or performance numbers.
- Never weaken verification to make the demo easier.
- Never present an internal quality target as an official judging criterion.
- Official Colosseum rules and portal requirements always override assumptions in this repository.

## Submission target

Feature freeze and real evidence should be complete with a buffer before **October 12, 2026 at 11:59 PM PT**. Submit early enough to recover from portal or video-upload problems.
