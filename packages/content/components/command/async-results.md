---
title: "Async results"
description: "Highlight arriving results and preview the current command."
---

The story simulates a delayed request locally. Change the query quickly, then use arrow keys and Enter after results arrive. Previous requests are cancelled; stale results are withheld while searching. Automatic highlighting applies to arriving results, and `onItemHighlighted` drives the contextual preview. A real remote search should cancel its request and use `filter={null}` when the server has already filtered the results.
