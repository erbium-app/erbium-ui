# UI registry parity roadmap

This directory tracks the work required to bring the Erbium UI registry to parity with the active Coss UI primitives and its particle/block examples.

## Scope

- The `packages/ui` layer owns small, generic, accessible primitives.
- Repeated concepts keep the established shadcn names and composition style.
- Base UI is the preferred behavior and accessibility foundation wherever it provides the required primitive.
- The blocks layer will initially port and adapt Coss UI particles.
- Large, stateful products such as editors and command-palette systems belong in dedicated packages, not in the UI foundation.
- Higher-order product-specific blocks with substantial state are intentionally deferred.

## Work sequence

1. [Naming and boundaries](./00-naming-and-boundaries.md)
2. [Missing primitives](./01-missing-primitives.md)
3. [Base UI and API modernization](./02-base-ui-api.md)
4. [Blocks and particles](./03-blocks-and-particles.md)
5. [Validation and release gates](./04-validation.md)

The first three documents should be completed before adding a large number of blocks. Otherwise, block examples will encode APIs that later need to be renamed or rewritten.
