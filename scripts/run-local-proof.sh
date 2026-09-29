#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_SDK_VERSION=3.5.12
mkdir -p evidence
rm -f evidence/canton-proof.json evidence/ledger-setup.json
bash scripts/verify-all.sh
DAR="$PWD/daml/.daml/dist/commit-ledger-0.1.0.dar"
test -f "$DAR"
export CANTON_PACKAGE_ID
CANTON_PACKAGE_ID=$(python3 scripts/dar-package-id.py "$DAR")
export CANTON_JSON_API_URL=http://127.0.0.1:3975
# Refuse to reuse an unrelated server. This script owns its sandbox process.
if curl -s --max-time 2 --connect-timeout 2 "$CANTON_JSON_API_URL/v2/state/ledger-end" >/dev/null; then
  echo 'Port 3975 is already in use; stop that service before creating a fresh proof.' >&2
  exit 2
fi
dpm sandbox --json-api-port 3975 --dar "$DAR" > evidence/canton-sandbox.log 2>&1 &
sandbox_pid=$!
trap 'kill "$sandbox_pid" 2>/dev/null || true; wait "$sandbox_pid" 2>/dev/null || true' EXIT
ready=false
for attempt in $(seq 1 180); do
  if ! kill -0 "$sandbox_pid" 2>/dev/null; then
    tail -n 60 evidence/canton-sandbox.log
    exit 1
  fi
  if curl --fail --silent --max-time 2 "$CANTON_JSON_API_URL/v2/state/ledger-end" > evidence/ledger-end.json; then
    ready=true
    break
  fi
  sleep 1
done
if [ "$ready" != true ]; then echo 'Canton readiness check failed' >&2; exit 1; fi
node scripts/bootstrap-local.mjs
set -a
source .env.canton-demo.local
set +a
export COMMITLEDGER_EVIDENCE_FILE="$PWD/evidence/canton-proof.json"
# GITHUB_TOKEN is inherited for this private repository; it is never written to .env.canton-demo.local.
npm run demo:full 2>&1 | tee evidence/canton-demo.log
node scripts/check-evidence.mjs
if [ "${COMMITLEDGER_SERVE_AFTER_PROOF:-false}" = true ]; then
  # Foreground operator session; Ctrl+C also cleans up the owned sandbox.
  npm start
fi
