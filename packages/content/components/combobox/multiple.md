---
title: "Multiple Selection"
story: Multiple
---

Use `multiple` with chips for multi-select behavior.

```tsx
import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@erbium/ui/components/combobox";

const frameworks = ["TanStack Start", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export function ExampleComboboxMultiple() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <Combobox items={frameworks} multiple value={value} onValueChange={setValue}>
      <ComboboxChips>
        <ComboboxValue>
          {value.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Add framework" />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
```

A combobox with multiple selection using `multiple` and `ComboboxChips`.
