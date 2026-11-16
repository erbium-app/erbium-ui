# 00 — Naming and boundaries

Reviewed 2026-11-17.

Base UI owns primitive behavior; Erbium owns design, composition, and documented API decisions. Prefer Base UI naming and APIs where applicable. shadcn compatibility is primarily the installation and registry workflow, not a requirement to preserve every upstream component name.

## Remaining decisions

- [ ] Define the package boundary for agent session compositions before implementation.
- [ ] Define shared API contracts for React Native alongside React, documenting necessary platform differences.
