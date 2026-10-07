---
title: "Status"
story: Status
---

Pass TanStack Form's `field.state.meta` as `validation`. `isValidating` gently pulses
the normal field surfaces and shimmers the digits. A touched invalid value shows an
error. Success appears only when the current complete value matches `verifiedValue`,
which the demo sets after verification finishes.

Validation keeps editing enabled. This demo uses `onChangeAsync` to check every complete
changed code, including corrections made while a previous check is pending. Demo code: 123456.

Incomplete values clear verification feedback without checking the code. Verification
starts only when all six digits are present. The simulated check takes 1.5 seconds so
its loading treatment is visible in Storybook and the docs playground.
