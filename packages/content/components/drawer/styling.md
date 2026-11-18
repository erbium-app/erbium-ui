---
title: "Styling"
story: Styling
---

The drawer exposes CSS variables for style-level customization. Set the sizing variables on `DrawerPanel`. Set the overlay variable on `[data-slot=drawer-overlay]` in your CSS.

| Variable                       | Default                      | Description                                                             |
| ------------------------------ | ---------------------------- | ----------------------------------------------------------------------- |
| `--drawer-inset`               | `0px`                        | Floats the drawer from the viewport edges.                              |
| `--drawer-bleed-background`    | `var(--color-surface-modal)` | Fills the gap behind the drawer on swipe overshoot.                     |
| `--drawer-overlay-min-opacity` | `0`                          | Minimum overlay opacity. Defaults to `0.5` when snap points are active. |

The drawer also sets data attributes you can target with variants such as `data-swiping:` on `DrawerPanel`, or `group-data-swiping/drawer-popup:` on its descendants.

| Attribute                 | Values  | Set when                              |
| ------------------------- | ------- | ------------------------------------- |
| `data-snap-points`        | Present | The drawer has snap points.           |
| `data-expanded`           | Present | The drawer is at the full snap point. |
| `data-swiping`            | Present | A swipe is in progress.               |
| `data-nested-drawer-open` | Present | A nested drawer is open on top.       |
