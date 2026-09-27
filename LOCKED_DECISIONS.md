# CommitLedger — Locked Competition Decisions

_Last updated: 2026-09-27_

This file is the source of truth for the HackCanton Season 3 build. Do not silently change these decisions. If an official HackCanton rule conflicts with this file, the official rule wins and this file must be updated.

## Product

**Name:** CommitLedger

**Positioning:** Canton-native settlement infrastructure for verified open-source work.

**Core flow:**
GitHub Issue -> Daml Bounty -> Claim -> Pull Request -> GitHub Merge Verification -> Canton Settlement -> Auditable Ledger Proof

## Competition objective

Build a judge-ready, reproducible Canton-native MVP where Canton is essential to the product's trust, authorization, provenance, and settlement model.

Do not submit a cosmetic Canton integration.

## Locked constraints

- MergeEarn/Nimiq remains untouched.
- CommitLedger is a separate HackCanton project.
- No paid APIs or paid infrastructure.
- No Vercel.
- No Supabase.
- No requirement for the founder to spend real money to demonstrate the product.
- No fake users, fake traction, fake transactions, or fake production claims.
- Real external users are helpful evidence but are not treated as a hard dependency unless an official competition rule explicitly requires them.
- Use real GitHub issues / pull requests / merge state as work evidence.
- Use Daml smart contracts for the bounty and settlement state machine.
- Use Canton Ledger API for real ledger reads/writes in the demo.
- Provide reproducible local/dev-network execution and evidence.
- Clearly label demo/test parties and demo/test assets as non-production.

## Payment / settlement decision

**Canton Coin is NOT a required dependency for the MVP unless official HackCanton rules explicitly require it.**

The competition build will prove programmable settlement using a clearly labelled demo/test asset or ledger-native settlement representation on Canton.

This avoids:
- requiring the founder to buy or hold Canton Coin,
- introducing external payment dependencies,
- confusing demo/test value with real money,
- risking the core submission on wallet/mainnet availability.

The architecture should keep a clean future adapter point for a Canton Coin / Canton Token Standard-compatible payment rail, but this is an optional production extension, not a blocker for the competition MVP.

## Required technical proof

The final submission must demonstrate:

1. A bounty is created from a real GitHub issue.
2. Authorization is enforced through Daml parties/choices.
3. A contributor claims the bounty.
4. A real GitHub pull request is linked.
5. The backend independently verifies repository, branch, author/claim policy, and merged state.
6. A successful merge enables the settlement transition.
7. Canton records the resulting state/settlement.
8. Unauthorized settlement attempts fail.
9. Duplicate settlement is prevented.
10. The judge can inspect reproducible ledger and GitHub evidence.

## Evidence package

Required before submission:
- working code
- Daml contracts
- automated contract tests
- GitHub verification tests
- end-to-end deterministic demo script
- architecture diagram
- threat / trust-boundary notes
- failure-case evidence
- ledger transaction / contract evidence
- setup instructions
- concise judge walkthrough
- short demo video script
- submission copy
- final rules checklist

## Scope control

Do not overbuild a marketplace, token, DAO, reputation network, or generalized freelancing platform before the core verified-work settlement flow is excellent.

Priority:
1. correctness
2. Canton-native value
3. judge reproducibility
4. security / authorization
5. UX polish
6. optional extensions

## Integrity rules

- Never claim mainnet usage unless actually demonstrated.
- Never call demo assets real money.
- Never fabricate users, transactions, testimonials, adoption, or performance numbers.
- Never weaken verification to make the demo easier.
- Competition-specific official rules and deadlines always override assumptions in this repository.

## Submission target

Operational target: feature freeze and evidence complete before the official deadline buffer. Submit early enough to leave time for portal issues and final verification.
