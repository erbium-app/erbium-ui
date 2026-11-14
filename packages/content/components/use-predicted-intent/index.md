---
title: "Use Predicted Intent"
description: "Start work when the user is about to interact with an element."
---

## Usage

`usePredictedIntent` calls a function when the user is about to interact with an element. Use it to start work a click would otherwise wait for: loading a dialog's data, a lazy component, or a large image.

**Import:** `@erbium/ui/hooks/use-predicted-intent`

```tsx
import { usePredictedIntent } from "@erbium/ui/hooks/use-predicted-intent";

const intentRef = usePredictedIntent(() => {
  void queryClient.prefetchQuery(reportQuery(reportId));
});

<DialogTrigger ref={intentRef} render={<Button>Open report</Button>} />;
```

For links between routes, use `Link` from `@erbium/ui/components/link`, which builds on this hook and preloads the route's loaders.

## When it fires

Prediction comes from [ForesightJS](https://foresightjs.com). The function runs when:

- The cursor's path points at the element.
- The element is one or two tab stops ahead of the focused element.
- Scrolling is bringing the element under the cursor.
- A finger touches the element.

Prediction stays off on slow connections and when the browser asks to save data, so the function must never be required for the interaction to work. Start the same work in the interaction itself; a request that is already running or cached costs nothing.

## Options

```tsx
usePredictedIntent(onIntent, {
  enabled: true,
  hitSlop: 8,
  name: "report-dialog",
  reactivateAfter: 30_000,
});
```

- `enabled` keeps the element registered but stops it firing, for example while it is disabled.
- `hitSlop` widens the area that counts as a hit, in pixels or per side.
- `name` labels the element in Foresight's development tools.
- `reactivateAfter` is the time in milliseconds before the element can fire again. It fires once by default; set it to how long the work it starts stays fresh.

The latest function and options are read when prediction fires, so neither needs to be memoized.

## Refs

The hook returns a callback ref. To combine it with a ref of your own, merge them with `useMergedRefs` from `@base-ui/utils/useMergedRefs`, the same helper the library's components use.

Foresight's state attributes (`data-active`, `data-predicted`, `data-status`) stay off, because Base UI parts style themselves with the same names.
