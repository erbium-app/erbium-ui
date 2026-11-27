---
title: "Message"
description: "A conversation message with supporting details."
---

## Usage

Add an optional avatar, header, footer, and alignment to a conversation message.

**Import:** `@erbium/ui/components/message`

## Usage

**Note:** `Message` owns the row layout—avatar, alignment, header, and footer.

Render the visible message surface inside it with

[`Bubble`](/docs/components/bubble). For the scroll container around a

conversation, use [`MessageScroller`](/docs/components/message-scroller).

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Message, MessageAvatar, MessageContent } from "@erbium/ui/components/message";
```

```tsx
<Message>
  <MessageAvatar>
    <Avatar>
      <AvatarImage
        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  </MessageAvatar>
  <MessageContent>
    <Bubble>
      <BubbleContent>How can I help you today?</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
```

## Composition

Use the following composition to build a message:

Use `MessageGroup` to stack consecutive messages from the same sender:

```text
Message
├── MessageAvatar
└── MessageContent
    ├── MessageHeader
    ├── Bubble
    └── MessageFooter
```

```text
MessageGroup
├── Message
└── Message
```

## Features

- Start and end alignment for sender and receiver rows via the `align` prop

- Avatar slot that anchors to the bottom of the message and stays clear of the footer

- Header and footer slots for sender names, status, and message actions

- Footer follows the message side; actions stay aligned on `align="end"` rows

- Group wrapper for stacking consecutive messages from the same sender

- Customizable styling through the `className` prop on every part

## Accessibility

`Message` is a presentational layout wrapper. Accessibility comes from the content you place inside it.

Action buttons in `MessageFooter` are usually icon-only, so give each one an `aria-label`.

For in-progress messages, use a [`Marker`](/docs/components/marker) with `role="status"` so assistive tech announces the update as it appears.

```tsx
<MessageFooter>
  <Button variant="ghost" size="icon" aria-label="Copy">
    <CopyIcon />
  </Button>
</MessageFooter>
```

```tsx
<Message>
  <Marker role="status">
    <MarkerIcon>
      <Spinner />
    </MarkerIcon>
    <MarkerContent>Checking the logs...</MarkerContent>
  </Marker>
</Message>
```
