---
title: "TanStack Form"
description: "Gate steps on field validation."
---

Keep the step in React state and the values in TanStack Form.

- **Mount every field.** `form.validateField` only finds validators on mounted fields, so an unmounted step would pass validation unchecked. Render all steps and hide the inactive ones.
- **Validate only what the user passes.** `goTo` validates each step on the way forward, which also marks it touched, and stops at the first invalid one. Steps ahead are never validated, so they never show an error before the user reaches them.
- **Gate errors on `isTouched`.** Both the step's `invalid` and the field's error use `isTouched && !isValid`.
- **Submit validates everything.** `onSubmitInvalid` sends the user to the first failing step.
- Going back is always free.
