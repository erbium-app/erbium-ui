---
title: "Use Copy To Clipboard"
description: "Shared clipboard behavior with pending protection and temporary feedback."
---

## Recommended usage

Use `CopyButton` from `@erbium/ui/blocks/copy-button` for a complete copy control. It combines this hook with the shared Button, animated CopyButtonIcon, and accessible success and failure announcements.

```tsx
<CopyButton value={command} aria-label="Copy installation command" />
```

For a flush action inside a field, follow the [Copy Button composition](/docs/copy-button) with an embedded InputGroupButton. The Overview example shows how to use the hook directly when you need custom feedback.

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

## Plain JavaScript

A React hook requires React. Code outside React can use `createCopyToClipboard` from `@erbium/ui/lib/copy-to-clipboard`, the same controller that powers this hook, so there is one clipboard implementation for both.

The controller also accepts an async text resolver, allowing callers to resolve text within the same pending and error lifecycle. Text resolution stays with the caller.

Registry installation of the hook includes the shared controller. Installing CopyButton includes both automatically.
