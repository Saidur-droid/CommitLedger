#!/usr/bin/env bash
set -eEuo pipefail
trap 'status=$?; echo "PROOF ERROR: line $LINENO: $BASH_COMMAND (status $status)" >&2' ERR
cd "$(dirname "$0")/.."

export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_SDK_VERSION=3.5.12
mkdir -p evidence
rm -f evidence/canton-proof.json evidence/ledger-setup.json evidence/canton-ports.json evidence/ledger-end.json

SOURCE_COMMIT=$(git rev-parse HEAD)
export GITHUB_SHA="$SOURCE_COMMIT"

CURRENT_BRANCH=$(git branch --show-current)
if [ -n "$CURRENT_BRANCH" ]; then
  git fetch --quiet origin "$CURRENT_BRANCH" || true
  REMOTE_COMMIT=$(git rev-parse "origin/$CURRENT_BRANCH" 2>/dev/null || true)
  if [ -n "$REMOTE_COMMIT" ] && [ "$REMOTE_COMMIT" != "$SOURCE_COMMIT" ]; then
    echo "BLOCKED: stale checkout. Local $SOURCE_COMMIT, origin/$CURRENT_BRANCH $REMOTE_COMMIT." >&2
    echo "Run: git reset --hard origin/$CURRENT_BRANCH" >&2
    exit 3
  fi
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo 'Tracked working-tree changes detected. Commit or stash them before generating competition evidence.' >&2
  exit 2
fi

if [ -z "${GITHUB_TOKEN:-}" ] && command -v gh >/dev/null 2>&1; then
  GITHUB_TOKEN=$(gh auth token 2>/dev/null || true)
  export GITHUB_TOKEN
fi

bash scripts/verify-all.sh

DAR="$PWD/daml/.daml/dist/commit-ledger-0.1.0.dar"
test -f "$DAR"

export CANTON_PACKAGE_ID
CANTON_PACKAGE_ID=$(python3 scripts/dar-package-id.py "$DAR")
export CANTON_PACKAGE_NAME
CANTON_PACKAGE_NAME=$(sed -n 's/^name:[[:space:]]*//p' daml/daml.yaml | head -n 1 | tr -d '\r')
if [ -z "$CANTON_PACKAGE_NAME" ]; then
  echo 'Could not determine Daml package name from daml/daml.yaml.' >&2
  exit 1
fi

CANTON_JSON_API_PORT=$(python3 - <<'PY'
import socket
with socket.socket() as s:
    s.bind(("127.0.0.1",0))
    print(s.getsockname()[1])
PY
)
export CANTON_JSON_API_PORT
export CANTON_JSON_API_URL="http://127.0.0.1:$CANTON_JSON_API_PORT"

echo "Using fresh Canton JSON API port $CANTON_JSON_API_PORT"

dpm sandbox   --json-api-port "$CANTON_JSON_API_PORT"   --canton-port-file evidence/canton-ports.json   --dar "$DAR"   > evidence/canton-sandbox.log 2>&1 &
sandbox_pid=$!

cleanup() {
  if kill -0 "$sandbox_pid" 2>/dev/null; then
    kill "$sandbox_pid" 2>/dev/null || true
  fi
  wait "$sandbox_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

ready=false
for attempt in $(seq 1 180); do
  if ! kill -0 "$sandbox_pid" 2>/dev/null; then
    echo 'Canton sandbox exited before becoming ready.' >&2
    tail -n 100 evidence/canton-sandbox.log >&2 || true
    exit 1
  fi
  if test -s evidence/canton-ports.json &&      curl --fail --silent --max-time 2 "$CANTON_JSON_API_URL/v2/state/ledger-end" > evidence/ledger-end.json; then
    ready=true
    break
  fi
  sleep 1
done

if [ "$ready" != true ]; then
  echo 'Canton readiness check failed after 180 seconds.' >&2
  tail -n 100 evidence/canton-sandbox.log >&2 || true
  exit 1
fi

node scripts/bootstrap-local.mjs

set -a
source .env.canton-demo.local
set +a
export COMMITLEDGER_EVIDENCE_FILE="$PWD/evidence/canton-proof.json"

npm run demo:full 2>&1 | tee evidence/canton-demo.log
node scripts/check-evidence.mjs

if [ "${COMMITLEDGER_SERVE_AFTER_PROOF:-false}" = true ]; then
  npm start
fi
