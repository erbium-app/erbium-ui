# 00 — Naming and boundaries

Reviewed 2026-11-17.

Base UI owns primitive behavior; Erbium owns design, composition, and documented API decisions. Prefer Base UI naming and APIs where applicable. shadcn compatibility is primarily the installation and registry workflow, not a requirement to preserve every upstream component name.

## Current decisions

- Use `otp-field`, Field, and Fieldset. Labels belong to fields; no standalone Label component is required.
- Use semantic `error` naming rather than `destructive`.
- `packages/ui` owns reusable components and styles. `packages/showcase` owns composition examples and installable stories; apps own product routing, fetching, and persistence.
- Preserve stable `data-slot` names, RTL behavior, and useful Base UI composition props. Narrow APIs only with a documented reason.
- Every component, block, and story must earn its place. Remove redundant options and wrappers instead of adding aliases for inventory parity.

## Remaining decisions

- [ ] Define the package boundary for agent session compositions before implementation. File trees, file views, and diffs already live in `packages/ui/src/blocks`.
- [ ] Define shared API contracts for React Native alongside React, documenting necessary platform differences.
