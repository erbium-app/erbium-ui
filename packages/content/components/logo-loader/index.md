---
title: "Logo Loader"
description: "The Erbium mark as a loading indicator, with start, loop and resolve phases."
---

`LogoLoader` is the Erbium mark that builds itself while work is in flight. It is for waits that have no layout to stand in for: navigating between routes, preparing a workspace, generating a file. Content with a known shape loads behind a [Skeleton](/docs/components/skeleton) instead. For localized actions or status, use a [Spinner](/docs/components/spinner), including the loading APIs on controls.

**Import:** `@erbium/ui/components/logo-loader`

## Usage

Control it with `loading`. The mark plays three phases:

- **Start:** the steps lower into a flat slab and rise again, gathering speed.
- **Loop:** the steps ride up like an escalator. The top step leaves through the logo's top edge as a new one lifts out of the floor.
- **Resolve:** when `loading` turns false, the escalator finishes its step and comes to rest as the logo, then calls `onResolved`.

```tsx
import { LogoLoader } from "@erbium/ui/components/logo-loader";

<LogoLoader loading={isPending} label="Loading" />;
```

Set `delay` to ignore work that finishes quickly: the loader starts only after `loading` has stayed true for that many milliseconds. A loader mounted while `loading` is already true starts from the flat slab and rises straight away.

Without `label` the mark is decorative and hidden from assistive technology. With `label` it is announced as an image and carries `aria-busy` while loading. When reduced motion is requested the mark stays still.

## TanStack Router

`useRouterPending` is true while the router resolves a navigation: matching, `beforeLoad`, loaders and lazy route chunks. Preloads do not count.

```tsx
import { LogoLoader } from "@erbium/ui/components/logo-loader";
import { useRouterPending } from "@erbium/ui/hooks/use-router-pending";

const NavigationIndicator = () => {
  const navigating = useRouterPending();

  return <LogoLoader loading={navigating} delay={150} label="Loading page" />;
};
```

Render it in a layout that stays mounted across navigations, such as the app header. A route's own `pendingComponent` can render a `LogoLoader` with `loading` set, which rises from the flat slab as the pending state appears.

## TanStack Query

Pass any query or mutation flag. `useIsFetching` and `useIsMutating` cover every request in the client:

```tsx
import { useIsFetching } from "@tanstack/react-query";

const fetching = useIsFetching() > 0;

<LogoLoader loading={fetching} delay={200} />;
```

## Replay

Call `replay()` on the ref to play the lowering and rise once, for example when the pointer enters the logo. It is ignored while the loader is running.

```tsx
const logo = useRef<LogoLoaderHandle>(null);

<a href="/" onPointerEnter={() => logo.current?.replay()}>
  <LogoLoader ref={logo} />
</a>;
```
