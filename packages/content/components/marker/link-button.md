---
title: "Links and Buttons"
story: LinkButton
---

Turn a marker into a link or button with the `render` prop on `Marker`.

```tsx
import { Marker, MarkerContent } from "@erbium/ui/components/marker";

export function MarkerLinkDemo() {
  return (
    <Marker render={<a href="#" />}>
      <MarkerContent>View the pull request</MarkerContent>
    </Marker>
  );
}
```
