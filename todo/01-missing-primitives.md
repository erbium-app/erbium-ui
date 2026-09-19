# 01 — Missing primitives

Implement the genuinely missing primitives before porting blocks. Each item should include the component, registry entry, documentation/demo coverage, RTL behavior, keyboard behavior, and focused tests.

## Priority 1: direct Coss gaps

- [ ] `autocomplete`
  - Distinguish free-text suggestions from `combobox` selection.
  - Define async/loading, empty, clear, and highlighted-option states.
- [ ] `checkbox-group`
  - Support controlled/uncontrolled values, orientation, disabled state, validation, and group labeling.
- [ ] `frame`
  - Add the generic bordered content surface used by Coss particles.
- [ ] `group`
  - Add connected-control grouping with orientation, attached borders, and RTL-safe edge handling.
- [ ] `menu`
  - Add menu groups, items, checkbox/radio items, submenus, shortcuts, and disabled states.
  - Determine how `dropdown-menu` and `menubar` compose with it.
- [ ] `meter`
  - Add determinate scalar measurement semantics, min/max, low/high/optimum, and accessible labeling.
- [ ] `number-field`
  - Add numeric parsing, min/max/step, increment/decrement controls, keyboard behavior, and invalid input handling.
- [ ] `toolbar`
  - Add roving focus, orientation, separators, grouped controls, and RTL support.

## Priority 2: first-class aliases or extra primitives

- [ ] Extract `fieldset` from `field.tsx` into a first-class registry item while preserving the current API during migration.
- [ ] Decide whether to expose `otp-field` as an alias to `input-otp` or provide a Coss-compatible export surface.
- [ ] Decide whether to expose `preview-card` as an alias to `hover-card` or add a Coss-compatible export surface.
- [ ] Add a `date-picker` composition after `calendar` is stable; it should not duplicate calendar logic.

## Completion criteria for every primitive

- [ ] Uses Base UI where an equivalent accessible primitive exists.
- [ ] Supports controlled and uncontrolled usage where appropriate.
- [ ] Supports `className`, composition, refs, and the repository's RTL conventions.
- [ ] Has disabled, invalid, loading, and empty states where relevant.
- [ ] Has keyboard and screen-reader coverage.
- [ ] Is exported through the package and generated registry.
- [ ] Has at least one block/particle example once the blocks phase begins.
