# Build Status — HackCanton Season 4

_Last updated: 7 October 2026._

## Current branch

`season4/jaw-drop-upgrade`

## Technical baseline

The proven pre-Season-4 baseline is commit:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

It passed:
- Node 86/86;
- DPM 3.5.12;
- Daml build/tests;
- fresh Canton sandbox;
- six real ledger transitions;
- SettlementReceipt;
- wrong-evidence rejection;
- unauthorized-settlement rejection;
- duplicate/replay rejection.

## Season 4 delta

Implemented:
- Judge Mode;
- Evidence Passport;
- replay rejection spotlight;
- business-first Season 4 copy;
- DevNet-ready environment labeling/runbook;
- validation sprint kit;
- Season 4 CI coverage.

Current gate:
- the Season 4 branch must pass the full CI/proof pipeline on its exact source commit.

External/manual gates are separate:
- Season 4 registration;
- authenticated DevNet access/run;
- real validation interviews;
- final video and portal submission.

Do not call those external gates complete until they actually happen.
