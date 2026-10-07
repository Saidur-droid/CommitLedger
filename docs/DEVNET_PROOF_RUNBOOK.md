# Season 4 DevNet Proof Runbook

Goal: reproduce the existing six-step lifecycle on an **authenticated Canton environment** without changing the product semantics.

## Required organizer/environment inputs

- Canton JSON Ledger API URL
- uploaded CommitLedger package ID
- Maintainer party
- Contributor party
- Verifier party
- authenticated token(s) with the minimum rights needed for those parties
- optional Canton user ID
- GitHub read token if the evidence repository is private

Never commit any token.

## Configuration

Use an ignored local environment file or shell variables:

```bash
CANTON_JSON_API_URL=https://<devnet-ledger-api>
CANTON_PACKAGE_ID=<package-id>
CANTON_PACKAGE_NAME=commit-ledger
CANTON_MAINTAINER_PARTY=<party>
CANTON_CONTRIBUTOR_PARTY=<party>
CANTON_VERIFIER_PARTY=<party>
CANTON_MAINTAINER_TOKEN=<token>
CANTON_CONTRIBUTOR_TOKEN=<token>
CANTON_VERIFIER_TOKEN=<token>
CANTON_USER_ID=<if-required>
CANTON_INSECURE_LOCAL=false
CANTON_ENVIRONMENT_LABEL=authenticated-devnet
```

## Proof command

Run the normal proof path against the authenticated environment. Do not bypass GitHub verification or negative checks.

Expected evidence:
- exact source commit;
- six Canton updates/contracts;
- final SettlementReceipt;
- wrong-issue rejection;
- unauthorized settlement rejection;
- duplicate settlement rejection;
- exported proof JSON;
- exported Evidence Passport.

## Pass condition

Only mark DevNet **VERIFIED** after the evidence bundle contains all required transitions/rejections and is source-commit coherent.

Until then the correct status is **DEVNET PENDING**.
