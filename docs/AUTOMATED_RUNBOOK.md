# Automated verification and real Canton proof

## Prerequisites

Use an internet-connected Linux/macOS development machine with Node.js 22+, Java 21, Python 3, curl and Bash. Clone the private repository with your normal authenticated GitHub tooling, then check out `fix/verified-delivery-20260929`. Do not paste credentials into chat or commit them.

The existing fixture is private: provide `GITHUB_TOKEN` through your shell/session secret store with read access to this repository. GitHub Actions uses its repository-scoped token. No paid API or hosting is required by these scripts.

## Local commands

```bash
npm test
bash scripts/bootstrap-dpm.sh
bash scripts/run-local-proof.sh
```

The last command reruns Node tests, compiles/tests Daml, extracts the package identifier from the built DAR, starts a fresh owned Canton sandbox, uploads that DAR, allocates three actual parties and a demo user, runs the real GitHub-to-ledger lifecycle, and validates the evidence structure. It stops on any failure. It refuses to reuse a server already listening on port 3975 and stops only the sandbox process it started. Default Canton ports 6865-6869 must also be free.

`scripts/verify-all.sh` removes any stale verification marker before starting. `run-local-proof.sh` also removes stale final proof/setup files. Inspect log timestamps and the source commit; never mix artifacts from different runs.

The generated `.env.canton-demo.local` contains local party IDs, package ID and user ID, NOT a bearer token. It is ignored by Git. It never replaces a personal `.env.local`. This environment is deliberately unauthenticated and loopback-only. Never expose it publicly; it is not production key management or an authenticated multi-organization deployment.

## Keep a verified session open for the judge

```bash
COMMITLEDGER_SERVE_AFTER_PROOF=true bash scripts/run-local-proof.sh
```

Only after the proof command succeeds does the UI start at `http://127.0.0.1:4173`. Leave this operator process running during the recording. Ctrl+C shuts down its sandbox. Each UI run creates a NEW demo bounty; repeated demo runs are not repeated payments of one contract.

For an existing authenticated development ledger, export `.env.example` variables with the actual deployed package, three distinct parties, authorized role tokens, and ledger user ID, then run:

```bash
export COMMITLEDGER_EVIDENCE_FILE=./evidence/canton-proof.json
npm run demo:full
npm start
```

The application does not automatically load `.env` files. Export the variables in the shell. The newly added Daml record fields require a fresh build/deployment. This delivery does not claim an in-place upgrade/migration of old contracts.

## Evidence

Preserve `node-tests.log`, `daml-build.log`, `daml-tests.log`, `verification.json`, `ledger-setup.json`, `canton-proof.json` and `canton-demo.log` from the same run. Negative evidence must contain recognized ledger codes and the relevant assertion/contract details. A timeout or HTTP authentication error is not a security rejection. `check-evidence.mjs` checks structure only; genuine provenance comes from the recorded API responses and rerunning against the ledger.

## Automated CI

The workflow has Node, Canton-proof and repository-gate jobs and triggers on main/fix branch pushes, pull requests and manual runs. It retains log/evidence artifacts even when a job fails. A private repository's Actions availability and account policies still apply. No billing or visibility setting is changed by this workflow.

## Optional browser video capture

Install Playwright only as a development tool outside the application dependencies:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
python3 scripts/record-demo.py
```

Run this from a second terminal while the verified operator session above is still open. The recorder calls the actual UI, waits for a real successful API response and only retains a video when receipt/rejection checks succeed. Failed captures are discarded. The output is a silent technical walkthrough, not a finished narrated submission video. Check the organizer's format/duration rules before editing or submitting it.

## Technical references

- https://docs.digitalasset.com/build/3.4/component-howtos/application-development/dpm-sandbox.html
- https://docs.digitalasset.com/build/3.4/explanations/json-api/index.html
- https://docs.digitalasset.com/build/3.5/reference/json-api/openapi.html
- https://archived.docs.digitalasset.com/operate/3.5/reference/error_codes.html

The pinned project bundle remains 3.5.12. These references guide API/command shapes; only a successful run with the pinned bundle establishes compatibility.
