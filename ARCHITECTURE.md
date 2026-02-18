# OpenClaw Runtime Architecture (Isolated Modules + Shared Core)

## Goals
- Each feature is independently developed and upgraded.
- Shared bottom-layer logic is centralized in `core/`.
- Sub-features inside a module must stay isolated via `plugins/`.
- Cross-module and `core/` changes require human approval.

## Top-level layout
- `core/`: shared runtime capabilities only.
- `modules/`: isolated business features.
- `apps/`: entrypoints/composition layer, no feature logic.
- `runtime/`: stateful runtime data only.
- `policies/`: governance and approval rules.
- `automation/`: validation scripts used by CI.

## Dependency rules
1. `modules/*` can depend on `core/*` and itself only.
2. No direct module-to-module import.
3. Cross-module communication must use `core/contracts/`.
4. Any PR touching more than one module OR `core/*` must include human approval.

## Migration note
Current `skills/*` remains active for compatibility. New features should be created under `modules/*`, then gradually migrate old skills.
