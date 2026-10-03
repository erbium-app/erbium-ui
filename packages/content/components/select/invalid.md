---
title: "Invalid"
story: Invalid
---

Add the `invalid` prop to the `Field` component; the `SelectTrigger` picks up `aria-invalid` automatically.

```tsx
<Field invalid>
  <FieldLabel>Fruit</FieldLabel>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
</Field>
```
