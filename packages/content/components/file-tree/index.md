---
title: "File Tree"
description: "Composable, virtualized file navigation using Pierre and Erbium surfaces."
---

## Usage

```tsx
import { FileTree, useFileTree } from "@erbium/ui/blocks/file-tree";

const { model } = useFileTree({
  paths: ["src/app.tsx", "package.json", "empty/"],
  initialExpansion: "open",
  onSelectionChange: setSelectedPaths,
});

<FileTree model={model} aria-label="Workspace files" />;
```

Paths infer the directory hierarchy. A trailing slash represents an explicit directory, including an empty one. Pierre handles virtualized rows, keyboard navigation, expansion, and selection; Erbium owns typography, colors, density, and the sidebar navigation surface.

## Model lifecycle

`useFileTree` creates one stable model and cleans it up on unmount. Options and callbacks are construction-time configuration; changes to the options object do not update the model. Keep callbacks independent of stale render state. Update files through `model.add`, `remove`, `move`, `batch`, or `resetPaths`; update status through `setGitStatus`. Use item handles from `model.getItem(path)` for expansion or selection. Read selection through Pierre’s `useFileTreeSelection` hook if needed.

Search uses `model.openSearch`, `setSearch`, and search-match navigation. Enable built-in search with `search: true`. Renaming and drag/drop are opt-in model settings; persistence and filesystem authorization belong to the consumer. Lazy directory loading can compose around directory handles and subscriptions; FileTree does not fetch files itself.

## Composition

```tsx
<FileTree model={model} aria-label="Project files">
  <FileTreeHeader>
    <FileTreeTitle>Project files</FileTreeTitle>
    <FileTreeActions>
      <Button onClick={() => model.openSearch()}>Find file</Button>
    </FileTreeActions>
  </FileTreeHeader>
  <FileTreeContent className="h-96" />
</FileTree>
```

The default is a content-only tree, bounded to a 20rem viewport. Supplying children replaces that layout. Header, title, and actions follow the sidebar’s compact navigation styling. Place the tree inside `SidebarGroupContent` to compose it with other navigation. Give the content enough height for virtualization; customize its height through `FileTreeContent`. `renderContextMenu` and `preloadedData` forward Pierre’s React composition and SSR contracts. Supply accessible names and keyboard behavior for custom menu controls. Pass a tree label on `FileTreeContent` when customizing the inner tree.

## Design ownership

There are no theme, injected CSS, density, or row-height options. The tree follows the application’s scheme and sidebar surface, hover, and active colors, with neutral file icons and semantic focus and Git-status colors. The model remains Pierre-compatible so downstream developers can use its typed operations without a second controller API.
