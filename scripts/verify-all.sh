#!/usr/bin/env bash
set +e
set -u
cd "$(dirname "$0")/.." || exit 1
mkdir -p evidence
rm -f evidence/verification.json
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_SDK_VERSION=3.5.12
SOURCE_COMMIT=$(git rev-parse HEAD)

echo "=== STAGE 1/4: Node ==="
npm test > evidence/node-tests.log 2>&1
status=$?
cat evidence/node-tests.log
if [ "$status" -ne 0 ]; then
  echo "=== STAGE 1/4: Node: FAILED with status $status ===" >&2
  exit "$status"
fi
echo "=== STAGE 1/4: Node: PASS ==="

echo "=== STAGE 2/4: DPM ==="
if ! command -v dpm >/dev/null 2>&1; then
  echo 'BLOCKED: DPM is not installed. Run bash scripts/bootstrap-dpm.sh on an internet-connected development machine.' > evidence/daml-build.log
  cat evidence/daml-build.log
  exit 2
fi
(
  cd daml || exit 1
  dpm version --active
) > evidence/dpm-version.log 2>&1
status=$?
cat evidence/dpm-version.log
if [ "$status" -ne 0 ]; then
  echo "=== STAGE 2/4: DPM: FAILED with status $status ===" >&2
  exit "$status"
fi
echo "=== STAGE 2/4: DPM: PASS ==="

echo "=== STAGE 3/4: Daml build ==="
(
  cd daml || exit 1
  dpm build
) > evidence/daml-build.log 2>&1
status=$?
cat evidence/daml-build.log
if [ "$status" -ne 0 ]; then
  echo "=== STAGE 3/4: Daml build: FAILED with status $status ===" >&2
  exit "$status"
fi
echo "=== STAGE 3/4: Daml build: PASS ==="

echo "=== STAGE 4/4: Daml tests ==="
(
  cd daml || exit 1
  dpm test
) > evidence/daml-tests.log 2>&1
status=$?
cat evidence/daml-tests.log
if [ "$status" -ne 0 ]; then
  echo "=== STAGE 4/4: Daml tests: FAILED with status $status ===" >&2
  exit "$status"
fi
echo "=== STAGE 4/4: Daml tests: PASS ==="

SOURCE_COMMIT="$SOURCE_COMMIT" node -e 'require("node:fs").writeFileSync("evidence/verification.json",JSON.stringify({node:true,damlBuild:true,damlTests:true,verifiedAt:new Date().toISOString(),commit:process.env.SOURCE_COMMIT},null,2)+"\n")'
status=$?
if [ "$status" -ne 0 ]; then
  echo "=== EVIDENCE WRITE: FAILED with status $status ===" >&2
  exit "$status"
fi
echo "=== BUILD/TEST VERIFICATION COMPLETE ==="
exit 0
