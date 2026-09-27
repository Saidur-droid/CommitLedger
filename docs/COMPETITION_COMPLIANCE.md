# HackCanton Season 3 — Competition Compliance Gate

_Last reviewed: 2026-09-27_

This file separates **verified public requirements**, **working assumptions**, and **internal quality standards**. Never convert an assumption into a claimed official rule.

## Non-negotiable goal #1

**Follow every competition rule that can be verified before submission.**

If a formal/private portal rule conflicts with any repository decision, the official rule wins immediately.

## Publicly verified competition direction

Current official/public Canton ecosystem material for HackCanton Season 3 emphasizes:
- build something real on Canton;
- the build phase is active;
- Canton/Daml/Ledger integration must be substantive enough to demonstrate an actual Canton application, not branding-only integration.

Official/public sources to re-check before submission:
- https://forum.canton.network/
- https://appsfactory.cc/

## Rules audit protocol

Every submission-critical requirement must be classified as one of:

- **VERIFIED** — confirmed from an official source or the actual submission portal.
- **NOT REQUIRED** — official material explicitly does not require it, or the submission form does not ask for it.
- **PENDING** — not yet confirmed. A PENDING item cannot be represented as an official rule.

### Submission blocker

Do not submit while any critical item below remains PENDING:

- eligibility / participant requirements
- solo vs team eligibility
- required registration state
- submission deadline and timezone
- required repository visibility/license
- required build period / pre-existing-code restrictions
- required Canton technology or network environment
- required demo/video format and duration
- required written fields
- required live URL or deployment
- intellectual-property / open-source requirements
- judging criteria
- prize-track eligibility
- prohibited content / conduct
- any mandatory sponsor technology
- any mandatory identity/KYC step for prize eligibility

## Current working status

| Requirement | Status | Repository action |
|---|---|---|
| Canton must be meaningful to the product | VERIFIED from public HackCanton positioning | Daml + Canton Ledger API are core architecture |
| Paid infrastructure required | NOT FOUND as a requirement | Build remains free/local-first |
| Canton Coin required | NOT FOUND as a requirement | Optional future adapter, not MVP dependency |
| Real-money transaction required | NOT FOUND as a requirement | Demo/test asset only, clearly labelled |
| Real-user traction required | NOT FOUND as a requirement | Genuine feedback is bonus evidence, never fabricated |
| Formal final submission checklist | PENDING until portal/rulebook is accessible | Final submission is blocked until re-check |

## Evidence integrity

- Never fabricate users, testimonials, transactions, adoption, metrics, judging feedback, or production status.
- Never claim MainNet usage unless it happened and can be independently shown.
- Never claim a demo/test asset is real money.
- Never claim an official requirement unless it is actually verified.
- Preserve source links/screenshots/notes for every rule used in the final submission.

## Final compliance pass

Immediately before submission:
1. Re-open the official competition portal.
2. Re-read current rules and judging criteria.
3. Compare each requirement with the built repository.
4. Update this file with VERIFIED / NOT REQUIRED status.
5. Run the full technical evidence checklist.
6. Submit only after all critical PENDING items are resolved.
