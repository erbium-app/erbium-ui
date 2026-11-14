---
title: "Skeleton"
description: "A loading state measured from the content it stands in for, revealed without moving anything."
---

`Skeleton` wraps what you render once the data arrives. While it loads, the content is rendered from sample data and laid out unseen, then drawn as one bar for each line of text and one block for each image, control and chip. The skeleton has the content's exact size, so the reveal moves nothing on the page. Erbium's skeletons are built on [Skullet](https://skullet.lochie.me).

**Import:** `@erbium/ui/components/skeleton`

## When to show a skeleton

Show one only for content that is not known yet. Content you already have renders at once: code blocks, file views and diffs show the plain source while highlighting runs and recolour in place, and trees keep their size while they mount. If the content is in hand, render it; do not put a loading state in front of it.

## Usage

Pass the data, which is loading while it is `null` or `undefined`, and a `sample` of the same shape. The sample only needs representative lengths; its text is never shown.

```tsx
import { Skeleton } from "@erbium/ui/components/skeleton";

<Skeleton data={user} sample={SAMPLE_USER} label="Loading profile">
  {(user) => <ProfileCard user={user} />}
</Skeleton>;
```

Pass `loading` to show the skeleton over data that is already on screen, as during a refetch. The skeleton is then drawn from that data and matches it exactly.

```tsx
<Skeleton data={query.data} sample={SAMPLE_USER} loading={query.isFetching}>
  {(user) => <ProfileCard user={user} />}
</Skeleton>
```

With `use(promise)` or a suspending query, use `SkeletonSuspense` with the component rendered from the sample as its `skeleton`:

```tsx
<SkeletonSuspense skeleton={<ProfileCard user={SAMPLE_USER} />} label="Loading profile">
  <LoadedProfile />
</SkeletonSuspense>
```

## Provider

Mount `SkeletonProvider`, exported from the same module, once at the app root inside any CSP or theme providers:

```tsx
import { SkeletonProvider } from "@erbium/ui/components/skeleton";

<SkeletonProvider nonce={nonce}>
  <App />
</SkeletonProvider>;
```

On the server, render it per request. Once per page it sends the small scripts that measure server-rendered skeletons and give them Erbium's corners before the first paint, and it sets the request's `nonce` on them and on the skeleton stylesheet.

- `reveal`: how content replaces its skeleton. `smart` (default) shows fast loads at once, crossfades refetches, reveals small content whole and larger content row by row. `together` crossfades the whole region, `sequence` brings each piece in where its skeleton was, and `sweep` carries the content in behind one diagonal front.
- `nonce`: set on the inline scripts and stylesheet, for a Content Security Policy.
- `debug`: outlines every skeleton with where its shape came from and whether the reveal moved anything. Adding `?skullet-debug` to the URL does the same without a code change.

## How skeletons are drawn

The shape comes from the best source available, in this order:

1. The data on screen, when `loading` is set over it.
2. The data last shown under the same `id`, so a reload is exact.
3. The shape remembered from a previous visit under that `id`. Remembered shapes keep layout, never content.
4. The `sample`.
5. Plain children, rendered as they are.

Erbium's primitives tell the skeleton how to draw themselves. Buttons, badges, keyboard keys, switches, checkboxes, radios, selects, toggles, sliders, progress and meter tracks and avatars draw as one block in their own shape. Spinners draw nothing. Known content such as table headers stays readable. Inputs, images and icons draw as blocks. Compositions of these primitives therefore load consistently without extra markup.

## Reveal

`smart`, the default, decides for each reveal as it lands:

- Loads under 150 ms show no skeleton at all, and someone mid-scroll or mid-typing gets the content at once.
- A refetch gets a quick crossfade, and small content is revealed whole.
- Anything larger comes in row by row in reading order.

The provider can set `together`, `sequence` or `sweep` instead. Everything holds still under reduced motion.

## States

`error` replaces the skeleton with an error. Pass an `Error` to render the error alert with its message, or pass any node. `empty` with `emptyMessage` shows an [Empty](/docs/components/empty) state instead of the content. Both use the same crossfade as content.

## Accessibility

A loading region is `aria-busy`, and its skeleton is hidden from assistive technology and inert. Pass `label` so screen readers hear what is loading, such as "Loading profile". Query tests by role, since the sample's text sits inside the hidden skeleton.

## Box

Without content, `Skeleton` is a box you size with classes: `<Skeleton className="h-4 w-48" />`. Use it only when there is nothing to render a sample from. It shares the page's shimmer with measured skeletons. The `skeleton` utility class remains for markup that cannot use the component.
