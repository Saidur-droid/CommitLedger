# Architecture

CommitLedger is designed so Canton is not a cosmetic database. The trusted workflow is split between an external work oracle (GitHub) and an on-ledger authorization/settlement state machine (Daml on Canton).

## System boundary

```text
GitHub issue / pull request
          |
          v
Canonical GitHub verifier
- repository
- PR number
- head SHA
- base branch
- author
- merged state
          |
          | hashed merge evidence
          v
Canton / Daml
Bounty
  -> ClaimRequest
  -> ClaimedBounty
  -> SubmittedBounty
  -> VerifiedBounty
  -> SettlementReceipt
          ^
          |
Canton JSON Ledger API
          ^
          |
Local CommitLedger web app
```

## Why Canton matters

The application layer does not have unilateral authority to declare a bounty verified or settled.

Daml controls:
- who may accept a contributor claim;
- who may submit work;
- which verifier party may attest canonical GitHub evidence;
- which maintainer may settle verified work;
- the consuming transition that blocks settlement replay;
- the final auditable settlement receipt.

If Canton/Daml is removed, CommitLedger loses its authorization, provenance and settlement state machine. That is the intended competition-native dependency.

## Trust model

### GitHub
GitHub is the source of truth for work state. The verifier reads canonical API state and rejects repository, PR number, head SHA, base-branch, author, or merge mismatches.

### CommitLedger verifier
The verifier converts canonical provider state into a compact evidence object and SHA-256 evidence hash. It does not decide who is authorized to settle.

### Daml
Daml choices enforce authorization. Contract IDs bind each transition to the exact preceding state.

### Canton
Canton records authorized contract transitions and the final receipt. LocalNet/test environments are acceptable for competition proof; the repository never describes demo credits as real funds.

## Payment boundary

The competition MVP uses `DEMO_CREDIT`, a clearly labelled test unit representing the agreed bounty value. It proves settlement authorization and accounting without requiring the founder or judge to purchase assets.

A Canton Token Standard / Canton Coin-compatible rail may be added later as a production adapter. It is intentionally not required for the competition's core proof unless official rules change.
