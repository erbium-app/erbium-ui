---
title: "Step Indicator"
story: Progress
---

Use `QuestionnaireStepIndicator` to show position with dots driven by the questionnaire state. Each step already shown is a button that returns to it; later steps open as the questionnaire reaches them, so the dots never skip an unanswered question. Pass `onValueChange` and `reach` only when the host decides navigation itself. The Progress primitive remains available for fully custom indicators.
