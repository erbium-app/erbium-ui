---
title: "Snap Points"
story: SnapPoints
---

Use `snapPoints` to snap a drawer to preset heights. Numbers between `0` and `1` represent fractions of the viewport. Numbers greater than `1` are treated as pixel values. String values support `px` and `rem` units. Snap points apply to vertical drawers.

Track the active snap point with the controlled `snapPoint` and `onSnapPointChange` props. At the full snap point, the drawer gets a `data-expanded` attribute you can style with the `data-expanded:` variant.
