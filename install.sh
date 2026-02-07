#!/usr/bin/env bash
set -euo pipefail

LANG_CODE="fa"
DEST_DIR="/var/lib/pasarguard/templates/subscription"
DEST_FILE="${DEST_DIR}/index.html"
ENV_FILE="/opt/pasarguard/.env"

usage() {
  cat <<'EOF'
Usage: install.sh [--lang en|fa|zh|ru]

Examples:
  install.sh
  install.sh --lang en
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --lang)
      if [[ $# -lt 2 ]]; then
        echo "Error: --lang needs a value (en|fa|zh|ru)." >&2
        exit 1
      fi
      LANG_CODE="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

case "${LANG_CODE}" in
  en|fa|zh|ru) ;;
  *)
    echo "Error: invalid language '${LANG_CODE}'. Use one of: en, fa, zh, ru." >&2
    exit 1
    ;;
esac

URL="https://github.com/PasarGuard/subscription-template/releases/latest/download/${LANG_CODE}.html"
if [[ "${LANG_CODE}" == "fa" ]]; then
  URL="https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html"
fi

mkdir -p "${DEST_DIR}"

if command -v wget >/dev/null 2>&1; then
  wget -q -O "${DEST_FILE}" "${URL}"
elif command -v curl >/dev/null 2>&1; then
  curl -fsSL "${URL}" -o "${DEST_FILE}"
else
  echo "Error: neither wget nor curl is installed." >&2
  exit 1
fi

mkdir -p "$(dirname "${ENV_FILE}")"
touch "${ENV_FILE}"

if grep -q '^CUSTOM_TEMPLATES_DIRECTORY=' "${ENV_FILE}"; then
  sed -i 's|^CUSTOM_TEMPLATES_DIRECTORY=.*|CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"|' "${ENV_FILE}"
else
  echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' >> "${ENV_FILE}"
fi

if grep -q '^SUBSCRIPTION_PAGE_TEMPLATE=' "${ENV_FILE}"; then
  sed -i 's|^SUBSCRIPTION_PAGE_TEMPLATE=.*|SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"|' "${ENV_FILE}"
else
  echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' >> "${ENV_FILE}"
fi

if command -v pasarguard >/dev/null 2>&1; then
  pasarguard restart
  echo "Installed and restarted PasarGuard."
else
  echo "Installed template at ${DEST_FILE}."
  echo "pasarguard command not found, restart service manually."
fi
