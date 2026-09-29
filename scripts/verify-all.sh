#!/usr/bin/env bash
set -eEuo pipefail
trap 'status=$?; echo "VERIFY ERROR: line $LINENO: $BASH_COMMAND (status $status)" >&2' ERR
cd "$(dirname "$0")/.."
mkdir -p evidence
rm -f evidence/verification.json
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_SDK_VERSION=3.5.12
SOURCE_COMMIT=$(git rev-parse HEAD)

run_logged() {
  local logfile=$1
  shift
  if "$@" >"$logfile" 2>&1; then
    cat "$logfile"
    return 0
  else
    status=$?
    cat "$logfile"
    return "$status"
  fi
}

echo "=== STAGE 1/4: Node ==="
node --version > evidence/node-version.log 2>&1
cat evidence/node-version.log
run_logged evidence/node-tests.log npm test

echo "=== STAGE 2/4: DPM ==="
if ! command -v dpm >/dev/null 2>&1; then
  echo 'BLOCKED: DPM is not installed. Run bash scripts/bootstrap-dpm.sh on an internet-connected development machine.' > evidence/daml-build.log
  cat evidence/daml-build.log
  exit 2
fi
run_logged evidence/dpm-version.log bash -c 'cd daml && dpm version --active'

echo "=== STAGE 3/4: Daml build ==="
run_logged evidence/daml-build.log bash -c 'cd daml && dpm build'

echo "=== STAGE 4/4: Daml tests ==="
run_logged evidence/daml-tests.log bash -c 'cd daml && dpm test'

SOURCE_COMMIT="$SOURCE_COMMIT" node -e 'require("node:fs").writeFileSync("evidence/verification.json",JSON.stringify({node:true,damlBuild:true,damlTests:true,verifiedAt:new Date().toISOString(),commit:process.env.SOURCE_COMMIT},null,2)+"\n")'
echo "=== BUILD/TEST VERIFICATION COMPLETE ==="
