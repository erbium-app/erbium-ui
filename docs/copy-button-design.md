# Copy button: composition and future API

Recorded on 2026-10-05.

## Current API revision

The implemented API now uses CopyButton with context-aware CopyButtonIcon and CopyButtonLabel. Empty labels provide Copy/Copied/Failed defaults; custom labels compose CopyButtonLabelIdle, CopyButtonLabelCopied, and CopyButtonLabelError. The former explicit CopyIcon export is removed. Earlier examples below are historical design discussion, not the current API. See public documentation for current examples.

Rapid clicks are guarded synchronously in the shared controller. Repeat writes preserve visible feedback while pending, increment revision on settlement, and invalidate stale reset timers. Failure has a visual icon and label, as well as an accessible announcement. Fluid Functionalism inspired repeated confirmation and failure feedback; tooltip choreography remains a future composed integration, and execCommand fallback is not adopted.

## Status

The first CopyButton block is implemented. The extensions below are proposals, not implemented APIs. This document records the current direction and the evidence for revisiting it.

Current source:

- [CopyButton and CopyIcon](../packages/ui/src/blocks/copy-button.tsx)
- [Clipboard hook](../packages/ui/src/hooks/use-copy-to-clipboard.ts)
- [StatefulIcon](../packages/ui/src/components/stateful-icon.tsx)
- [Showcase catalog](../packages/showcase/src/copy-button/catalog.tsx)
- [Public documentation content](../packages/content/components/copy-button/index.md)

## Intended experience

Provide an opinionated icon copy button that developers can install through the shadcn registry and customize as source. The registry places the block in the consumer's components/blocks directory and includes its hook and component dependencies.

The same behavior should work inside a normal button, an input group, a toolbar, and a future code block. A code block supplies its active source text; CopyButton does not inspect the DOM or own tab selection.

## Current composition

```text
CopyButton
├── useCopyToClipboard: write, pending guard, success, error, reset timer
└── Button: surface, size, semantics and interaction
    └── CopyIcon: copy/check configuration
        └── StatefulIcon: visual transition
```

One owner manages clipboard state and its reset timer: the hook. The block adds defaults and a persistent accessible status region. CopyIcon owns no behavior or timer.

```tsx
// Implemented API: icon-only default.
<CopyButton value={command} aria-label="Copy installation command" />

// Implemented API: shared button sizing and appearance.
<CopyButton value={command} size="icon-xs" variant="outline" />

// Implemented API: use another button component.
<CopyButton
  value={url}
  aria-label="Copy URL"
  render={<InputGroupButton size="icon-xs" />}
/>

// Implemented API: custom label and animated icon.
<CopyButton
  value={command}
  aria-label="Copy command"
  render={(props, state) => (
    <Button {...props} size="sm" variant="outline">
      <CopyIcon copied={state.copied} data-icon="inline-start" />
      {state.copied ? "Copied" : "Copy command"}
    </Button>
  )}
/>
```

Default CopyIcon SVGs carry no fixed size class. The surrounding button's descendant SVG rules determine their size. A consumer can explicitly override those rules. StatefulIcon supports an inline placement hint and respects reduced motion.

Button defaults belong in the merged props, not on the replacement render element. Base UI gives props on that replacement element precedence; putting defaults there previously overrode requested button sizes. Custom rendered buttons should own their appearance unless the caller deliberately supplies styling props elsewhere. Document actual precedence rather than assuming outer props always win.

The hook currently returns copyToClipboard, isCopied, isPending, and error. copyToClipboard resolves to a success boolean. It permits empty strings, reports unavailable clipboard access, prevents overlapping writes, and cleans up timers on unmount. CopyButton exposes copied and pending render state and corresponding data attributes.

## Evidence from Elavie

Inspected local checkout: /Volumes/AlirezaDev/Codes/Fullstack/elavie.

| Consumer                                              | Requirement                                                       | Implication                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| Settings addresses, keys, referral URLs               | Copy supplied text                                                | Keep a simple value API                                          |
| Code, table, diagram, error and session detail blocks | Copy serialized content; disable while streaming where applicable | Serialization and availability belong to adapters                |
| PDF selection toolbar                                 | Let the PDF capability perform copying                            | A supplied string is not sufficient for every consumer           |
| Selection toolbar                                     | Dismiss after confirmation has remained visible                   | Operation completion and feedback completion are distinct events |
| Toolbar controls                                      | Match an existing button footprint                                | Reuse button styling and allow render composition                |

Relevant Elavie source paths, relative to that checkout:

- packages/ui/web/src/blocks/copy-button.tsx
- packages/ui/toolbar/src/components/toolbar/selection-copy-button.tsx
- packages/ui/web/src/blocks/ai-elements/code-block/copy-button.tsx
- packages/ui/web/src/blocks/ai-elements/table-block/copy-button.tsx
- packages/ui/web/src/blocks/ai-elements/mermaid-block/copy-button.tsx

Elavie's CopyButton has custom copyAction and onFeedbackComplete support. Its selection adapter maps feedback completion to toolbar dismissal. Those are demonstrated requirements, not hypothetical extensions.

Its implementation also duplicates button variants, icon animation, and timer state. Preserve the useful capabilities without carrying those duplications into Erbium UI.

## Base UI findings

Inspected local checkout: /Volumes/AlirezaDev/Codes/Packages/base-ui.

No public clipboard or CopyButton primitive was found in that checkout. Its documentation implements copying locally:

- docs/src/blocks/Demo/DemoSourceCopy.tsx encapsulates copying selected source, exposes render, onCopied, and onError, and leaves appearance to the consumer.
- docs/src/components/CodeBlock/CodeBlock.tsx owns local clipboard feedback.
- docs/src/app/(docs)/react/components/toast/demos/anchored/tailwind/index.tsx demonstrates tooltip/button composition and anchored feedback. Its copy action is a feedback demonstration; it does not write to the clipboard.

Public API references:

- packages/react/src/use-render/useRender.ts
- packages/react/src/button/Button.tsx
- packages/react/src/internals/types.ts
- packages/react/src/toggle/Toggle.tsx

Base UI's render API composes behavior, props, and refs onto one rendered element. Render callbacks receive state; state can also drive data attributes. Shared component APIs support state-aware className and style callbacks. Button behavior additionally has a nativeButton contract and focusableWhenDisabled support.

Using useRender alone does not supply button semantics or keyboard behavior. That distinction matters when a consumer supplies a raw element.

## Alternative 1: extend the opinionated CopyButton

Preferred next direction: retain the small default API and support an operation that owns copying.

```tsx
// Proposed API; not implemented.
<CopyButton value={code} />

<CopyButton
  action={() => pdfSelection.copyToClipboard()}
  onFeedbackComplete={closeToolbar}
  aria-label="Copy selection"
/>
```

Make the two operation sources mutually exclusive:

```ts
// Proposed type; not implemented.
type CopySource =
  | { value: string; action?: never }
  | { action: () => void | Promise<void>; value?: never };
```

Both paths use the same lifecycle:

```text
idle → pending → copied → idle
             ↘ failure → idle on retry
```

The action must throw or reject on failure. Resolving means the operation succeeded. Define how integrations that return false instead of rejecting are adapted before accepting that behavior.

onCopied fires after the operation succeeds. onFeedbackComplete fires after the confirmation interval finishes. Never use operation completion to dismiss a toolbar that should first show confirmation.

Questions to settle:

- Does timeout=0 mean persistent feedback with no completion callback?
- Should repeated activation during success restart feedback or be ignored?
- Should changing value clear confirmation for the previous value?
- Should feedback completion fire only on timeout, or also on explicit reset? Unmount should not accidentally invoke consumer dismissal callbacks.

## Alternative 2: separate behavior from the styled default

```tsx
// Proposed API; not implemented.
<CopyTrigger
  value={url}
  render={<InputGroupButton size="icon-xs" />}
>
  {/* Consumer-provided content */}
</CopyTrigger>

<CopyButton value={url} />
```

CopyTrigger would own behavior and expose state. CopyButton would compose it with Button and CopyIcon. Neither needs a provider.

This creates a clearer distinction between a behavior and its opinionated presentation, but introduces another public component. Adopt it if custom triggers become common and keeping all behavior inside CopyButton makes its API confusing.

A trigger accepting arbitrary children still needs a documented way to access copied state. A render callback can do that without adding context solely for an icon.

## Alternative 3: a richer hook for caller-owned controls

```tsx
// Proposed API; not implemented.
const copy = useCopyToClipboard({
  action: () => pdfSelection.copyToClipboard(),
  onFeedbackComplete: closeToolbar,
});

<ToolbarButton onClick={() => void copy.execute()}>
  <CopyIcon copied={copy.status === "copied"} />
</ToolbarButton>;
```

A richer hook could expose status, execute, and reset. It supports keyboard shortcuts, menu items, and controls whose interaction belongs to another primitive. Consumers must deliberately compose accessible feedback.

Preferred relationship: this hook remains the behavior owner and escape hatch; CopyButton stays the easiest accessible default. Avoid creating a second timer or async state machine in the component.

## Composition issues to resolve

These are limits of the current implementation, not completed Base UI compatibility guarantees:

1. A render callback can return a raw element and bypass Button behavior. Either constrain the contract to button-compatible components or deliberately implement native/non-native button behavior. Do not imply arbitrary tags are safe.
2. Current native-button prop types expose static className and style. Consider state-aware callbacks using CopyButton's state, consistent with Base UI's public component pattern.
3. Base UI handlers support preventBaseUIHandler(). CopyButton currently checks preventDefault(). Choose and document the cancellation contract; test merged handler ordering across both outer props and replacement-element handlers.
4. CopyButton returns the button plus a sibling live status region. Verify composition when another Base UI trigger receives CopyButton as its render element. A fragment is not itself a DOM trigger; the forwarded ref and all injected props must reach the actual button.
5. Verify that a disabled or loading custom button cannot execute the copy operation and that pending behavior preserves focus. Do not rely only on visual styling.
6. The default aria-label is Copy. Custom labeled content should have an intentional accessible name rather than accidentally retaining a generic label that masks its visible text.

Keep tooltip composition optional. Copy success must be announced independently of hover. If anchored toast feedback is introduced, decide whether it replaces or duplicates the built-in live announcement.

## Decisions and deferred directions

- Keep the existing hook → button → animated icon layering.
- Prefer Alternative 1, backed by Alternative 3's hook improvements, when expanding the API.
- Add custom operations and feedback completion because Elavie demonstrates both needs.
- Keep source serialization, content fetching, active code tab selection, streaming state, and dismissal decisions with consuming adapters.
- Avoid duplicating button variants or icon transition implementations.
- Defer controlled copied state: inspected consumers need to observe completion, not externally manufacture success.
- Defer a provider/compound component tree until multiple independently placed consumers need shared copy state. A trigger and icon alone do not justify that structure.
- Under the component design skill's taxonomy, CopyButton is a reusable component and a command panel is a block. The repository intentionally distributes CopyButton as its first registry block; taxonomy should not force unnecessary internal complexity.

## Future verification scenarios

Before changing the API, manually verify in Storybook or the docs playground:

- Ordinary copy, repeated activation, pending overlap, failure and retry.
- Empty text, clipboard unavailable, unmount during pending, timer cleanup.
- Custom PDF operation success and rejection.
- Toolbar dismissal after visible feedback, not immediately after writing.
- Value changes while feedback is showing.
- Button and input-group icon sizing; explicit consumer overrides.
- Consumer event cancellation and disabled/loading behavior.
- Ref forwarding and nesting inside Base UI Tooltip or Toolbar composition.
- Keyboard activation, focus retention, live announcements and reduced motion.

The repository has no automated test suite. Run bun run fix when mechanical changes are appropriate, bun run check for repository validation, and rebuild the UI/showcase registries when their sources change. Use bun run showcase:check to verify generated synchronization and docs/Storybook builds.

## Stable label presentation

Astro copy labels and the labeled React examples keep idle and success labels mounted in the same grid cell. Both contribute to layout, so the button reserves space for the longest label. Only the active label is visible; a 150ms opacity/vertical transition matches StatefulButton and is disabled for reduced motion. Astro label visuals are decorative because the button already has an accessible name and a separate live status region.

This follows Interior's copy button and Erbium's StatefulButton approach. Avoid replacing a single text node, display:none, or conditional mounting when stable intrinsic width is required. No fixed width or runtime measurement is necessary.

Torph remains an optional text-morph composition. It must animate inside an independently reserved label area: morphing text alone does not guarantee stable button width. A public StatefulLabel abstraction is deferred until more consumers establish its API.
