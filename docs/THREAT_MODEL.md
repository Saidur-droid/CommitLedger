# Threat Model

## Protected properties

1. A browser cannot self-report a merged PR.
2. A contributor cannot verify their own submission unless they are also explicitly configured as the verifier party.
3. A verifier cannot settle the reward.
4. A maintainer cannot settle unverified work.
5. Mismatched PR evidence cannot advance the ledger state.
6. A successfully settled `VerifiedBounty` cannot settle again.
7. Demo/test value is never represented as real money.

## Failure cases included in Daml tests

- unauthorized verifier attempts `SubmittedBounty_VerifyMerged`;
- authorized verifier submits `merged = False`;
- contributor attempts `VerifiedBounty_Settle`;
- maintainer attempts to settle the same consumed contract twice.

## GitHub verifier failure cases

- PR is not merged;
- repository differs from the expected bounty repository;
- author differs from the selected contributor when author binding is enabled;
- head SHA differs from the submitted work;
- base branch differs from the accepted branch.

## Out of scope for the MVP

- production custody;
- fiat conversion;
- mainnet token transfer;
- arbitration/disputes;
- private repository OAuth UX;
- production key management.

These are deliberately excluded rather than simulated or overstated.
