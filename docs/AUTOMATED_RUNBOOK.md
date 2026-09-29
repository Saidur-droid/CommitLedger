# Automated verification and real Canton proof

## Preferred execution

Use GitHub Actions when hosted runners allocate correctly. If hosted Actions is unavailable, use the repository Codespace/devcontainer. Remote Desktop is optional.

The proof runner is designed as a one-command path:

```bash
bash scripts/run-local-proof.sh
```

It now:
- binds evidence to the exact checked-out Git commit;
- reruns the full Node suite;
- compiles/tests Daml with DPM 3.5.12;
- extracts the package identifier from the fresh DAR;
- chooses a free loopback JSON API port for each run, avoiding stale-port collisions;
- starts a fresh Canton sandbox with the DPM 3.5.12-compatible `--canton-port-file` ready signal;
- waits for both Canton readiness and the JSON ledger endpoint;
- retries only the known transient `PARTY_ALLOCATION_WITHOUT_CONNECTED_SYNCHRONIZER` race;
- allocates three parties and a demo user;
- obtains a Codespaces/GitHub CLI token automatically when `GITHUB_TOKEN` is not already present;
- runs the real GitHub-to-ledger lifecycle;
- captures structured negative rejections;
- rejects mixed-commit evidence bundles.

## Prerequisites

Use an internet-connected Linux environment with Node.js 22+, Java 21, Python 3, curl and Bash. The repository devcontainer supplies these dependencies and installs the pinned DPM bundle.

Do not paste credentials into chat or commit them.

## Commands

For a new Codespace, bootstrap is normally automatic. If needed:

```bash
bash scripts/bootstrap-codespace.sh
```

Then run the proof:

```bash
bash scripts/run-local-proof.sh
```

The script stops on the first unproven condition and prints the relevant runtime log tail.

## Keep a verified session open for the judge

```bash
COMMITLEDGER_SERVE_AFTER_PROOF=true bash scripts/run-local-proof.sh
```

Only after proof validation succeeds does the UI stay open. In Codespaces, open forwarded port 4173 from the Ports panel.

Each UI run creates a new demo bounty. DEMO_CREDIT remains non-production test value.

## Evidence

Preserve these artifacts from the same run:
- `node-tests.log`
- `daml-build.log`
- `daml-tests.log`
- `verification.json`
- `canton-ports.json`
- `ledger-setup.json`
- `canton-proof.json`
- `canton-demo.log`
- `canton-sandbox.log`

`verification.json.commit` and `canton-proof.json.sourceCommit` must match exactly.

A timeout, network error, authentication error, rate limit, malformed command, mocked transport, or CI runner failure is never accepted as Daml authorization/security evidence.

## Existing authenticated ledger

For a real authenticated development ledger, export the values in `.env.example` and run:

```bash
export COMMITLEDGER_EVIDENCE_FILE=./evidence/canton-proof.json
npm run demo:full
npm start
```

The application does not automatically source environment files.

## GitHub Actions

The workflow contains Node, Canton proof and repository gate jobs. If GitHub assigns a hosted runner, no personal computer or Codespace is required.

The previously observed `steps: []` + `runner_id: 0` failure occurs before application steps execute and therefore is not a code-test result.

## Browser/video

After a verified runtime is open:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
python3 scripts/record-demo.py
```

The recorder retains a technical capture only when the live lifecycle, receipt and negative-proof checks succeed. The final submission video must remain ≤5 minutes and be reviewed before publishing.

## Technical references

- https://docs.digitalasset.com/build/3.4/component-howtos/application-development/dpm-sandbox.html
- https://docs.digitalasset.com/build/3.5/reference/json-api/openapi.html
- https://archived.docs.digitalasset.com/operate/3.5/reference/error_codes.html

The pinned DPM SDK remains 3.5.12. Only an executed proof establishes final compatibility.
