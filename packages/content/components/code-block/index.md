---
title: "Code Block"
description: "Copyable code and commands with composed headers and accessible tabs."
---

## Usage

Import from `@erbium/ui/blocks/code-block`.

```tsx
<CodeBlock code={source} language="tsx" title="app.tsx" />
```

The default layout includes the source and an anchored icon copy button. A header and separator appear only when you provide a `title` or tabbed `items`; the language does not create a header. Actions stay at the block’s top inline end while the source scrolls. Vitesse light and dark syntax colors follow the application's appearance. There is no theme or highlighting-engine setting. Code surfaces scroll horizontally by default and have a bounded height; use `wrap` or `lineNumbers` when appropriate.

## Tabs for code and commands

```tsx
<CodeBlock
  surface="command"
  defaultValue="bun"
  items={[
    { value: "bun", label: "Bun", code: "bun install", language: "shell" },
    { value: "npm", label: "npm", code: "npm install", language: "shell" },
  ]}
/>
```

Use either `code` and `language` for a single source, or `items` for tabbed content. Each item needs a unique string `value`, a readable `label`, and its exact `code`; `language` and `disabled` are optional. The command surface changes density, rather than command syntax or tab behavior. Provide complete commands for each package manager.

`value`, `defaultValue`, and `onValueChange` follow the Base UI Tabs model. The callback receives the selected value and Base UI change details; cancel through `details.cancel()`. Selection falls back to the first enabled item if the requested item is unavailable. With no enabled items, copying is disabled. A shared controlled value can synchronize package-manager preferences across blocks. Persistence belongs to the application.

## Composition

```tsx
<CodeBlock code={source} language="json">
  <CodeBlockHeader>
    <CodeBlockTitle>config.json</CodeBlockTitle>
    <CodeBlockLanguage />
  </CodeBlockHeader>
  <CodeBlockActions>
    <CodeBlockCopyButton />
  </CodeBlockActions>
  <CodeBlockContent />
</CodeBlock>
```

Providing children replaces the default layout. Place `CodeBlockActions` directly inside the root, independently of the optional header. It anchors custom actions outside the scrolling content, using logical positioning for RTL. Omit the actions part for a read-only block without controls. Content reserves space for the default icon action; for wider custom actions, increase the content’s end padding through `className`. Compose `CodeBlockTabs`, `CodeBlockTab`, and `CodeBlockPanel` for custom tabbed layouts; panel values reference the root's items rather than duplicating source strings. `CodeBlockTabs` generates tabs from items when it has no children. Give its `aria-label` a name appropriate to the alternatives. Each panel renders its corresponding source. For a single source or only the active source, use `CodeBlockContent`.

`CodeBlockCopyButton` wraps the existing CopyButton and reads the active source from context. It accepts CopyButton props, including custom labels, `render`, callbacks, and translated announcements. An explicit `value` overrides copied text. Source changes reset copy feedback without remounting the button. The button remains visible for keyboard and touch users. Use the existing CopyButtonIcon and CopyButtonLabel parts for a labeled action.

## Source and highlighting

Copying preserves the provided string exactly, including indentation, trailing spaces, and final newlines. It excludes line numbers and controls. Empty strings are valid. Dedent authored examples before passing them if necessary; the component does not format source.

React snippets start as readable plaintext, then load a shared Shiki JavaScript runtime and the requested grammar. TypeScript, TSX, JavaScript, JSX, JSON, CSS, HTML, shell, YAML, Python, SQL, and Markdown are supported, including common aliases. Other languages fall back to plaintext. Highlighted results use a bounded shared cache, and stale asynchronous results cannot overwrite changed source. Documentation fences continue to use build-time TanStack Highlight with Vitesse colors.

This is a read-only presentation block. Editable document code blocks and future file/diff viewers keep their own rendering lifecycles.

## Accessibility

Tabbed blocks use Base UI Tabs for keyboard navigation and tab/panel relationships. Source regions are focusable for scrolling and explicitly LTR while headers respect surrounding direction. Copy actions announce success and failure using the shared clipboard implementation. Line numbers are excluded from accessibility text and clipboard actions. Override the copy button's accessible name when a more specific label is useful.
