#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="18789"
NOW="$(date '+%Y-%m-%d %H:%M:%S %z')"

ok() { printf '[OK] %s\n' "$1"; }
warn() { printf '[WARN] %s\n' "$1"; }
info() { printf '[INFO] %s\n' "$1"; }

info "healthcheck time: ${NOW}"
info "repo root: ${ROOT_DIR}"

if command -v lsof >/dev/null 2>&1; then
  if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    ok "gateway port ${PORT} is listening"
  else
    warn "gateway port ${PORT} is not listening"
  fi
elif command -v ss >/dev/null 2>&1; then
  if ss -ltn | awk '{print $4}' | grep -E "(^|:)${PORT}$" >/dev/null 2>&1; then
    ok "gateway port ${PORT} is listening"
  else
    warn "gateway port ${PORT} is not listening"
  fi
else
  warn "neither lsof nor ss found; skip port check"
fi

if crontab -l >/tmp/oc_cron.$$ 2>/dev/null; then
  ok "crontab loaded"
  if grep -E 'run_oc_backtest\.sh|run_oc_daily_report\.sh' /tmp/oc_cron.$$ >/dev/null 2>&1; then
    ok "v0 cron entries detected"
  else
    warn "v0 cron entries not found in current user crontab"
  fi
  if grep -E 'run_oc_monitor\.sh' /tmp/oc_cron.$$ >/dev/null 2>&1; then
    ok "v1 monitor cron entries detected"
  else
    warn "v1 monitor cron entries not found"
  fi
  rm -f /tmp/oc_cron.$$
else
  warn "no user crontab or permission denied"
fi

latest_in_dir() {
  local dir="$1"
  if [ ! -d "$dir" ]; then
    warn "$dir missing"
    return
  fi
  local latest
  latest="$(find "$dir" -type f -print0 2>/dev/null | xargs -0 ls -1t 2>/dev/null | head -n 1 || true)"
  if [ -n "$latest" ]; then
    ok "latest in $dir: $latest"
  else
    warn "no files found in $dir"
  fi
}

latest_in_dir "${ROOT_DIR}/runs"
latest_in_dir "${ROOT_DIR}/reports"

info "healthcheck completed"
