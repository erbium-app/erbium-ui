---
title: "Custom Items"
story: CustomItems
---

Use `itemToStringValue` when your items are objects.

```tsx
import * as React from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@erbium/ui/components/combobox";

type Framework = {
  label: string;
  value: string;
};

const frameworks: Framework[] = [
  { label: "TanStack Start", value: "tanstack-start" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt", value: "nuxt" },
];

export function ExampleComboboxCustomItems() {
  return (
    <Combobox items={frameworks} itemToStringValue={(framework) => framework.label}>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(framework) => (
            <ComboboxItem key={framework.value} value={framework}>
              {framework.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
```

You can render a custom component inside `ComboboxItem`.
