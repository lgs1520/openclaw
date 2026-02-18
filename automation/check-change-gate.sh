#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-}"
HEAD="${2:-}"

if [[ -n "$BASE" && -n "$HEAD" ]]; then
  CHANGED_FILES="$(git diff --name-only "$BASE" "$HEAD")"
else
  CHANGED_FILES="$(git diff --name-only HEAD; git ls-files --others --exclude-standard)"
fi

if [[ -z "${CHANGED_FILES// }" ]]; then
  echo "No changed files detected."
  exit 0
fi

core_touched=0
modules=()

while IFS= read -r file; do
  [[ -z "$file" ]] && continue

  if [[ "$file" == core/* ]]; then
    core_touched=1
  fi

  if [[ "$file" == modules/*/* ]]; then
    module_name="$(echo "$file" | cut -d'/' -f2)"
    modules+=("$module_name")
  fi
done <<< "$CHANGED_FILES"

unique_modules="$(printf '%s\n' "${modules[@]:-}" | sed '/^$/d' | sort -u)"
module_count=0
if [[ -n "$unique_modules" ]]; then
  module_count="$(printf '%s\n' "$unique_modules" | sed '/^$/d' | wc -l | tr -d ' ')"
fi

human_approved="${HUMAN_APPROVED:-false}"

violation=0

if [[ "$core_touched" -eq 1 && "$human_approved" != "true" ]]; then
  echo "[BLOCK] core/ changes detected but HUMAN_APPROVED is not true."
  violation=1
fi

if [[ "$module_count" -gt 1 && "$human_approved" != "true" ]]; then
  echo "[BLOCK] Cross-module changes detected (${module_count} modules) but HUMAN_APPROVED is not true."
  echo "Modules:"
  printf '%s\n' "$unique_modules"
  violation=1
fi

echo "Changed files:"
printf '%s\n' "$CHANGED_FILES"

if [[ "$violation" -eq 1 ]]; then
  echo "\nSet HUMAN_APPROVED=true only after human confirmation."
  exit 1
fi

echo "Change gate passed."
