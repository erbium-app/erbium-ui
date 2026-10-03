---
title: "Message"
description: "Displays a message in a conversation, with optional avatar, header, footer, and alignment."
---

Displays a message in a conversation, with optional avatar, header, footer, and alignment.

**Import:** `@erbium/ui/components/message`

## Usage

**Note:** `Message` owns the row layout—avatar, alignment, header, and footer.

Render the visible message surface inside it with

[`Bubble`](https://ui.shadcn.com/docs/components/bubble). For the scroll container around a

conversation, use [`MessageScroller`](https://ui.shadcn.com/docs/components/message-scroller).

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
        src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23475569%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2233%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22white%22%3EJD%3C%2Ftext%3E%3C%2Fsvg%3E"
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

For in-progress messages, use a [`Marker`](https://ui.shadcn.com/docs/components/marker) with `role="status"` so assistive tech announces the update as it appears.

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
