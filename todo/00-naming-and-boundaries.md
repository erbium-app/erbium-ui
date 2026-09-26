# 00 — Naming and boundaries

Before adding components, agree on the public names and avoid having two names for the same primitive.

## Naming rules

- Prefer the established shadcn name when a concept is shared with shadcn.
- Use Coss names when Coss introduces a genuinely distinct primitive.
- Keep compatibility aliases only when migration cost justifies them; document every alias.
- Use kebab-case filenames and PascalCase exports.
- Keep primitive behavior generic. Do not put product workflows, data fetching, or domain state in `packages/ui`.

## Existing names to reconcile

| Coss concept     | Current Erbium name           | Decision to make                                                                                                                                         |
| ---------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fieldset`       | `FieldSet` inside `field.tsx` | Expose a first-class `fieldset.tsx`; preserve the existing exports temporarily if needed.                                                                |
| `otp-field`      | `input-otp`                   | Keep `input-otp` as the shadcn-compatible public name; decide whether `otp-field` is an alias.                                                           |
| `preview-card`   | `hover-card`                  | Keep `hover-card` for shadcn compatibility; document it as the preview-card primitive.                                                                   |
| `menu`           | `dropdown-menu`, `menubar`    | Define whether these remain specialized wrappers over a shared menu foundation.                                                                          |
| `navigation`     | `navigation-menu`             | Keep `navigation-menu` for the shadcn name; map Coss navigation particles to it or add a separate generic navigation primitive only if semantics differ. |
| `date-picker`    | `calendar`                    | Treat date picker as a composition of calendar plus a popup/input, not as a replacement for calendar.                                                    |
| `checkbox-group` | field composition only        | Add a real group primitive with group-level value, validation, and orientation behavior.                                                                 |

## Erbium-only components

Review these deliberately rather than removing them because Coss does not list them: `aspect-ratio`, `attachment`, `bubble`, `button-group`, `carousel`, `chart`, `direction`, `item`, `marker`, `message`, `message-scroller`, `questionnaire`, and `resizable`.

`native-select` was removed from the component inventory; use the public `select` component for select menus and native HTML `<select>` where native platform behavior is desired.

For each one:

- confirm it is generic enough for the foundation;
- confirm its name and API do not conflict with a shadcn or Base UI concept;
- mark it as core, optional, or candidate for a dedicated package;
- add a registry example and accessibility test if it remains core.

## Package boundaries

Keep these out of the foundation unless they are reduced to generic primitives:

- rich text and code editors;
- full command-palette products;
- data-grid implementations with server state;
- chat or messaging workflows;
- upload managers and media browsers;
- domain-specific settings, billing, auth, and dashboard blocks.
