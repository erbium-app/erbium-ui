---
title: "Spinner"
description: "A loading indicator for ongoing activity."
---

**Import:** `@erbium/ui/components/spinner`

## Usage

```tsx
import { Spinner } from "@erbium/ui/components/spinner";
```

```tsx
<Spinner />
```

## Loading

Prefer a [Skeleton](/docs/components/skeleton) for content whose shape is known, and keep already-known content visible while it is enhanced. Use a [Logo Loader](/docs/components/logo-loader) for broader waits without a content layout, such as navigation or workspace preparation. Use a spinner for localized activity, especially a pending action or status; an empty state represents the absence of results, not loading.

Use standalone `Spinner` for independent loading indicators. Use `Button loading`, `Badge loading`, or `InputGroup loading` inside controls so the component owns placement and sizing. `StatefulButton` centers its spinner while replacing the label.

Spinners beside labels belong at the inline start: left in LTR and right in RTL. Inherit `dir` from the page or set it on a containing element. Loading APIs do not expose a spinner alignment option.
