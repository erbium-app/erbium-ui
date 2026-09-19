# 01 — Component parity and missing primitives

Implement the genuinely missing primitives before porting blocks. Each item must include the component, registry entry, documentation/demo coverage, RTL behavior, keyboard behavior, controlled/uncontrolled behavior, and focused tests.

## Parity rules

- Prefer a Base UI primitive for behavior whenever an equivalent exists.
- Preserve shadcn-compatible names where they are already established.
- Adapt Coss concepts into Erbium components rather than copying Coss package boundaries.
- Keep styling and composition Erbium-owned while delegating behavior to Base UI.
- Every public component needs a source file, registry entry, generated registry output, Storybook/demo coverage, and focused tests.
- Every interactive component must support refs, `className`, composition, disabled/invalid states where relevant, keyboard behavior, screen-reader labeling, and RTL.

## Priority 1: direct Base UI/Coss gaps

- [ ] `autocomplete`
  - Base UI source: `@base-ui/react/autocomplete`.
  - Distinguish free-text suggestions from `combobox` selection.
  - Define async/loading, empty, clear, highlighted-option, filtering, and error states.
  - Provide input, trigger, list, item, group, separator, empty, status, portal, positioner, and popup wrappers.
  - Add examples for local filtering, async results, and no results.
- [ ] `checkbox-group`
  - Base UI source: `@base-ui/react/checkbox-group`.
  - Support controlled/uncontrolled values, orientation, disabled state, validation, and group labeling.
  - Integrate with `Field` and `Fieldset`.
- [ ] `frame`
  - Coss composition; no direct Base UI primitive.
  - Add the generic bordered content surface used by Coss particles.
  - Decide whether this is a primitive, a layout component, or a block-only composition.
- [ ] `group`
  - Coss composition; no direct Base UI primitive.
  - Add connected-control grouping with orientation, attached borders, and RTL-safe edge handling.
  - Coordinate with `ButtonGroup`, `InputGroup`, and the future toolbar so concepts do not overlap.
- [ ] `menu`
  - Base UI source: `@base-ui/react/menu`.
  - Add menu groups, items, checkbox/radio items, submenus, shortcuts, and disabled states.
  - Determine how `dropdown-menu`, `menubar`, and `context-menu` compose with it.
  - Expose a shared menu foundation without breaking existing specialized names.
- [ ] `meter`
  - Base UI source: `@base-ui/react/meter`.
  - Add determinate scalar measurement semantics, min/max, low/high/optimum, and accessible labeling.
  - Keep its API distinct from `Progress`; document when each should be used.
- [ ] `number-field`
  - Base UI source: `@base-ui/react/number-field`.
  - Add numeric parsing, min/max/step, increment/decrement controls, keyboard behavior, and invalid input handling.
  - Include press-and-hold behavior, scrubbing where appropriate, and locale-aware display decisions.
- [ ] `toolbar`
  - Base UI source: `@base-ui/react/toolbar`.
  - Add roving focus, orientation, separators, grouped controls, and RTL support.

## Priority 1: missing Base UI infrastructure

- [ ] `csp-provider`
  - Expose a thin Erbium wrapper around Base UI `CSPProvider`.
  - Document nonce/style handling for CSP-restricted applications.
- [ ] Provider composition
  - Define the recommended root provider order for direction, CSP, tooltip, and toast.
  - Provide a small optional provider composition if it improves adoption without hiding individual providers.
- [ ] Generic hooks
  - Add `use-media-query` as a generic hook, using the Base UI utility where stable and appropriate.
  - Add `use-copy-to-clipboard` as a generic hook with success/error state and cleanup.
  - Keep feature-specific hooks out of `packages/ui`.

## Priority 2: first-class aliases or extra primitives

- [ ] Extract `fieldset` from `field.tsx` into a first-class registry item while preserving the current API during migration.
- [ ] Reconcile `field.tsx` with Base UI Field.
  - Preserve Erbium layout components such as `FieldGroup`, `FieldContent`, and `FieldSeparator` where useful.
  - Use Base UI for control association, validity, descriptions, errors, and generated IDs.
- [ ] Decide whether to expose `otp-field` as an alias to `input-otp` or provide a Base UI-compatible export surface.
  - Compare the current `input-otp` dependency with Base UI `OTPField` before changing the public API.
- [ ] Decide whether to expose `preview-card` as an alias to `hover-card` or add a Coss-compatible export surface.
- [ ] Add a standalone `radio` wrapper or explicitly document that `radio-group` is the only public radio API.
- [ ] Add a `form` integration decision.
  - Document the boundary between Base UI Form, TanStack Form, and visual Field components.
  - Avoid exporting two competing form state models without clear guidance.
- [ ] Add a `date-picker` composition after `calendar` is stable; it should not duplicate calendar logic.

## Existing components to classify

Review these components and mark each as core, optional, block-only, or candidate for a dedicated package:

- Erbium-specific: `aspect-ratio`, `attachment`, `bubble`, `button-group`, `carousel`, `chart`, `direction`, `item`, `marker`, `message`, `message-scroller`, `native-select`, `questionnaire`, `resizable`.
- Styling/composition components: `alert`, `card`, `empty`, `kbd`, `label`, `pagination`, `skeleton`, `spinner`, `table`, `textarea`.
- Feature-risk components: `command`, `attachment`, `message`, `message-scroller`, `questionnaire`, and `chart`.

For each component:

- confirm that it is generic enough for the foundation;
- identify any Base UI or shadcn equivalent;
- decide whether it belongs in the core registry or a blocks/dedicated package;
- add accessibility and RTL coverage if it remains core;
- document intentional differences.

## Completion criteria for every primitive

- [ ] Uses Base UI where an equivalent accessible primitive exists.
- [ ] Supports controlled and uncontrolled usage where appropriate.
- [ ] Supports `className`, composition, refs, and the repository's RTL conventions.
- [ ] Has disabled, invalid, loading, and empty states where relevant.
- [ ] Has keyboard and screen-reader coverage.
- [ ] Is exported through the package and generated registry.
- [ ] Has at least one block/particle example once the blocks phase begins.
