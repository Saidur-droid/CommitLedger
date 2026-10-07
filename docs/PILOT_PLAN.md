# CommitLedger Pilot Plan

## Pilot 1 — Single repository
Run CommitLedger with one maintainer-controlled open-source repository and a small set of issue bounties using DEMO_CREDIT/test value.

Required integrations:
- GitHub API;
- Daml package;
- Canton JSON Ledger API;
- judge/operator web UI.

Success evidence:
- canonical issue-to-PR binding;
- successful authorized settlement;
- explicit unauthorized and replay rejection;
- reproducible proof export.

## Pilot 2 — Foundation or ecosystem bounty program
Add a foundation/community operator as the verifier role and run a defined bounty campaign with multiple repositories or maintainers.

Required additions:
- production-grade identity/token handling;
- operational monitoring;
- organization-level access controls;
- policy for disputes and contributor identity.

Success measures must be collected from the pilot, not invented in advance: completion rate, time-to-verification, operator effort, failed/flagged claims, and repeat usage.

## Pilot 3 — Settlement adapter
After workflow validation, connect the verified Canton settlement state to an approved asset/payment rail appropriate for the operator.

This is future work. The HackCanton MVP does not claim Canton Coin, fiat, MainNet payment, or production custody.
