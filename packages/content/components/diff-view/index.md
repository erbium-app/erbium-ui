---
title: "Diff View"
description: "Composable single-file diffs with Vitesse highlighting, selection, and annotations."
---

## Usage

Import from `@erbium/ui/blocks/diff-view`.

```tsx
<DiffView
  oldFile={{ name: "app.ts", contents: before }}
  newFile={{ name: "app.ts", contents: after }}
/>
```

The default layout shows the filename, added/deleted line counts, an exact-source copy action for the new file, and a split diff. Classic plus/minus indicators communicate changes alongside color. Syntax highlighting uses Vitesse light and dark; Erbium controls surfaces, typography, change colors, and selection. The viewer inherits the application's CSS `color-scheme`, including manually selected themes. Highlighting runs on [Highlights](https://diffs.com/docs#highlights), the same WebAssembly highlighter as Code Block, and falls back to Shiki's JavaScript engine where WebAssembly is unavailable. There is no theme or highlighting-engine prop at the root.

Filenames determine syntax highlighting. Use the optional file `lang` for an explicit language override. Unknown file extensions render as plaintext. Pass `oldFile={null}` for a new file or `newFile={null}` for a deleted file; at least one side must exist. Empty source strings are valid. Source strings are not formatted or normalized for copying.

## Rendering and interaction

`options` contains Pierre's typed single-file diff options, except the theme, injected CSS, and header rendering owned by Erbium. This keeps one configuration surface for layout, wrapping, line numbers, inline emphasis, indicators, hunk expansion, selection callbacks, and advanced interactions.

```tsx
<DiffView
  oldFile={before}
  newFile={after}
  options={{
    diffStyle: "unified",
    overflow: "wrap",
    lineDiffType: "word-alt",
    expansionLineCount: 10,
  }}
/>
```

Split layout and horizontal scrolling are the defaults. `disableLineNumbers` hides gutters, `diffIndicators` supports classic markers, bars, or none, and `lineDiffType` controls word/character emphasis. `expandUnchanged` reveals all context; otherwise use the built-in separator controls. Until Pierre's first render, the diff shows as plain text in Pierre's layout, with the same gutter, indicators, and separators, and gaps of up to `collapsedContextThreshold` unchanged lines shown inline. Highlighting then lands without moving any line. `parseDiffOptions` configures diff computation for file pairs and does not rewrite prepared patches. Keep source objects and prepared diffs stable between renders when their contents have not changed. Update `cacheKey` when file contents change if using Pierre worker caching.

## Selection and annotations

`lineAnnotations`, `renderAnnotation`, `renderGutterUtility`, and `selectedLines` retain Pierre's React contracts. Annotation metadata is generic and inferred from your annotations. Annotations use one-based line numbers and a `side` of `additions` or `deletions`.

```tsx
<DiffView
  oldFile={before}
  newFile={after}
  selectedLines={selection}
  options={{ enableLineSelection: true, onLineSelected: setSelection }}
  lineAnnotations={comments}
  renderAnnotation={({ metadata }) => <ReviewComment comment={metadata} />}
/>
```

Omit `selectedLines` for uncontrolled selection. Pass a range or `null` and update it through `options.onLineSelected` for controlled selection. Comments, persistence, review actions, and their accessible controls belong to the consuming application. Compose annotations using Erbium components and font roles.

## Composition

Providing children replaces the default layout. Parts read the source and rendered diff from context, so source strings need only be provided once.

```tsx
<DiffView oldFile={before} newFile={after} options={options}>
  <DiffViewHeader>
    <DiffViewTitle />
    <DiffViewActions>
      <DiffViewStats />
      <DiffViewCopyButton side="old" />
      <DiffViewCopyButton />
    </DiffViewActions>
  </DiffViewHeader>
  <DiffViewContent className="max-h-80" />
</DiffView>
```

Use existing Toggle, ToggleGroup, Button, and other controls for application-owned layout preferences. The diff does not create a second control library. `DiffViewTitle` displays renames as old path → new path; custom children override its text. `DiffViewStats` counts changed lines rather than context lines. `DiffViewCopyButton` accepts shared CopyButton props and copies the selected side exactly, excluding gutters, comments, and controls. The button is disabled for missing sides. Deleted files need `side="old"` to copy their previous contents.

## Prepared patches

Instead of a file pair, pass a unified diff or `git diff` output as `patch`. It must change exactly one file; a patch with no file or several files throws. The patch is parsed again only when the string changes.

```tsx
<DiffView patch={patch} options={{ diffStyle: "unified" }} />
```

For a patch that changes several files, parse it with `parsePatchFiles` from `@pierre/diffs` and render one `DiffView` per file, passing each file's `FileDiffMetadata` as `fileDiff`. Keep that metadata stable when using `options.loadDiffFiles`, because Pierre hydrates partial metadata in place; a `patch` string is parsed into new metadata whenever it changes.

Partial patches contain only the patch's visible lines. Exact full-file copying is disabled when the supplied metadata is partial. Expanding omitted context requires `options.loadDiffFiles`; it cannot be recovered from the patch alone. For an always-available copy action, pass complete file pairs instead.

## Scope and accessibility

This component is a read-only single-file viewer. Multi-file review coordination and editing are separate future surfaces. Pierre's WorkerPoolContextProvider and Virtualizer providers can be used around the viewer; `disableWorkerPool`, `metrics`, and `prerenderedHTML` are forwarded for advanced integrations. Match any prerendered HTML to the current diff and Erbium's rendering options; server rendering without prerendered content initially supplies the shell.

The whole viewer uses LTR direction, even within an RTL application. The content is a named, focusable region for scrolling, and copy feedback uses the shared clipboard announcements. Header controls use Erbium primitives. The default height is bounded; customize it through `DiffViewContent`. Review application-provided annotations and gutter actions for keyboard access and accessible names.
