#!/usr/bin/env bash
set -euo pipefail

SDK_VERSION="3.5.12"

if command -v dpm >/dev/null 2>&1; then
  echo "DPM already installed: $(dpm --version || true)"
  exit 0
fi

echo "Installing open-source DPM SDK ${SDK_VERSION}..."
curl -sSL https://get.digitalasset.com/install/install.sh | DPM_EDITION=open-source bash -s "${SDK_VERSION}"

export PATH="$HOME/.dpm/bin:$PATH"

echo "Installed:"
dpm --version
