# Repository Guidelines

## Project Structure & Module Organization
This repository mixes runtime state with source assets. Keep code and docs changes focused on tracked source paths.
- `skills/`: custom skills and JavaScript modules (for example `skills/camofox-skill/` and `skills/github-trending-scanner/`).
- `workspace/` and `workspace-dev/`: agent docs and skill metadata (`AGENTS.md`, `TOOLS.md`, `skills/*`).
- `canvas/`: static UI assets (`canvas/index.html`).
- `cron/`: scheduler configuration (`cron/jobs.json`).
- Runtime/state directories such as `credentials/`, `completions/`, `agents/`, `telegram/`, `devices/`, and `identity/` are not primary code targets.

## Build, Test, and Development Commands
Run commands from the repository root unless noted.
- `git status --short`: verify only intended files are staged.
- `npm --prefix skills/camofox-skill install`: install dependencies for the Camofox skill.
- `npm --prefix skills/camofox-skill run test:m1` (or `test:m2`, `test:m3`, `test:m4`): run skill-specific test harness scripts when present.
- `node skills/github-trending-scanner/index.js`: run the trending scanner entry point.

## Coding Style & Naming Conventions
- JavaScript uses 2-space indentation, semicolons, and CommonJS modules (`require`/`module.exports`) to match existing files.
- Use `kebab-case` for folder names, `camelCase` for variables/functions, and clear handler names under `handlers/`.
- Keep config/data JSON minimal, deterministic, and sorted where practical.

## Testing Guidelines
- Place tests near the module they cover (for example `skills/<skill-name>/test-*.js`).
- Prefer small, deterministic tests for parser/handler logic and mocked network boundaries.
- Before opening a PR, run relevant skill tests and include exact command output snippets in the PR description.

## Commit & Pull Request Guidelines
- Follow Conventional Commit style seen in history (for example `chore: initial clean runtime baseline`).
- Scope commits to one concern (skill code, docs, or config), and avoid committing runtime artifacts.
- PRs should include: purpose, changed paths, test commands run, and rollback notes for config changes.

## Security & Configuration Tips
- Never commit secrets or runtime credentials (`.env`, tokens, `*.pem`, `*.key`, `id_*`).
- Treat `openclaw.json` and backup/state files as sensitive unless explicitly sanitized.
