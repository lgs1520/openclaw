# Migration Map (Current -> Target)

- `skills/github-trending-scanner` -> `modules/trending-scan`
- `skills/camofox-skill` -> `modules/camofox`
- `cron/jobs.json` -> `core/scheduler` + `apps/cron-worker`
- `agents/`, `credentials/`, `memory/`, `telegram/`, `devices/`, `identity/`, `backup/` -> `runtime/`

## Notes
- Existing paths remain untouched for now to keep runtime stable.
- New features should be added in `modules/*` only.
- Remove legacy paths only after module-level cutover tests pass.
