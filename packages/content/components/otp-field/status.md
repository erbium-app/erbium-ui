---
title: "Status"
story: Status
---

`status` is `idle`, `loading`, `success` or `error`. `loading` and `success` lock the field with `readOnly` rather than `disabled`, so it keeps focus and its value. `error` shakes the field. Nothing renders outside the slots, so the layout never shifts.
