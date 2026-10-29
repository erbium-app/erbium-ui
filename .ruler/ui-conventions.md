# UI conventions

- `packages/ui` is the source of truth for reusable components and styles.
- Follow the existing shadcn component patterns and preserve RTL support.
- Keep application-specific composition in `apps/`; do not duplicate shared primitives there.

# Font smoothing

- `html` opts into `antialiased` in `packages/ui/src/styles/base.css`; do not repeat the utility on individual components.
- macOS renders light text on dark surfaces heavier by default, so global grayscale antialiasing keeps type at its designed weight in dark themes.
- Opt a light surface back into the browser default with `subpixel-antialiased` when it sits inside a dark shell (see `.showcase-content.light`), because dark-on-light text relies on the thicker default rendering.
- Avoid body text at weight 300 or below on dark surfaces; grayscale antialiasing renders it lighter than designed, especially on 1x displays.

# Gradients

- Use eased stops for any gradient that fades to transparent so the fade has no hard edge.
- For background gradients, add `gradient-ease-in-out` (from the `easing-gradients` plugin) to `bg-linear-*` with `from-*` and `to-*`, e.g. `bg-linear-to-b from-background to-transparent gradient-ease-in-out`.
- The plugin only eases `background-image` stops. For masks and custom gradients, write the eased stops by hand.
