---
title: "Code Block"
description: "Copyable code and commands with composed headers and accessible tabs."
---

## Usage

Import from `@erbium/ui/blocks/code-block`.

```tsx
<CodeBlock code={source} language="tsx" title="app.tsx" />
```

`CodeBlock` highlights with [Highlights](https://diffs.com/docs#highlights) (`@pierre/highlights`), Pierre's WebAssembly highlighter, which Diff View and File View use too. Highlights is in beta; its API may still change, and the block keeps it behind its own props.

The default layout includes the source and an anchored icon copy button. A header and separator appear only when you provide a `title` or tabbed `items`; the language does not create a header. Actions stay at the block’s top inline end while the source scrolls. Without a header they sit over the source, so they appear when the pointer is over the block or focus is inside it, and stay shown on touch screens. Vitesse light and dark syntax colors follow the application's appearance. There is no theme or highlighting-engine setting. Code surfaces scroll horizontally by default and have a bounded height; use `wrap` or `lineNumbers` when appropriate.

## Line numbers

```tsx
<CodeBlock code={excerpt} language="ts" title="server.ts" lineNumbers startLine={42} />
```

`lineNumbers` adds a gutter, and `startLine` sets the number of the first line for an excerpt from the middle of a file. The gutter is one column sized by the widest number, so lines stay aligned past line 999. With `wrap`, a wrapped line continues in the code column rather than under its number. Code blocks share their line metrics with File View and Diff View, so a numbered snippet lines up with a file view of the same source.

## Highlighted lines

```tsx
<CodeBlock code={config} language="ts" lineNumbers highlightLines={[3, 4]} />
```

`highlightLines` takes the displayed numbers of the lines to call out, counted from `startLine`, on the root or on each item. A highlighted line gets a tint across the block and a marker on its leading edge, so it does not rely on color alone. Highlighting is visual: when a line matters to the reader, say so in the surrounding text as well. To show changes between two versions, use Diff View; code blocks have no added or removed line states.

## Language icons

Default titles and tabs include a decorative icon selected from the source’s `language`. TypeScript and JavaScript use their language icons; TSX and JSX use React. Aliases such as `typescript`, `py`, and `bash` share the same selection as their canonical languages. Plaintext uses a text-file icon and unknown languages use a generic file icon. A command surface without a language uses the shell icon. Titles and tab labels do not determine the language. Headerless snippets remain headerless.

Mount `IconSprite` from `@erbium/ui/components/icon-sprite` once in the application shell, outside scrolling and hidden panels. It renders the generated `@erbium/icons` symbols and does not require client hydration. Storybook mounts it. Apps that serve `@erbium/icons/sprite.svg` from their own origin, such as the docs, can wrap the shell in `IconSpriteProvider` from `@erbium/ui/components/icon` instead. The icons inherit the surrounding text color.

Use `CodeBlockIcon` as the first child of a custom title or tab. It reads the active source by default; inside a custom tab use `value` to reference that tab’s item, for example `<CodeBlockIcon value="styles" />`. Icon artwork and names belong to `@erbium/icons`; language selection belongs to the UI package. There are no icon-set or color settings on `CodeBlock`.

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

Code is highlighted in the browser after the block mounts. To render highlighted code from the server, call `highlightCode(code, language)` from `@erbium/ui/blocks/code-block` ahead of time and pass its result as `tokens`, on the block or on each item. Provided tokens must come from the same `code` and `language`; the block renders them as given.

`value`, `defaultValue`, and `onValueChange` follow the Base UI Tabs model. The callback receives the selected value and Base UI change details; cancel through `details.cancel()`. Selection falls back to the first enabled item if the requested item is unavailable. With no enabled items, copying is disabled. A shared controlled value can synchronize package-manager preferences across blocks. Persistence belongs to the application.

## Composition

```tsx
<CodeBlock code={source} language="json">
  <CodeBlockHeader className="justify-start">
    <CodeBlockTitle>
      <CodeBlockIcon />
      <span className="truncate">config.json</span>
    </CodeBlockTitle>
    <CodeBlockLanguage />
  </CodeBlockHeader>
  <CodeBlockActions>
    <CodeBlockCopyButton />
  </CodeBlockActions>
  <CodeBlockContent />
</CodeBlock>
```

Providing children replaces the default layout. Place `CodeBlockActions` directly inside the root, independently of the optional header. It anchors custom actions outside the scrolling content, at the top right. Omit the actions part for a read-only block without controls. Content reserves space for the default icon action; for wider custom actions, increase the content’s end padding through `className`. Compose `CodeBlockTabs`, `CodeBlockTab`, and `CodeBlockPanel` for custom tabbed layouts; panel values reference the root's items rather than duplicating source strings. `CodeBlockTabs` generates tabs from items when it has no children. In a command block (`surface="command"`) whose items all have the same icon, such as one command for several package managers, the generated tabs show labels only and the default layout shows the icon once, before the tabs; place a `CodeBlockIcon` there yourself in a custom header. Give its `aria-label` a name appropriate to the alternatives. Each panel renders its corresponding source. For a single source or only the active source, use `CodeBlockContent`.

`CodeBlockCopyButton` wraps the existing CopyButton and reads the active source from context. It accepts CopyButton props, including custom labels, `render`, callbacks, and translated announcements. An explicit `value` overrides copied text. Source changes reset copy feedback without remounting the button. The button appears when focus enters the block and stays shown on touch screens. It is a ghost button in every block, with or without a label.

Keep the copy action icon-only when it copies the block’s source, as in the default layout and the composition above: a visible “Copy” label repeats what the icon and the block already say. Give the button a specific `aria-label` instead, such as “Copy project configuration”. Show a label only when it names something the icon cannot, such as “Copy prompt” on a [prompt](#prompts); compose it from the existing CopyButtonIcon and CopyButtonLabel parts and reserve room for it in the header.

## Prompts

A prompt for a coding agent is a plain-text block with `wrap`, a `Prompt` title, and a labelled ghost copy action, so long instructions read as prose and the action says what it copies. Compose it from the same parts:

```tsx
<CodeBlock code={prompt} language="text" wrap>
  <CodeBlockHeader className="pe-32">
    <CodeBlockTitle>Prompt</CodeBlockTitle>
  </CodeBlockHeader>
  <CodeBlockActions>
    <CodeBlockCopyButton aria-label="Copy prompt">
      <CopyButtonIcon data-icon="inline-start" />
      <CopyButtonLabel>
        <CopyButtonLabelIdle>Copy prompt</CopyButtonLabelIdle>
        <CopyButtonLabelCopied>Copied</CopyButtonLabelCopied>
        <CopyButtonLabelError>Failed</CopyButtonLabelError>
      </CopyButtonLabel>
    </CodeBlockCopyButton>
  </CodeBlockActions>
  <CodeBlockContent />
</CodeBlock>
```

The header’s end padding reserves room for the labelled action. Write prompts as numbered steps that name the tools and checks the agent should use; the [installation prompt](/docs/installation#set-up-with-an-agent) is a complete example.

## Source and highlighting

Copying preserves the provided string exactly, including indentation, trailing spaces, and final newlines. A final newline ends the last line rather than rendering an extra empty one. It excludes line numbers and controls. Empty strings are valid. Dedent authored examples before passing them if necessary; the component does not format source.

Blocks start as readable plaintext, then load [Highlights](https://diffs.com/docs#highlights), Pierre's WebAssembly highlighter, once per page. It bundles lexers for about 150 languages, including TypeScript, TSX, JavaScript, JSX, JSON, CSS, HTML, shell, YAML, Python, SQL, Markdown, and diff, with common aliases such as `patch`, `sh`, and `yml`. Unknown languages render as plaintext. Diff View and File View use the same highlighter and Vitesse themes, so code reads the same in all three. Where WebAssembly is unavailable or blocked by a Content Security Policy, blocks stay plaintext.

Use `diff` for a patch shown as text, such as a fenced patch in documentation; it colors added and removed lines by their `+` and `-` markers. To compare two versions of a file, with line numbers, word-level changes and expandable context, use Diff View instead.

Use `ansi` for terminal output. It renders ANSI colors, backgrounds, bold, and italics instead of showing their escape codes as text, and a style carries to later lines until it is reset, as in a terminal. Copying keeps the provided string exactly, escape codes included; pass a `value` without them to `CodeBlockCopyButton` when readers should paste plain text.

Once the highlighter has loaded, tokenizing is synchronous, so the block highlights its whole source on every render, and edited or replaced source never shows stale colors or drops back to plaintext. For a model's reply that streams in, code included, use [Streaming Response](/docs/blocks/streaming-response).

This is a read-only presentation block. Editable document code blocks and future file/diff viewers keep their own rendering lifecycles.

## Accessibility

Tabbed blocks use Base UI Tabs for keyboard navigation and tab/panel relationships. The entire block—header, tabs, actions, source, and tab keyboard navigation—always uses LTR direction, including inside an RTL page or direction provider. The root has no `dir` option. Source regions are focusable for scrolling; pass `tabIndex={-1}` to `CodeBlockContent` to remove the tab stop from source that never scrolls. Copy actions announce success and failure using the shared clipboard implementation. Line numbers are excluded from accessibility text and clipboard actions. Override the copy button's accessible name when a more specific label is useful.
