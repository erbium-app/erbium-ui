---
title: "Copy Button"
description: "Composable copy actions with stable, animated feedback."
---

## Usage

Import from `@erbium/ui/blocks/copy-button`. The default is a ghost icon button with copy, success, and failure feedback.

```tsx
<CopyButton value={command} aria-label="Copy installation command" />
```

The registry installs the block in your components/blocks directory with the shared clipboard hook and controller, Button, and StatefulIcon dependencies.

## Labels with defaults

```tsx
<CopyButton value={code} variant="outline">
  <CopyButtonIcon data-icon="inline-start" />
  <CopyButtonLabel />
</CopyButton>
```

CopyButtonLabel includes Copy, Copied, and Failed states by default. All labels remain mounted in one grid cell, reserving the widest label's space. Transitions respect reduced motion. Children automatically select a normal button size; icon-only defaults use the icon size. Icons inherit the button's SVG sizing.

## Custom labels

```tsx
<CopyButton value={code} size="sm" variant="outline">
  <CopyButtonIcon data-icon="inline-start" />
  <CopyButtonLabel>
    <CopyButtonLabelIdle>Copy code</CopyButtonLabelIdle>
    <CopyButtonLabelCopied>Code copied!</CopyButtonLabelCopied>
    <CopyButtonLabelError>Try again</CopyButtonLabelError>
  </CopyButtonLabel>
</CopyButton>
```

The content components consume internal copy state. Developers do not pass copied flags or reproduce animation markup. Include all three label states when replacing the defaults. Static text alongside CopyButtonIcon is also supported when the action label should remain unchanged.

## Existing buttons

Place the action in `InputGroupAddon align="inline-end"` after the input. Pass the same value to the field and the copy action. Use `variant="embedded"` on the rendered button so the field provides the only surface.

```tsx
<InputGroup>
  <InputGroupInput aria-label="Profile URL" value={profileUrl} readOnly />
  <InputGroupAddon align="inline-end">
    <CopyButton
      aria-label="Copy profile URL"
      render={<InputGroupButton variant="embedded" size="icon-xs" />}
      value={profileUrl}
    />
  </InputGroupAddon>
</InputGroup>
```

For a display-only value, pair selectable text with a named CopyButton. Use the full string as the copy value even when the display is truncated.

Explicit props on the rendered element have precedence. Keep the rendered element a button-compatible component and forward the supplied props and ref. A render callback receives copied, pending, status, and revision, but normal compositions use the content components directly.

## Behavior

The shared controller synchronously blocks overlapping writes, including clicks before React rerenders. Pending repeat writes preserve previous feedback. Each successful or failed attempt increments a revision to refresh feedback; the timeout starts when that attempt settles. Old timers and disposed operations cannot overwrite newer feedback.

`timeout` defaults to 2000 milliseconds; zero keeps confirmation visible. `onCopied` fires after a successful write and `onError` receives failures. Empty strings are valid. Clipboard access requires a secure browser context. Consumer click handlers can cancel with preventDefault(). Disabled and loading buttons cannot start copying.

`data-copied`, `data-pending`, and `data-status` expose presentation state. A separate persistent status region announces successMessage and errorMessage, which can be translated. Provide a specific aria-label for icon-only buttons. Custom label text determines a labeled button's name unless overridden.

Code blocks own their active source text and supply it through value. Tooltips remain normal Base UI composition; CopyButton does not force a popup open after every click.
