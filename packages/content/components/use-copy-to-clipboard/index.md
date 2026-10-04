---
title: "Use Copy To Clipboard"
description: "Shared clipboard behavior with pending protection and temporary feedback."
---

## Recommended usage

Use `CopyButton` from `@erbium/ui/blocks/copy-button` for a complete copy control. It combines this hook with the shared Button, animated CopyIcon, and accessible success and failure announcements.

```tsx
<CopyButton value={command} aria-label="Copy installation command" />
```

Use its `render` prop to compose an existing button, including InputGroupButton. Default icons inherit their size from the surrounding button.

## Direct hook usage

Import `useCopyToClipboard` from `@erbium/ui/hooks/use-copy-to-clipboard` when your interface owns its interaction and feedback.

```tsx
const { copyToClipboard, isCopied, isPending, error } = useCopyToClipboard({
  timeout: 2000,
  onCopy: () => console.info("Copy completed"),
  onError: reportError,
});
```

`copyToClipboard(value)` returns a promise resolving to a success boolean. It prevents overlapping writes, accepts empty strings, and sets `isCopied` only after the write succeeds. `isPending` tracks the operation; `error` contains a failure. Repeated successful copies restart the feedback timer. A timeout of zero keeps success visible. Cleanup cancels timers and prevents late operation results from updating a disposed owner.

When using the hook directly, supply an accessible name, CopyIcon or other feedback, and a live status region. Clipboard access requires a secure browser context. Unsupported access is reported through `error` and `onError`.

## Astro and plain JavaScript

A React hook requires React. Astro browser scripts use `createCopyToClipboard` from `@erbium/ui/lib/copy-to-clipboard`, the same controller that powers this hook. There is one clipboard implementation shared by both adapters.

```ts
const clipboard = createCopyToClipboard();
const unsubscribe = clipboard.subscribe(() => {
  const { isCopied, isPending, error } = clipboard.getSnapshot();
  // Update the button, animated icon, and accessible status region.
});

await clipboard.copyToClipboard("Erbium UI");

// On component disconnect:
unsubscribe();
clipboard.dispose();
```

The controller also accepts an async text resolver, allowing Astro to fetch Markdown within the same pending and error lifecycle. Content fetching stays with the adapter. The docs' Astro copy controls subscribe to this controller and dispose it on disconnect.

Registry installation of the hook includes the shared controller. Installing CopyButton includes both automatically.
