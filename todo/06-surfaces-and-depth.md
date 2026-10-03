# 06 — Surfaces and depth

Replace the flat shadcn look with a lit, layered surface system on a faded Vitesse palette:

- Light falls from the top.
- Raised things catch it on their top edge and cast a short shadow below.
- Edges are drawn with shadows, not borders.

Every component takes its look from a small set of surface roles instead of hand-writing `border`, `bg-*`, and `shadow-*`.

References:

- Foglamp: `foglamp/packages/ui`
- Coss UI: `coss/packages/ui`
- Fluid Functionalism: `fluid-functionalism`
- Vitesse: `.reference/vitesse-{light,dark}.json`

## Decisions

- **Controls are raised, including inputs**, as in Coss and Foglamp.
  - Buttons, inputs, textareas, select and combobox triggers, and selected toggles all share the `control` role.
- **Recessed wells are rare.** They are reserved for tracks that something moves inside: the switch track, the slider and progress tracks, and a segmented-control (tabs) list.
- **Borders are removed from surfaces.** The edge is a hairline inside the shadow recipe.
  - Internal dividers use the shared carved shadow/highlight rule.
  - It also survives as a transparent forced-colors fallback.
- **The palette is faded Vitesse** (see Phase 1): warm ink `#393a34` on `#f7f7f7`/white in light, warm light `#dbd7ca` on `#121212` in dark.
  - The green primary: `#1c6b48` light, `#4d9375` dark.
  - Muted Vitesse status colours.
  - Shadows are tinted with Vitesse ink, and dark catchlights with Vitesse light (`#dedcd5`), rather than pure black and white.
- **Values are tuned by eye**, one component at a time, against the Foundations/Surfaces story (see the loop below).

## How the references create the illusion

- **Foglamp:**
  - **Edges:** no borders on surfaces; the edge is a box-shadow hairline.
  - **Light mode:** cast shadows only, all offset downward.
  - **Dark mode:** a different recipe:
    - a top-edge inset highlight (`white/3%`);
    - an inset rim;
    - an outer black hairline;
    - stacked `2/4/8px` drops.
  - **Surface colour:** gets lighter as it rises (background `.17` → card `.205`).
  - **Filled buttons:** carry a bright inset top gloss.
  - **Weakness:** the recipes are declared on `:root`, so every colour variant is a copied shadow (14 of them).
- **Coss:**
  - **Bevel:** a `before:` pseudo-element carries it. In light, `0 1px black/4%` is a darker lower lip; in dark, `0 -1px white/6%` is a lit upper lip.
  - **Fills:** `inset-shadow-[0_1px_white/16%]` gives them a top gloss. Pressed swaps to `inset-shadow-[0_1px_black/8%]` with no drop, so the button looks pushed in.
  - **Dark elevation:** made by mixing 2–4% white into the background.
- **Fluid Functionalism:**
  - **Ladder:** eight surface levels, each paired with a shadow level.
  - **Theme split:** light is flat white plus a growing shadow; dark is a lighter colour plus a growing highlight.
  - **Nesting:** a React substrate context carries the level through portals, so a dropdown in a dialog renders above the dialog.
  - **Hover:** a tint layer rather than a colour per level.
  - **Your pasted markup:** the `ff-surface-*` classes are this ladder.

## The primitives

Implemented in `packages/ui/src/styles/surfaces.css`, imported from `globals.css` after `theme.css`.

### Lighting model

1. One light, from the top.
   - Every offset is vertical, so RTL needs nothing.
   - Catchlights sit on top edges; drops fall below.
2. Raised bodies are lighter and cast downward.
   - **Light:** everything above the canvas is white, so the drops carry the elevation.
   - **Dark:** the surface colour climbs; controls use a subtle catchlight and overlays use a slightly stronger one.
3. **Light and dark share every recipe's geometry; only the colours change.**
   - Light: the neutral catchlight is transparent, and the edge and drops are Vitesse ink.
   - Dark: the catchlight and faint perimeter are Vitesse light, while the drops are black.
4. **The top catchlight sits on the outer perimeter.**
   - A shadow offset 1px upward paints over the perimeter shadow, making the top edge brighter without a dark border above it.
   - Neutral surfaces back the translucent perimeter with their surface colour, so the drop cannot fade the bottom edge.
   - Surface borders are transparent and provide a forced-colors fallback.
   - Both the rim and catchlight follow the same rounded shape.
5. Pressed and popup-open controls lose their drop and gain an inset top shade.
6. Lists stay flat. Only the selected item is raised.

### Colours (`bg-surface-*`)

| Token             | Light     | Dark      | Use                                      |
| ----------------- | --------- | --------- | ---------------------------------------- |
| `surface-canvas`  | `#f7f7f7` | `#121212` | page                                     |
| `surface-panel`   | `#ffffff` | `#181818` | card, frame, table container             |
| `surface-control` | `#ffffff` | `#1e1e1e` | buttons, inputs, triggers, selected item |
| `surface-overlay` | `#ffffff` | `#222222` | popover, menu, select popup              |
| `surface-modal`   | `#ffffff` | `#262626` | dialog, sheet, drawer                    |
| `surface-top`     | `#ffffff` | `#2b2b2b` | an overlay opened inside a modal         |
| `surface-well`    | ink 5%    | black 25% | tracks only                              |

### Token naming and dependency direction

Theme tokens (`:root` / `.dark`) hold colours only. Surface classes turn them into
per-element tokens, and the per-element tokens drive one shadow recipe. General
lighting feeds treatments, never the reverse.

| Theme token                                                                        | Meaning                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `--surface-{role}`                                                                 | Face colours such as panel, input, and overlay         |
| `--surface-highlight`, `--surface-highlight-strong`, `--surface-highlight-divider` | Neutral catchlights (transparent in light mode)        |
| `--surface-catchlight-lift`                                                        | Soft-tint catchlight switch: 0% light, 100% dark       |
| `--surface-shadow`, `--surface-shadow-strong`                                      | Cast-shadow colours                                    |
| `--surface-shadow-inset`, `--surface-shadow-divider`                               | Recess and divider shadow colours                      |
| `--surface-edge`, `--surface-edge-well`                                            | Neutral perimeter colours                              |
| `--surface-border`                                                                 | Transparent CSS border used for forced-colors fallback |
| `--surface-tint-hover`, `--surface-tint-pressed`                                   | Neutral interaction tint colours                       |
| `--surface-tag-alpha`                                                              | Translucent tag strength (10% light, 15% dark)         |
| `--tag-{color}-alpha`                                                              | Per-colour tag strength (`--tag-yellow-alpha`: 15%)    |
| `--separator-direction`, `--separator-fade-direction`                              | Local separator geometry                               |

Element tokens are registered with `@property { inherits: false }`, so a nested
surface never inherits its parent's face or state, and their initial values are
the defaults of every surface:

| Element token          | Meaning                                               |
| ---------------------- | ----------------------------------------------------- |
| `--surface-face`       | Fill colour, also the opaque backing ring             |
| `--surface-rim`        | 1px perimeter                                         |
| `--surface-catchlight` | 1px top line painted over the perimeter's top row     |
| `--surface-backing`    | Ring under the perimeter so the drop cannot darken it |
| `--surface-drop`       | Three drop shadows                                    |
| `--surface-recess`     | Inset shade for pressed and engaged states            |
| `--surface-tint`       | State overlay painted over the face                   |
| `--surface-hover-tint` | Tint that hover paints (default neutral hover tint)   |
| `--surface-press-tint` | Tint that press and engaged paint                     |

Roles that build on another (`surface-field` and `surface-fill-*` on
`surface-control`; every role on `surface-flat`) set their tokens first and
then `@apply` the base. The base writes its own defaults inside `:where(&)`,
with no specificity, so the derived role's tokens win and the base's state
rules, which come later, still win over both.

### Roles (one class per element, plus `border`)

| Class                   | Face                    | Elevation                                                 | States                                         |
| ----------------------- | ----------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `surface-panel`         | `--surface-panel`       | catchlight, rim, two soft drops                           | tint on links                                  |
| `surface-control`       | `--surface-control`     | catchlight, rim, tight and soft drops                     | tint, sink, invalid, disabled                  |
| `surface-field`         | `--surface-input`       | as control (builds on it)                                 | as control                                     |
| `surface-overlay`       | `--surface-overlay`     | strong catchlight, rim, `2/8/16px` drops                  | none                                           |
| `surface-modal`         | `--surface-modal`       | strong catchlight, rim, `4/16/32px` drops                 | none                                           |
| `surface-flat`          | transparent or `bg-*`   | none                                                      | tint                                           |
| `surface-frame`         | panel at 50%            | rim only                                                  | tint on links                                  |
| `surface-knob`          | `--surface-control`     | strong catchlight, rim, two drops, no backing             | none                                           |
| `surface-well`          | `--surface-well`        | inset top shade, inset rim                                | none                                           |
| `surface-fill-{color}`  | the colour              | lifted-face catchlight, darkened rim, control drops       | as control (builds on it)                      |
| `surface-tint-{color}`  | the colour              | lift-switched catchlight, `currentColor` rim, panel drops | tint on links                                  |
| `surface-tag-{color}`   | the colour at tag alpha | as tint, no backing                                       | tint on links                                  |
| `surface-ghost-{color}` | transparent             | none                                                      | colour on hover; deepened on press and engaged |

Every role paints the same seven shadow layers (catchlight, rim, backing, three
drops, recess) so state transitions interpolate. The shadow is written through
`--tw-shadow`, so `ring-*` focus rings still compose with it.

### Why it is built this way

- **One class, states from the element.** The role reads hover, `:active`,
  `aria-expanded`, `aria-pressed`, `data-state="on"`, `data-popup-open`,
  `aria-invalid`, and disabled attributes itself. Components no longer list state
  classes, and a new coloured element is `border surface-fill-{color}`.
- **Any colour, both themes.** Fills derive their rim (`face 88% + black`) and
  catchlight (`face 80% + white`) from the face; tints and tags derive theirs
  from `currentColor`. Ghost colours paint the colour on hover and mix 10% of
  `currentColor` into it for press and engaged, which deepens it in light mode
  and lifts it in dark mode, so no `*-soft-hover` token is needed.
- **No public building blocks.** The sink, invalid, and disabled states live in
  `surface-control`, which fields and fills build on; there is no separate
  `surface-press` class. Interactive elements are named once, in the
  `surface-interactive` variant.
- **Overridable.** State selectors use `:where()`, so any utility on the element
  (`bg-*`, `shadow-none`, `[--surface-face:…]`) wins over the role.
- **Merge-safe.** `lib/utils.ts` registers the roles as one `cn` class group, so
  `cn("surface-control", "surface-fill-primary")` keeps only the fill.
- **Don't combine a role with `shadow-<color>`.** Tailwind's shadow-colour utility repaints every layer, flattening the recipe.

### Nesting across portals (added in Phase 3)

Base UI portals popups to `body`, so CSS cannot see that a menu lives inside a dialog. Following Fluid:

- **`lib/surface.tsx`:**
  - `SurfaceContext` (default `canvas`);
  - `SurfaceProvider`;
  - `useSurfaceLevel(role)`, which returns the higher of the role's level and substrate + 1.
- **Providers:** card, popover, and the dialog, sheet and drawer popups.
- **Consumers:** each popup sets `data-surface` and carries one static class list (`data-[surface=top]:bg-surface-top …`), so Tailwind sees every class and no lookup tables are needed.

## Component roles

| Role                    | Components                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canvas                  | page, default `sidebar`, `resizable` panels                                                                                                                                                                                                                                                                                |
| panel                   | `card`, future `frame`, `table` container, neutral `alert`, outline `item` and `empty`, contained `accordion`, floating/inset `sidebar`, `attachment`                                                                                                                                                                      |
| control                 | outline and secondary `button`, `input`, `textarea`, `input-group`, `input-otp` slots, `select` / `combobox` / `autocomplete` triggers, `toggle` and `toggle-group` item when pressed, active `tabs` trigger, active sidebar item, `kbd`, `pagination` current page, `carousel` controls, unchecked `checkbox` and `radio` |
| overlay (context-aware) | `popover`, `hover-card`, `dropdown-menu`, `context-menu`, `menubar` content, `select` / `combobox` / `autocomplete` popups, `navigation-menu` viewport, toast                                                                                                                                                              |
| modal                   | `dialog`, `alert-dialog`, `sheet`, `drawer`                                                                                                                                                                                                                                                                                |
| fill                    | default and status `button`, checked `checkbox` / `radio`, solid `badge`, `slider` range, `progress` indicator                                                                                                                                                                                                             |
| knob                    | `switch` thumb, `slider` thumb                                                                                                                                                                                                                                                                                             |
| well (rare)             | `switch` track, `slider` and `progress` tracks, `tabs` list (segmented)                                                                                                                                                                                                                                                    |
| tint                    | soft and tag `badge`, soft `button`, status `alert`                                                                                                                                                                                                                                                                        |
| inverse                 | `tooltip`: `bg-foreground`, overlay drops without a catchlight                                                                                                                                                                                                                                                             |
| flat                    | menu, select, command and sidebar items, table rows, ghost and link `button`, `breadcrumb`; `surface-flat` adds the hover tint                                                                                                                                                                                             |

### States

States are built into the roles; components add no state classes.

| State                                                                           | Source                                                                 | Effect                                 |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| hover                                                                           | `:hover` on links, buttons, comboboxes, tabs (hover-capable pointers)  | `--surface-hover-tint` overlay         |
| pressed                                                                         | `:active` on the same elements                                         | `--surface-press-tint`; controls sink  |
| engaged (`aria-expanded`, `aria-pressed`, `data-state="on"`, `data-popup-open`) | attribute                                                              | `--surface-press-tint`; controls sink  |
| selected flat toggle                                                            | `surface-flat engaged:surface-control`                                 | becomes a sunk control                 |
| focus-visible                                                                   | component `focus-visible:border-ring`                                  | border colour, no outer ring           |
| invalid                                                                         | `aria-invalid` on the element or its direct input                      | error rim                              |
| disabled                                                                        | `:disabled`, `data-disabled`, `aria-disabled`, a disabled direct input | hairline only; selected keeps its tint |

Transitions: `transition-[background-color,box-shadow,translate] duration-150 motion-reduce:transition-none`.

## The review loop (every component)

1. **Migrate one component.**
   - Replace `border-*`, `ring-1 ring-foreground/10`, `bg-*` and `shadow-*` with its role pair and state classes.
   - Remove `dark:` overrides that the tokens now cover.
2. **Screenshot its stories in light and dark** (Playwright against the Storybook build), next to the Foundations/Surfaces story and the previous version.
3. **Review together and decide:** keep, or adjust.
   - An adjustment to a shared value goes into `surfaces.css` and re-screenshots every component already migrated.
   - An adjustment for this component alone stays in the component. Every such exception is listed at the bottom of this file.
4. **Verify:**
   - keyboard focus ring visible;
   - `aria-invalid`;
   - disabled;
   - RTL;
   - `prefers-reduced-motion`;
   - forced colors (`forced-colors: active` emulation shows a border).
5. **Rebuild the registries, run `bun run check`, and commit that component alone.**

## Phases

- [x] **Phase 0: primitives.**
  - [x] `surfaces.css`: colours, element tokens, and one-class surface roles with built-in states.
  - [x] `cn` surface-role class group.
  - [x] `Foundations/Surfaces` story (Ladder, Roles, Nesting, States) in both themes.
  - [x] Review the Roles story in both themes and settle the base values (the edge alpha, the dark catchlight, the ladder steps) before any component moves.
- [x] **Phase 1: palette.** Remap `theme.css` onto faded Vitesse and the surface ladder, then review every existing story at once. Colours only; no component classes change.
  - [x] `--background: var(--surface-canvas)`, `--card: var(--surface-panel)`, `--popover: var(--surface-overlay)`.
  - [x] Light:
    - `--foreground #393a34`;
    - `--muted-foreground #6a737d`;
    - `--primary #1c6b48` / `#ffffff`;
    - `--error #ab5959`;
    - `--success #1e754f`;
    - `--warning #a65e2b`;
    - `--info #296aa3`;
    - `--ring` from the primary.
  - [x] Dark:
    - `--error #cb7676` (Vitesse error, replacing `#f97583`);
    - status colours from Vitesse terminal colours;
    - `--primary #4d9375` kept.
  - [x] `--border` becomes an alpha divider (ink 8% / light 8%), and Vitesse `#2f363d` stops outlining surfaces.
  - [x] `--accent` and `--sidebar-accent` became translucent (they always sit on a surface); `--muted` and `--secondary` stay solid (`#f0f0f0` / `#232323`) because the calendar range and floating bubble badges overlap them and would show through.
- [x] **Phase 2: controls.** One commit each, in this order, because each teaches the next:
  - [x] `button` (fill, control, flat and tint variants)
  - [x] `input`
  - [x] `textarea`
  - [x] `input-group`
  - [x] `select` trigger
  - [x] `combobox` / `autocomplete` input
  - [x] `toggle` and `toggle-group`
  - [x] `kbd`
  - [x] `badge`
  - [x] `pagination`
- [ ] **Phase 3: panels and overlays.**
  - [ ] `card`
  - [ ] `alert`
  - [ ] `item` and `empty`
  - [ ] `sidebar`
  - [ ] Add `lib/surface.tsx`, then `popover` and `hover-card`.
  - [ ] Menus: `dropdown-menu`, `context-menu`, `menubar`, `navigation-menu`.
  - [ ] Select and combobox popups.
  - [ ] `dialog`, `alert-dialog`, `sheet`, `drawer`, toast, `tooltip`.
- [ ] **Phase 4: selection and tracks.**
  - [ ] `tabs` (well list + control indicator)
  - [ ] `switch` (well track + knob)
  - [ ] `checkbox` and `radio-group` (control → fill)
  - [ ] `slider`
  - [ ] `progress`
  - [ ] `calendar`
  - [ ] `accordion`
  - [ ] `table`
- [ ] **Phase 5: hardening.**
  - [ ] Add a Playwright check across all stories that asserts:
    - dark surface luminance rises canvas → panel → control → overlay → modal;
    - focus rings render on surfaced controls;
    - forced colors shows borders.
  - [ ] Add a review rule: no raw `border-*`, `ring-1`, or `shadow-{sm,md,lg}` on surfaces in `packages/ui`.
  - [ ] Document the roles and the lighting model in `apps/docs`.
  - [ ] Add the ladder to the Paper file ([05](./05-paper-design-system.md)).
  - [ ] Remove the unused `shadow-plugin` dependency if nothing adopts it.

## Constraints

- **Children covering the catchlight.** The raised catchlight sits outside the surface, so child backgrounds cannot cover it. Components that clip outer shadows need a local treatment during migration.
- **Forced colors.** Shadows are removed in forced-colors mode.
  - Surfaced interactive components keep `border border-transparent`, which the browser forces to a visible colour.
  - Background clipping stays on the border box, so the transparent border does not open a gap between the fill and the hairline.
- **Contrast.** Alpha hairlines are below the WCAG 1.4.11 3:1 target, as in every reference. Controls rely on the hairline together with the drop and the fill difference.
  - Record measured edge contrast in the review of each field.
- **Performance.**
  - Controls keep ≤ 5 layers; long drop stacks are for overlays and modals only.
  - Never surface individual rows of long lists.
  - Transition box-shadow only on controls, not on repeated items.
- **Registry.** `surfaces.css` ships with the `styles` registry item, and `lib/utils` now depends on `cn/config`.

## Component-specific exceptions

Record every value a component overrides locally, with the reason, as the migration goes.

- Joined outline button and toggle groups own one outer frame. Segments clear their rim, catchlight, backing, and drops to retain only face, tint, and recess; internal seams use the shared carved divider recipe. Popup focus guards must not interrupt seam selectors.
- `input-otp` slots retain their individual control surfaces.
- The `command` search field and the search field inside the `combobox` popup stay flat (translucent, no shadow): a raised field inside an overlay competes with the overlay itself.
- `kbd` inside a tooltip drops its shadow, because the tooltip is an inverse surface.
- `calendar` and `command` drop their own surface (`bg-transparent shadow-none border-0`) when embedded in a card, popover, or dialog that already provides one.
- `input-group` controls and buttons drop their own shadow, because the group owns the field surface.
- Menu, select, command, menubar, and navigation-menu items keep their `bg-accent` / `bg-muted` highlight. They follow the widget's keyboard highlight (`data-highlighted`, `data-selected`, focus), which a hover tint cannot, so the interactive selector list leaves out `menuitem*`, `option`, and `treeitem`. Switches, checkboxes, and radios are also left out: their state is `checked`, and their tracks and indicators do not carry a hover tint.
- `bubble` content is not a surface; its variants derive hover colours with `color-mix` toward the text colour.
