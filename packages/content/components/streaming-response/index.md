---
title: "Streaming Response"
description: "A model's reply as it streams in: Markdown, highlighted code, waiting and error states, and your own UI."
---

## Usage

Import from `@erbium/ui/blocks/streaming-response`. `useTextStream` reads the stream, and `StreamingResponse` shows it.

```tsx
const { text, status, error, start, stop } = useTextStream();

const ask = (prompt: string) =>
  start(async (signal) => {
    const response = await fetch("/api/chat", { body: prompt, method: "POST", signal });

    if (!response.ok || !response.body) {
      throw new Error("The model did not respond.");
    }

    return response.body;
  });

return <StreamingResponse text={text} status={status} error={error?.message} />;
```

The Markdown is rendered by [Pierre's Words](https://diffs.com) (`@pierre/words`), which parses only the unfinished end of the response on each update, closes syntax that is still open, and highlights code while it arrives. Words is in beta; its API may still change. Code uses the same Vitesse light and dark colors as [Code Block](/docs/blocks/code-block).

## Design system

Blocks in a response look and behave like Erbium's components, in the same themes:

| Markdown                                              | Looks like                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| Fenced code                                           | [Code Block](/docs/blocks/code-block), with its copy button   |
| `title="…"` after the language                        | The code block's header, with the language icon               |
| Tables                                                | [Table](/docs/components/table), scrolling sideways when wide |
| Task lists                                            | A read-only [Checkbox](/docs/components/checkbox)             |
| `> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION` | An [Alert](/docs/components/alert)                            |
| `---`                                                 | [Separator](/docs/components/separator)                       |
| `<kbd>`, with `allowedHtml={{ kbd: [] }}`             | [Kbd](/docs/components/kbd)                                   |
| An island that is not ready                           | A [Marker](/docs/components/marker)                           |

Headings, lists, quotes, links and inline code follow [Typography](/docs/foundations/typography). Icons come from the same sprite as `Icon`, including one set with `IconSpriteProvider`. Images do not open in a lightbox.

## Reading a stream

`useTextStream` comes from the [unstyled streaming response](/docs/react/streaming-response). `start` takes a `ReadableStream` or an async iterable of text or UTF-8 bytes, such as `response.body` or a model SDK's text stream, or a function that opens one. Pass the function's `signal` to the request, so `stop` cancels it too. Text updates at most once a frame, however fast it arrives.

You do not need the hook. Any source of text works: pass all of the text received so far as `text`, with a `status`.

| `status`    | Meaning                            | Shows                    |
| ----------- | ---------------------------------- | ------------------------ |
| `idle`      | Nothing has been requested.        | Nothing                  |
| `pending`   | Waiting for the first text.        | Waiting state            |
| `streaming` | Text is arriving.                  | Markdown with a caret    |
| `complete`  | The text is final, or was stopped. | Markdown and actions     |
| `error`     | The stream failed.                 | Markdown, error, actions |

`complete` is the default, so a saved message needs only `text`.

## Composition

Without children, `StreamingResponse` renders the waiting state, the content and the error. Pass parts to change one or to add actions.

```tsx
<StreamingResponse text={text} status={status} error={error?.message}>
  <StreamingResponsePending>Searching the files…</StreamingResponsePending>
  <StreamingResponseContent />
  <StreamingResponseError />
  <StreamingResponseActions>
    <CopyButton value={text} aria-label="Copy response" />
  </StreamingResponseActions>
</StreamingResponse>
```

| Part                       | Renders                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `StreamingResponse`        | The response, with `data-status`.                             |
| `StreamingResponsePending` | A marker while there is nothing to read yet.                  |
| `StreamingResponseContent` | The Markdown. Takes the props of Words' `Markdown` component. |
| `StreamingResponseError`   | An alert with `error`, when `status` is `error`.              |
| `StreamingResponseActions` | Your controls, once the response is `complete` or in `error`. |

`useStreamingResponse()` returns `text`, `status` and `error` for your own parts.

## Your own UI in a response

A fenced code block named `island-<name>` mounts the component you register under that name. The fence holds JSON with a string `id`.

```tsx
const islands: StreamingResponseIslands = {
  deployment: {
    pending: "Preparing the deployment…",
    render: ({ id, service }) =>
      typeof service === "string" ? <Deployment key={id} service={service} /> : null,
  },
};

<StreamingResponseContent islands={islands} />;
```

The component mounts when the fence closes; `pending` shows until then. The data is model output, so validate it, return `null` to show the source as code, and ask the reader to confirm anything that changes data. Define `islands` outside render: a new object formats the whole response again. Tell your model which islands exist and what JSON each one takes.

## Content options

`StreamingResponseContent` passes its props to Words' `Markdown`:

- `animated` fades new text in. It is on by default, and Words skips it when the reader prefers reduced motion.
- `caret` is `"block"` (default), `"circle"` or `false`.
- `math` renders `$…$` and `$$…$$` as SVG. It is off by default, so prices stay text.
- `cjk` allows emphasis next to Chinese, Japanese and Korean text.
- `components` edits the HTML of an element by tag. These hooks take and return HTML strings and are trusted code, so escape anything you add. The block uses hooks for `a`, `blockquote`, `div`, `hr`, `input`, `kbd` and `table`; yours replace them for that tag.
- `plugins` adds renderers for code blocks, such as Words' Mermaid plugin.
- `lineNumbers` numbers the lines of code blocks. It is off by default.

The renderer loads with the first response, and the text shows as plain source until then. Call `preloadStreamingResponse()` when a chat opens to load it earlier.

## Safety

Model output is untrusted.

- Raw HTML is dropped. `allowedHtml` keeps the tags and attributes you list.
- Unsafe URLs, such as `javascript:` and `data:`, are removed.
- Remote images are not loaded, because a prompt-injected model can send data away in an image URL. To allow hosts you trust, pass `urlTransform`. It replaces the image rule, and unsafe URLs are still removed.
- `urlTransform` does not see URLs in raw HTML, so do not allow tags or attributes that load a URL, such as `img`, `src` or `srcset`.
- Links to other sites open in a new tab.

```tsx
<StreamingResponseContent
  urlTransform={(url, key) =>
    key === "href" || url.startsWith("https://images.example.com/") ? url : null
  }
/>
```

## Scrolling

Put responses in [Message Scroller](/docs/components/message-scroller) with `autoScroll` to follow a reply while the reader is at the end. Code blocks in a response have no height limit, so the transcript is the only thing that scrolls vertically.

## Accessibility

The content is `aria-busy` while text can arrive, and the waiting state is announced. A response is not a live region by itself, so text is not read out token by token. Put the transcript in a log, such as `MessageScrollerContent`, and set `aria-busy` on it while a reply streams. Wide tables scroll inside a focusable region.
