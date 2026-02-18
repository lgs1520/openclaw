#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODE="now"

for arg in "$@"; do
  case "$arg" in
    --mode=5m|--mode=15m|--mode=30m|--mode=now)
      MODE="${arg#--mode=}"
      ;;
    *)
      ;;
  esac
done

cd "${ROOT_DIR}"
node --import tsx src/monitor/index.ts --mode="${MODE}"
