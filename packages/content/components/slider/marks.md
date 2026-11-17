---
title: "Marks"
story: Marks
---

Pass `marks` to draw ticks along the track. An array of `{ value, label }` places each tick, and ticks with a `label` print it under the track (beside it when vertical). `marks` set to `true` derives the ticks from the slider: each allowed value with `steps`, each step when the `step` grid has ten intervals or fewer, or each power of ten on a log scale. Ticks inside the selected range switch colour. Marks are decorative, so they are hidden from assistive technology; the thumb's value text carries the value.
