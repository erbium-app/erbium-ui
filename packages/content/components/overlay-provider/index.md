---
title: "Overlay Provider"
description: "Coordinates drawers and page indentation. Wrap your React app in OverlayProvider once so drawers can share their overlay state."
---

Coordinates drawers and page indentation. Wrap your React app in `OverlayProvider` once so drawers can share their overlay state.

```tsx
import { OverlayProvider } from "@erbium/ui/components/overlay-provider";

<OverlayProvider>{children}</OverlayProvider>;
```
