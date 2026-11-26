---
title: "TanStack Form"
description: "Validate each step with its own slice of one schema."
---

One Effect Schema describes the whole form. Each step is a `form.FormGroup` named after the step, with its slice of the schema, inside a `StepperForm`.

- **Next and Enter submit the step's group.** Its fields are touched and validated, invalid ones shake, and the first takes focus.
- **An untouched optional step is skipped**, not completed.
- **Editing a completed answer reopens the step** and every later one.
- **The final submit runs the whole schema, then the server.** `createStepperFormFinish` returns to the first step with errors. Here a taken email comes back from the server and lands on its field.
