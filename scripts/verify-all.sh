#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p evidence
rm -f evidence/verification.json
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_SDK_VERSION=3.5.12
SOURCE_COMMIT=$(git rev-parse HEAD)
node --version | tee evidence/node-version.log
npm test 2>&1 | tee evidence/node-tests.log
if ! command -v dpm >/dev/null 2>&1; then
  echo 'BLOCKED: DPM is not installed. Run bash scripts/bootstrap-dpm.sh on an internet-connected development machine.' | tee evidence/daml-build.log
  exit 2
fi
(cd daml && dpm version --active) 2>&1 | tee evidence/dpm-version.log
(cd daml && dpm build) 2>&1 | tee evidence/daml-build.log
(cd daml && dpm test) 2>&1 | tee evidence/daml-tests.log
SOURCE_COMMIT="$SOURCE_COMMIT" node -e 'require("node:fs").writeFileSync("evidence/verification.json",JSON.stringify({node:true,damlBuild:true,damlTests:true,verifiedAt:new Date().toISOString(),commit:process.env.SOURCE_COMMIT},null,2)+"\n")'
