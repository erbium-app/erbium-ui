---
title: "As Link"
story: AsLink
---

Give `Button` TanStack Router's link options to make a link that looks like a button. `to` names a route, typed against your routes, which preloads before the click; `href` takes a fully built or external URL. The link keeps its link role, and `hotkey` still works.

**Do not use `<Button render={<a />} nativeButton={false} />` for links.** The Base UI `Button` component always applies `role="button"`, which overrides the semantic link role on `<a>` elements.

```tsx
import { Button } from "@erbium/ui/components/button";

<Button to="/projects">Projects</Button>;
<Button href="https://github.com/erbium" variant="outline">
  GitHub
</Button>;
```
