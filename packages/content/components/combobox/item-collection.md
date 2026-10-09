---
title: "Item collection"
description: "Keep selection values as stable IDs while rendering complete objects."
---

The displayed project is an object; the selected value is its stable ID. Filter by the project name and choose a result. The trigger retains its label after the popup unmounts. Create static collections outside the component; memoize a collection when its source data changes. Use `value={project.id}` on each item, not the whole object.
