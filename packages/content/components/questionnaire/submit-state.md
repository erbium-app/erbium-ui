---
title: "Submit State"
story: SubmitState
---

`QuestionnaireSubmit` is a Stateful Button. Own the request in `onSubmit` and pass `state` (`idle`, `loading`, `success`) with `onStateChange`; the button shows the spinner and success label, blocks repeat submits, and resets after `successDuration`. Omit `state` and it behaves like a normal button.

align="end"
