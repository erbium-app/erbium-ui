---
title: "Logarithmic"
story: Logarithmic
---

Use `scale="log"` when a range spans orders of magnitude, such as frequencies, zoom levels or prices. Equal distances along the track cover equal ratios, so 20 Hz to 200 Hz takes the same width as 2 kHz to 20 kHz. A log scale needs `min` above zero and falls back to linear otherwise. Arrow keys move 1% of the track (10% with Shift), rounded onto `step` and always by at least one step. Without a `step`, values keep four significant digits. This example also shows `onValueChange` for the live value and `onValueCommitted` for the value once the drag or key press ends.
