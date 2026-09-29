#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p evidence
rm -f evidence/verification.json
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_SDK_VERSION=3.5.12
SOURCE_COMMIT=$(git rev-parse HEAD)

run_stage() {
  local label=$1
  local logfile=$2
  shift 2
  echo "=== $label ==="
  if "$@" >"$logfile" 2>&1; then
    cat "$logfile"
    echo "=== $label: PASS ==="
    return 0
  else
    status=$?
    cat "$logfile"
    echo "=== $label: FAILED with status $status ===" >&2
    return "$status"
  fi
}

run_stage "STAGE 1/4: Node" evidence/node-tests.log npm test || exit $?

echo "=== STAGE 2/4: DPM ==="
if ! command -v dpm >/dev/null 2>&1; then
  echo 'BLOCKED: DPM is not installed. Run bash scripts/bootstrap-dpm.sh on an internet-connected development machine.' > evidence/daml-build.log
  cat evidence/daml-build.log
  exit 2
fi
run_stage "STAGE 2/4: DPM" evidence/dpm-version.log bash -c 'cd daml && dpm version --active' || exit $?
run_stage "STAGE 3/4: Daml build" evidence/daml-build.log bash -c 'cd daml && dpm build' || exit $?
run_stage "STAGE 4/4: Daml tests" evidence/daml-tests.log bash -c 'cd daml && dpm test' || exit $?

SOURCE_COMMIT="$SOURCE_COMMIT" node -e 'require("node:fs").writeFileSync("evidence/verification.json",JSON.stringify({node:true,damlBuild:true,damlTests:true,verifiedAt:new Date().toISOString(),commit:process.env.SOURCE_COMMIT},null,2)+"\n")'
echo "=== BUILD/TEST VERIFICATION COMPLETE ==="
