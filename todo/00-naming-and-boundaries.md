# 00 — Naming and boundaries

Reviewed 2026-10-04.

Base UI owns primitive behavior; Erbium owns design, composition, and documented API decisions. Prefer Base UI naming and APIs where applicable. shadcn compatibility is primarily the installation and registry workflow, not a requirement to preserve every upstream component name.

## Current decisions

- Use `otp-field`, Field, and Fieldset. Labels belong to fields; no standalone Label component is required.
- Use semantic `error` naming rather than `destructive`.
- `packages/ui` owns reusable components and styles. `packages/showcase` owns composition examples and installable stories; apps own product routing, fetching, and persistence.
- Preserve stable `data-slot` names, RTL behavior, and useful Base UI composition props. Narrow APIs only with a documented reason.
- Every component, block, and story must earn its place. Remove redundant options and wrappers instead of adding aliases for inventory parity.

## Remaining decisions

- [ ] Define package boundaries for agent sessions, file trees, and diffs before implementation.
- [ ] Define shared API contracts for Astro and React Native, documenting necessary platform differences.
- [ ] Review proposed Menu, Frame, and Group abstractions against actual compositions before exposing them.
