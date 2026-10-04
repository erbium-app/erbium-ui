---
title: "Use Copy To Clipboard"
description: "Shared clipboard behavior with pending protection and temporary feedback."
---

## Recommended usage

Use `CopyButton` from `@erbium/ui/blocks/copy-button` for a complete copy control. It combines this hook with the shared Button, animated CopyButtonIcon, and accessible success and failure announcements.

```tsx
<CopyButton value={command} aria-label="Copy installation command" />
```

Use its `render` prop to compose an existing button, including InputGroupButton. Default icons inherit their size from the surrounding button.

## Hook API

`CopyButton` owns the interaction, icon, labels, and announcements. Its underlying `useCopyToClipboard` hook is available from `@erbium/ui/hooks/use-copy-to-clipboard` for integrations that need clipboard state beyond the control. Use the block for copy actions rather than rebuilding a button around the hook.

```tsx
const { copyToClipboard, isCopied, isPending, error } = useCopyToClipboard({
  timeout: 2000,
  onCopy: () => console.info("Copy completed"),
  onError: reportError,
});
```

`copyToClipboard(value)` returns a promise resolving to a success boolean. It prevents overlapping writes, accepts empty strings, and sets `isCopied` only after the write succeeds. `isPending` tracks the operation; `error` contains a failure. `status` is idle, copied, or error; `revision` increments after each completed attempt. Repeated attempts retain existing feedback while pending, then restart the feedback timer when they settle. A timeout of zero keeps success visible. Cleanup cancels timers and prevents late operation results from updating a disposed owner.

The block supplies an accessible name, animated stateful icon, and a live status region. Clipboard access requires a secure browser context. Unsupported access is reported through `error` and `onError`.

## Astro and plain JavaScript

A React hook requires React. Astro browser scripts use `createCopyToClipboard` from `@erbium/ui/lib/copy-to-clipboard`, the same controller that powers this hook. There is one clipboard implementation shared by both adapters. Astro copy actions use the shared `CopyButton.astro` control; pages do not wire their own clipboard handlers or feedback.

The controller also accepts an async text resolver, allowing Astro to fetch Markdown within the same pending and error lifecycle. Content fetching stays with the adapter. The docs' Astro copy controls subscribe to this controller and dispose it on disconnect.

Registry installation of the hook includes the shared controller. Installing CopyButton includes both automatically.
