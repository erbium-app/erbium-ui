# 06 — Surfaces and depth

Replace the flat shadcn look with a lit, layered surface system on a faded Vitesse palette:

- Light falls from the top.
- Raised things catch it on their top edge and cast a short shadow below.
- Edges are drawn with shadows, not borders.

Every component takes its look from a small set of surface roles instead of hand-writing `border`, `bg-*`, and `shadow-*`.

References:

- Foglamp: `/Volumes/AlirezaDev/Codes/agents/foglamp/packages/ui`
- Coss UI: `/Volumes/AlirezaDev/Codes/Packages/coss/packages/ui`
- Fluid Functionalism: `/Volumes/AlirezaDev/Codes/Packages/fluid-functionalism`
- Vitesse: `.reference/vitesse-{light,dark}.json`

## Decisions

- **Controls are raised, including inputs**, as in Coss and Foglamp.
  - Buttons, inputs, textareas, select and combobox triggers, and selected toggles all share the `control` role.
- **Recessed wells are rare.** They are reserved for tracks that something moves inside: the switch track, the slider and progress tracks, and a segmented-control (tabs) list.
- **Borders are removed from surfaces.** The edge is a hairline inside the shadow recipe.
  - `border` survives only for dividers (separator, table rows, card header and footer rules).
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
   - **Dark:** the surface colour climbs and the catchlight strengthens with elevation.
3. **Light and dark share every recipe's geometry; only the colours change.**
   - Light: the catchlight and rim are transparent, and the drops are Vitesse ink at 6–10%.
   - Dark: the catchlight is Vitesse light at 6–9%, the edge is black at 55%, and the drops are black at 22–34%.
4. Pressed and popup-open controls lose their drop and gain an inset top shade.
5. Lists stay flat. Only the selected item is raised.

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

### Recipes (`shadow-*`)

| Utility          | Layers                                          | Pair with                      |
| ---------------- | ----------------------------------------------- | ------------------------------ |
| `shadow-panel`   | catchlight, rim, edge, two soft drops           | `bg-surface-panel`             |
| `shadow-control` | catchlight, rim, edge, tight drop, soft drop    | `bg-surface-control`           |
| `shadow-overlay` | strong catchlight, rim, edge, `2/8/16px` drops  | `bg-surface-overlay` / `-top`  |
| `shadow-modal`   | strong catchlight, rim, edge, `4/16/32px` drops | `bg-surface-modal`             |
| `shadow-fill`    | white gloss, dark fill edge, tight drop         | `bg-primary`, status fills     |
| `shadow-knob`    | strong catchlight, edge, two drops              | switch and slider thumbs       |
| `shadow-pressed` | inset top shade, edge                           | pressed and open controls      |
| `shadow-edge`    | edge only                                       | disabled and flat framed parts |
| `shadow-well`    | inset top shade, inset rim                      | `bg-surface-well`              |
| `shadow-tint`    | `currentColor` at 18%                           | soft badges and alerts         |

State layers:

- `tint-hover` and `tint-press` paint a Vitesse-ink (light) or Vitesse-light (dark) tint over the element's own background, so one class works on every surface and fill.
- They replace the per-variant `hover:bg-*/80` values.

### Why it is built this way

- **Recolourable per element.**
  - Only primitive colours live on `:root`/`.dark`; the recipes are `@theme inline` shadows, so every `var()` resolves on the element that uses it.
  - One override recolours any surface: `aria-invalid:[--surface-edge:var(--destructive)]` is the whole invalid state, and `shadow-tint` follows the text colour.
  - Foglamp's 14 copied shadows become one rule.
- **Focus rings compose.**
  - The recipes write `--tw-shadow` and focus uses `ring-*`, so the two stack without either erasing the other.
  - The hairline must never use `ring-*`. Today's `ring-1 ring-foreground/10` on cards and popups is erased by a focus ring.
- **Merge-safe.**
  - `lib/utils.ts` builds `cn` with `createCn` and registers the recipe names as shadows.
  - `cn("shadow-control", "shadow-pressed")` and `cn("shadow-control", "shadow-none")` resolve to the last class; without registration, `cn` treated them as shadow colours and kept both.
- **Paired classes, not one magic class.** `bg-surface-control shadow-control` stays two ordinary utilities, so either half can be overridden with normal Tailwind and `cn` semantics.
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
| flat                    | menu, select, command and sidebar items, table rows, ghost and link `button`, `breadcrumb`; hover uses `tint-hover` only                                                                                                                                                                                                   |

### States

| State                                           | Classes                                                                                                           |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| hover                                           | `hover:tint-hover`                                                                                                |
| pressed (`active`, `data-pressed` on buttons)   | `active:tint-press active:shadow-pressed` + existing `translate-y-px`; not when `data-disabled` / `data-readonly` |
| open (`aria-expanded`, `data-popup-open`)       | `shadow-pressed`                                                                                                  |
| selected (`data-pressed` toggle, `data-active`) | flat → `bg-surface-control shadow-control`                                                                        |
| focus-visible                                   | unchanged `ring-3 ring-ring/50`                                                                                   |
| invalid                                         | `aria-invalid:[--surface-edge:var(--destructive)]`                                                                |
| disabled                                        | `shadow-edge` + existing `opacity-50`; a disabled control must not look pressable                                 |

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
  - [x] `surfaces.css`: colours, recipes, `tint-hover`, `tint-press`.
  - [x] `cn` recipe registration.
  - [x] `Foundations/Surfaces` story (Ladder, Roles, Nesting, States) in both themes.
  - [x] Review the Roles story in both themes and settle the base values (the edge alpha, the dark catchlight, the ladder steps) before any component moves.
- [x] **Phase 1: palette.** Remap `theme.css` onto faded Vitesse and the surface ladder, then review every existing story at once. Colours only; no component classes change.
  - [x] `--background: var(--surface-canvas)`, `--card: var(--surface-panel)`, `--popover: var(--surface-overlay)`.
  - [x] Light:
    - `--foreground #393a34`;
    - `--muted-foreground #6a737d`;
    - `--primary #1c6b48` / `#ffffff`;
    - `--destructive #ab5959`;
    - `--success #1e754f`;
    - `--warning #a65e2b`;
    - `--info #296aa3`;
    - `--ring` from the primary.
  - [x] Dark:
    - `--destructive #cb7676` (Vitesse error, replacing `#f97583`);
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

- **Children covering the catchlight.** An inset highlight paints under child backgrounds, so card media or a filled header at the very top hides it. Those surfaces use Coss's `before:` pseudo-element for the catchlight instead; decide per component during migration.
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

- `input-otp` slots and `button-group` items are attached edge to edge, so neighbouring hairlines overlap at the seams; they read as a single divider, so no override is needed.
- The `command` search field and the search field inside the `combobox` popup stay flat (translucent, no shadow): a raised field inside an overlay competes with the overlay itself.
- `kbd` inside a tooltip drops its shadow, because the tooltip is an inverse surface.
