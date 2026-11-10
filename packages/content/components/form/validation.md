---
title: "Validation"
story: Validation
---

One Effect Schema validates a contact form: a trimmed name, an email pattern, a minimum message length, and a terms checkbox that must be checked. Submit the empty form to see the messages, then fix a value to clear its error as you type. The terms checkbox shows no message: it turns invalid and shakes with its label, and screen readers still announce the schema's message.

Each `form.AppField` renders a bound field: `TextField`, `TextareaField`, `SwitchField`, and `CheckboxField`. The description is removed while the field is invalid and returns when validation clears, so helper information and errors never appear together. `onSubmit` decodes the values with the same schema to get the trimmed name.
