# UI library completeness roadmap

This directory tracks the work required to make Erbium a complete, composable UI library built from three compatible layers:

- Base UI for behavior, accessibility, state, focus management, positioning, and primitives;
- shadcn UI for familiar names, copy/paste composition, styling conventions, and registry ergonomics;
- Coss UI for the broader primitive and particle inventory that Erbium should adapt.

The goal is not to copy every package blindly. Each component should have one canonical Erbium API, use the strongest available behavior foundation, remain RTL-safe, and be usable independently through the registry.

## Scope

- The `packages/ui` layer owns small, generic, accessible primitives.
- Repeated concepts keep the established shadcn names and composition style.
- Base UI is the preferred behavior and accessibility foundation wherever it provides the required primitive.
- shadcn-compatible names and composition are preferred when a concept overlaps with shadcn.
- The blocks layer will initially port and adapt Coss UI particles.
- Large, stateful products such as editors and command-palette systems belong in dedicated packages, not in the UI foundation.
- Higher-order product-specific blocks with substantial state are intentionally deferred.

## Current baseline

The package already wraps most Base UI overlay, selection, navigation, and feedback primitives. The most important gaps are:

- missing Base UI wrappers: `checkbox-group`, `meter`, `number-field`, and `toolbar`;
- missing or indirect wrappers: `form`, `fieldset`, generic `menu`, standalone `radio`, and `otp-field`;
- custom hand-rolled behavior in `field.tsx` that should be reconciled with Base UI Field;
- incomplete shared conventions for `useRender`, `mergeProps`, portals, direction, CSP, and state attributes;
- toast is present and Base UI-backed, but needs a complete notification API and behavior/test audit;
- blocks, stories, focused tests, and registry coverage are still sparse.

The complete comparison and implementation checklist is in [Component parity](./01-missing-primitives.md) and [Base UI conventions](./02-base-ui-api.md).

## Work sequence

1. [Naming and boundaries](./00-naming-and-boundaries.md)
2. [Missing primitives](./01-missing-primitives.md)
3. [Base UI and API modernization](./02-base-ui-api.md)
4. [Blocks and particles](./03-blocks-and-particles.md)
5. [Validation and release gates](./04-validation.md)
6. [Paper design-system parity](./05-paper-design-system.md)

The first three documents should be completed before adding a large number of blocks. Paper coverage should be added alongside each component family, not postponed until the end, so the design system remains live and reviewable as the library evolves.
