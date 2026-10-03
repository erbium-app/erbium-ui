---
title: "Radio Group"
description: "Choose one option from a group."
---

## Usage

Use checkable radio buttons when at most one option can be selected.

**Import:** `@erbium/ui/components/radio-group`

## Usage

```tsx
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
```

```tsx
<RadioGroup defaultValue="option-one">
  <Field orientation="horizontal">
    <RadioGroupItem value="option-one" id="option-one" />
    <FieldLabel htmlFor="option-one">Option One</FieldLabel>
  </Field>
  <Field orientation="horizontal">
    <RadioGroupItem value="option-two" id="option-two" />
    <FieldLabel htmlFor="option-two">Option Two</FieldLabel>
  </Field>
</RadioGroup>
```

## Composition

Use the following composition to build a `RadioGroup`:

```text
RadioGroup
├── RadioGroupItem
└── RadioGroupItem
```
