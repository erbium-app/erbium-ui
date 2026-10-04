---
title: "Copy Button"
description: "Copy text with animated, accessible feedback."
---

## Usage

Import `CopyButton` and `CopyIcon` from `@erbium/ui/blocks/copy-button`.

```tsx
<CopyButton value={command} aria-label="Copy installation command" />
```

The registry installs this block into your components `blocks` directory, together with its clipboard hook, Button, StatefulIcon, and their dependencies.

## Composition

The default is a ghost icon button. Use Button's `size`, `variant`, and `className` props to customize it. Default icons inherit the surrounding button's SVG sizing rules.

Use `render={<InputGroupButton size="icon-xs" />}` to compose with an input group button. The rendered component owns its size and surface unless you explicitly pass them to CopyButton.

A render callback receives button props and `{ copied, pending }`. Spread those props onto your button and use `CopyIcon copied={state.copied}` with your own label. `CopyIcon` accepts `className` and `data-icon` for icon styling and inline placement. Custom children replace the automatic icon.

## Behavior

`value` is the text copied on activation. The hook prevents overlapping writes, sets success only after the write completes, and resets feedback after `timeout` milliseconds (default 2000; zero keeps success visible). `onCopied` runs after success; `onError` receives clipboard failures. A consumer click handler can cancel copying with `event.preventDefault()`.

`data-copied` and `data-pending` expose state for styling. Clipboard access requires a secure browser context. Empty strings are valid clipboard values.

## Accessibility

The default accessible name is Copy. Provide a specific `aria-label` for icon buttons. A persistent status region announces `successMessage` or `errorMessage`; both can be translated. Icons are decorative and animation respects reduced motion. Focus remains on the button while the clipboard write is pending.

Code blocks should supply their active source text through `value`; the copy button does not inspect the DOM or own package-manager selection.
