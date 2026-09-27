# Real GitHub Evidence Fixture

This document closes GitHub issue #1 through a real pull request and merge.

## Purpose

CommitLedger treats GitHub as the external source of truth for work completion. The competition demo uses this repository itself as a reproducible evidence fixture:

1. a real GitHub issue exists;
2. a real pull request changes the repository;
3. GitHub records the canonical repository, author, head SHA, base branch, and merged state;
4. CommitLedger independently reads that provider state;
5. only matching merged evidence can authorize the corresponding Canton verification transition.

## Integrity boundary

This fixture is **competition/demo evidence only**.

It is not:
- a claim of external user traction;
- a claim of customer adoption;
- a real-money bounty;
- a production Canton Coin transfer.

The purpose is to let a judge inspect a real provider event and reproduce the GitHub -> verification -> Canton trust boundary without paid infrastructure or fabricated activity.
