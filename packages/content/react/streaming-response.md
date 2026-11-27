---
title: "Streaming Response"
description: "A hook that reads a streamed reply into text and status, and the functions behind it."
---

`useTextStream` collects a model's reply as it streams in. It owns the request's lifecycle: waiting, streaming, stopping, failing and replacing one reply with the next. It renders nothing, so show the Markdown with any renderer.

Use [styled Streaming Response](/docs/blocks/streaming-response) for Markdown, highlighted code and ready-made states.

**Import:** `@erbium-ui/react/streaming-response`

## Anatomy

```tsx
import { useTextStream } from "@erbium-ui/react/streaming-response";

const { text, status, error, start, stop, reset } = useTextStream();
```

## API

### `useTextStream(options)`

| Option     | Type                          | Called when                          |
| ---------- | ----------------------------- | ------------------------------------ |
| `onFinish` | `(text, { stopped }) => void` | The stream ends or is stopped.       |
| `onError`  | `(error, text) => void`       | Opening or reading the stream fails. |

| Returns        | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `text`         | All text received so far.                                              |
| `status`       | `"idle"`, `"pending"`, `"streaming"`, `"complete"` or `"error"`.       |
| `error`        | The failure, when `status` is `"error"`.                               |
| `start(input)` | Ends any current stream and reads a new one. Resolves when it settles. |
| `stop()`       | Ends the stream and keeps its text. The status becomes `"complete"`.   |
| `reset()`      | Ends the stream and returns to `"idle"`.                               |

`input` is a `ReadableStream` or an async iterable of strings or UTF-8 bytes, or a function `(signal) => stream` that may return a promise. The signal aborts on `stop`, `reset`, a newer `start` and unmount, so pass it to `fetch` or your model SDK. A stream that a newer one replaced reports nothing. Text updates at most once a frame.

A server that sends events, such as `text/event-stream`, needs decoding first: pass an async iterable that yields only the text.

## Core

`@erbium-ui/react/streaming-response/core` has no React, so servers can use it.

| Export                            | Description                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `readTextStream(source, options)` | Reads a stream into `onChunk`, decoding bytes. `signal` stops and cancels it.   |
| `isResponseBusy(status)`          | Whether more text can arrive.                                                   |
| `isResponseSettled(status)`       | Whether the response finished, successfully or not.                             |
| `isResponsePending(status, text)` | Whether to show a waiting state.                                                |
| `isRemoteUrl(url)`                | Whether a URL leaves the page's origin over the web, such as an image to block. |
