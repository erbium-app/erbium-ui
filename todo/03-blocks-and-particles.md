# 03 — Blocks and particles

The blocks layer will initially focus on adapting the Coss UI particle registry. These are composable examples built from primitives, not new foundation components.

## Registry shape

- [ ] Decide whether the directory is named `blocks`, `particles`, or both; use one canonical registry terminology.
- [ ] Add `registry:block` support to the Erbium registry build.
- [ ] Keep blocks separate from `src/components` so examples do not become accidental public primitives.
- [ ] Define block naming, metadata, categories, dependencies, and preview conventions.
- [ ] Ensure block dependencies resolve to Erbium registry items rather than Coss package paths.

## Porting order

Port the Coss families in this order:

1. [ ] Forms and fields: `field`, `fieldset`, `form`, `input`, `input-group`, `textarea`, `number-field`, `otp-field`.
2. [ ] Selection: `checkbox`, `checkbox-group`, `radio-group`, `select`, `combobox`, `autocomplete`.
3. [ ] Feedback and status: `alert`, `progress`, `meter`, `spinner`, `skeleton`, `toast`.
4. [ ] Overlays and menus: `dialog`, `alert-dialog`, `drawer`, `popover`, `preview-card`, `menu`, `context-menu`, `tooltip`.
5. [ ] Navigation and layout: `tabs`, `accordion`, `collapsible`, `toolbar`, `sidebar`, `breadcrumb`, `pagination`, `frame`, `group`.
6. [ ] Content and data: `card`, `table`, `avatar`, `badge`, `calendar`, and date-picker compositions.
7. [ ] Remaining Coss particles and Erbium-specific examples.

## Block quality requirements

- [ ] Every block uses only public Erbium primitives and documented APIs.
- [ ] Every block has a narrow purpose and remains easy to copy, paste, and own.
- [ ] No block embeds product-specific network state or application routing.
- [ ] Variants cover useful states rather than merely changing colors.
- [ ] Examples include loading, empty, error, disabled, and success states where relevant.
- [ ] Examples are RTL-safe and keyboard accessible.
- [ ] Blocks have visual regression or story coverage where practical.

## Deferred higher-order blocks

Do not port these as foundation blocks yet:

- rich editors;
- full command palettes;
- data grids with server-side filtering or pagination;
- upload workflows;
- chat and messaging systems;
- auth, billing, settings, and dashboard workflows.

When revisited, these should become dedicated packages or application-level compositions built on the primitives and blocks registry.
