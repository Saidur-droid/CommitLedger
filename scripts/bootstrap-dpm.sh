#!/usr/bin/env bash
set -euo pipefail
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
export DPM_EDITION=open-source
if ! command -v dpm >/dev/null 2>&1; then
  installer=$(mktemp)
  trap 'rm -f "$installer"' EXIT
  curl --fail --show-error --location --connect-timeout 15 --max-time 120 \
    https://get.digitalasset.com/install/install.sh -o "$installer"
  bash "$installer" 3.5.12
else
  dpm install 3.5.12
fi
DPM_SDK_VERSION=3.5.12 dpm version
