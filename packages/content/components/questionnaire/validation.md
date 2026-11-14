---
title: "Custom Validation"
story: Validation
---

Validate the answers with an Effect Schema, including a rule that spans items. `useQuestionnaireForm` and `QuestionnaireForm` from `@erbium/ui/components/questionnaire` keep the answers in TanStack Form: each `form.AppField` wraps a `field.QuestionnaireItem`, and its `field.QuestionnaireChoice` elements are controlled by the field value. Each answer is checked against the schema before the questionnaire moves past it, so an error shows on the question that caused it rather than only at the end. A rejected submit returns to the first item, in `items` order, that has an error, and `field.QuestionnaireError` shows the schema's message. Changing the answer revalidates it and clears the error. The answers of the item it returns to shake, as a field's control does after a rejected form submit.
