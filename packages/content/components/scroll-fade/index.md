---
title: Scroll Fade
description: "Fades scroll edges to hint at more content."
---

CSS utilities that fade the edges of overflowing content and follow the scroll position.

## Install

The utilities are included in Erbium's global stylesheet. Import it once in your app:

```css
@import "@erbium/ui/globals.css";
```

## Use

Apply `scroll-fade` to the element that owns vertical overflow, or `scroll-fade-x` to a horizontal scroller.

```tsx
<div className="scroll-fade h-48 overflow-y-auto">{/* scrollable content */}</div>
```

The fade dissolves the content through a CSS mask, so it works over any background. It tracks the scroll position with CSS scroll-driven animations and falls back to a static fade in browsers without support.

## Utilities

| Class                                     | Effect                                                        |
| ----------------------------------------- | ------------------------------------------------------------- |
| `scroll-fade`, `scroll-fade-y`            | Top and bottom edges of a vertical scroller                   |
| `scroll-fade-x`                           | Start and end edges of a horizontal scroller, mirrored in RTL |
| `scroll-fade-t/b/l/r`                     | One physical edge                                             |
| `scroll-fade-s/e`                         | One logical inline edge, mirrored in RTL                      |
| `scroll-fade-6`, `scroll-fade-[15%]`      | Set the fade depth                                            |
| `scroll-fade-b-8`, `scroll-fade-t-[2rem]` | Set an individual edge depth                                  |
| `scroll-fade-none`                        | Remove the mask, including at responsive breakpoints          |

Fade depth defaults to 12% of the container, capped at 40px. Set `[--scroll-fade-reveal:64px]` to change how far the scroller travels while a fade appears or disappears. Put card backgrounds and borders on a wrapper, with the fade class on the inner scroller.
