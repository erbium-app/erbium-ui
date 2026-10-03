---
title: "Bubble"
description: "Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content."
---

Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.

**Import:** `@erbium/ui/components/bubble`

## Usage

```tsx
import { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";
```

```tsx
<Bubble>
  <BubbleContent>I checked the registry output and removed the stale route.</BubbleContent>
  <BubbleReactions>
    <span>👍</span>
  </BubbleReactions>
</Bubble>
```

## Composition

Use the following composition to build a bubble:

Use `BubbleGroup` to group consecutive bubbles from the same sender:

```text
Bubble
├── BubbleContent
└── BubbleReactions
```

```text
BubbleGroup
├── Bubble
│   └── BubbleContent
└── Bubble
    └── BubbleContent
```

## Features

- Seven visual variants, from a strong primary bubble to unframed ghost content

- Start and end alignment for sender and receiver bubbles

- Reactions that anchor to the bubble edge with configurable side and alignment

- Bubbles size to their content, up to 80% of the container width

- Polymorphic content via `render` for link and button bubbles

- Customizable styling through the `className` prop on every part

## Accessibility

`Bubble` renders the presentational message surface. Keep conversation-level semantics on the surrounding container and follow the guidelines below.

Reactions render as a row of emoji. A screen reader reads each glyph with no context, and counters like `+8` are announced as "plus eight". Group the row as a single image with a descriptive `aria-label` so it announces once. `role="img"` also hides the individual emoji from assistive tech, so no `aria-hidden` is needed.

When reactions are interactive, render buttons instead and give icon-only buttons an `aria-label`.

When a bubble is clickable, render it as a real `<button>` or `<a>` with the `render` prop so it is focusable and exposes the correct role. `BubbleContent` ships a visible focus ring for interactive elements, and the accessible name comes from the bubble text. No extra label is needed.

Bubble variants signal role and tone with color. Pair them with text, alignment, or icons so meaning is not conveyed by color alone. For a `error` bubble, keep the error context in the message text rather than relying on the color treatment.

```tsx
<BubbleReactions role="img" aria-label="Reactions: thumbs up, fire, and 8 more">
  <span>👍</span>
  <span>🔥</span>
  <span>+8</span>
</BubbleReactions>
```

```tsx
<BubbleReactions>
  <Button aria-label="Thumbs up" variant="secondary" size="icon-xs">
    <ThumbsUpIcon />
  </Button>
</BubbleReactions>
```

```tsx
<Bubble variant="muted" align="end">
  <BubbleContent render={<button type="button" onClick={onReply} />}>
    I forgot my password
  </BubbleContent>
</Bubble>
```
