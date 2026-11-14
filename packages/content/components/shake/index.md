---
title: "Shake"
description: "Shake an element to signal an error."
---

## Usage

Replays error feedback on an element without changing its validation state. The animation respects the reduced motion preference and RTL direction.

Import `shake` from `@erbium/ui/lib/shake` and call it with an element ref. Calling it again on the same element restarts the animation instead of stacking a second one.

Inside a TanStack Form you do not call `shake` yourself: `field.Field` and every bound field shake on a rejected submit. See [Form](/docs/components/form). Call it directly for feedback outside a form, such as a failed action on a single control.
