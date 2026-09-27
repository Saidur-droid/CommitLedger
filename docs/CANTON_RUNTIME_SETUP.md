# Canton Runtime Setup

CommitLedger uses the Canton JSON Ledger API and keeps the competition demo local/dev-network friendly.

## Recommended free path

Use the official Canton Network / DPM tooling on a normal internet-connected Linux or macOS machine.

1. Install the pinned stable open-source DPM SDK:

```bash
bash scripts/bootstrap-dpm.sh
```

2. Verify source + tests:

```bash
bash scripts/verify-all.sh
```

3. Start the Canton development environment supplied by the official Canton quickstart / HackCanton onboarding.

4. Export the participant JSON API values into your shell:

```bash
export CANTON_JSON_API_URL=http://localhost:3975
export CANTON_TOKEN=...
export CANTON_ACT_AS=...
export CANTON_PACKAGE_ID=...
```

5. Submit a real Canton command:

```bash
bash scripts/create-demo-bounty.sh
```

## HackCanton shared environment

Season 3 materials describe guided onboarding and a shared development environment, so CommitLedger does not require you to purchase cloud infrastructure or run a paid validator.

If AppsFactory gives you DevNet/NaaS credentials, use those instead of paying for hosting. Keep credentials outside Git and only populate the existing environment variables.

## Required captured proof

Before final submission capture:
- DPM build output;
- DPM test output;
- DAR/package identifier;
- JSON Ledger API update/transaction response;
- active bounty/verified/receipt contract evidence;
- one authorization failure;
- duplicate-settlement failure.

Never commit passwords, bearer tokens, OIDC secrets, or private validator credentials.
