---
title: "File View"
description: "Composable source-file viewing with Vitesse highlighting, line selection, and annotations."
---

## Usage

```tsx
import { FileView } from "@erbium/ui/blocks/file-view";

<FileView file={{ name: "app.ts", contents: source }} />;
```

`FileView` wraps the `File` component from Pierre's [Diffs](https://diffs.com) (`@pierre/diffs`) and highlights with Pierre's [Highlights](https://diffs.com/docs#highlights) (`@pierre/highlights`), the highlighter Code Block and Diff View use too. Where WebAssembly is unavailable, highlighting falls back to Shiki's JavaScript engine.

FileView is a read-only source-file viewer. Use CodeBlock for message snippets and commands, FileView for opened source files, and DiffView for comparisons. The default layout shows the filename and an exact-source copy action. Empty files keep the same panel surface and show the shared `Empty` state with an “Empty file” title.

Erbium owns Vitesse light/dark themes, typography, surfaces, and the header. The viewer inherits the app’s color scheme and uses LTR direction. Filenames infer the language; `file.lang` can override it. Keep file objects stable, and update `cacheKey` when contents change if using worker caching.

## Composition

```tsx
<FileView file={file} options={{ overflow: "wrap" }}>
  <FileViewHeader>
    <FileViewTitle />
    <FileViewActions>
      <FileViewCopyButton />
    </FileViewActions>
  </FileViewHeader>
  <FileViewContent className="max-h-80" />
</FileView>
```

Supplying children replaces the default layout. Parts read the file from context. Title children override the filename; copy always preserves raw contents. The content is a named, focusable scrolling region with a bounded default height.

## Selection and annotations

`options` retains Pierre’s typed read-only file settings and callbacks, including wrapping, line numbers, and selection. Theme, injected CSS, and header rendering belong to Erbium. Use `lineAnnotations`, `renderAnnotation`, and `renderGutterUtility` to compose review UI. Controls Pierre draws itself, such as the gutter button from `enableGutterUtility`, use Erbium icons, as they do in Diff View. Annotation metadata is generic; `lineNumber` is one-based (zero attaches above the file).

```tsx
<FileView
  file={file}
  selectedLines={selection}
  options={{ enableLineSelection: true, onLineSelected: setSelection }}
  lineAnnotations={comments}
  renderAnnotation={({ metadata }) => <ReviewComment comment={metadata} />}
/>
```

Omit `selectedLines` for uncontrolled selection; use a range or null for controlled selection. Annotation actions, persistence, loading, and search workflows belong to the consumer. Ensure custom controls have accessible names and keyboard behavior.

## Advanced integration

Pierre’s worker-pool and virtualizer providers can wrap FileView just as they can DiffView. `metrics`, `disableWorkerPool`, and `prerenderedHTML` are forwarded. Match prerendered HTML to the file and Erbium rendering options. FileView does not configure workers or virtualizer scroll ownership automatically, and does not expose editing.
