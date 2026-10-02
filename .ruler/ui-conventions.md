# UI conventions

- `packages/ui` is the source of truth for reusable components and styles.
- Follow the existing shadcn component patterns and preserve RTL support.
- Keep application-specific composition in `apps/`; do not duplicate shared primitives there.

# Gradients

- Use eased stops for any gradient that fades to transparent so the fade has no hard edge.
- For background gradients, add `gradient-ease-in-out` (from the `easing-gradients` plugin) to `bg-linear-*` with `from-*` and `to-*`, e.g. `bg-linear-to-b from-background to-transparent gradient-ease-in-out`.
- The plugin only eases `background-image` stops. For masks and custom gradients, write the eased stops by hand.
