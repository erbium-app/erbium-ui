import { FileTree as PierreTree, useFileTree as usePierreTree } from "@pierre/trees/react";
import type { FileTreeProps as PierreTreeProps } from "@pierre/trees/react";
import type { FileTreeOptions as PierreTreeOptions } from "@pierre/trees";
import { createContext, use, useMemo } from "react";
import type { ComponentProps, ReactNode } from "react";
import { DirectionProvider } from "../components/direction";
import { fileTreeIcons } from "../lib/file-icons";
import { treeThemeCSS } from "../lib/tree-theme";
import { cn } from "../lib/utils";

type FileTreeOptions = Omit<
  PierreTreeOptions,
  | "unsafeCSS"
  | "composition"
  | "searchFakeFocus"
  | "density"
  | "itemHeight"
  | "icons"
  | "paths"
  | "preparedInput"
> & { paths: readonly string[] };

const useFileTree = (options: FileTreeOptions) =>
  // Match the sidebar’s 1.75rem control height; Pierre needs pixels for virtualization.
  usePierreTree({
    ...options,
    density: "default",
    icons: fileTreeIcons,
    itemHeight: 28,
    unsafeCSS: treeThemeCSS,
  });

type FileTreeProps = Omit<ComponentProps<"div">, "children" | "dangerouslySetInnerHTML" | "dir"> &
  Pick<PierreTreeProps, "model" | "preloadedData" | "renderContextMenu"> & { children?: ReactNode };

const TreeContext = createContext<Pick<
  PierreTreeProps,
  "model" | "preloadedData" | "renderContextMenu"
> | null>(null);

const FileTreeContent = ({
  className,
  ...props
}: Omit<PierreTreeProps, "model" | "header" | "preloadedData" | "renderContextMenu">) => {
  const context = use(TreeContext);

  if (!context) {
    throw new Error("File tree content must be inside FileTree.");
  }

  // The host keeps its fixed height while Pierre attaches the tree's shadow root, so the rows
  // land in place without a loading state.
  return (
    <PierreTree
      {...props}
      {...context}
      data-slot="file-tree-content"
      className={cn("block h-80 min-w-0", className)}
    />
  );
};

const FileTree = ({
  model,
  preloadedData,
  renderContextMenu,
  children,
  className,
  ...props
}: FileTreeProps) => {
  const context = useMemo(
    () => ({ model, preloadedData, renderContextMenu }),
    [model, preloadedData, renderContextMenu],
  );

  return (
    // File names and paths are code; the tree stays LTR even on RTL pages.
    <DirectionProvider direction="ltr">
      <TreeContext value={context}>
        <section
          aria-label="Files"
          {...props}
          dir="ltr"
          data-slot="file-tree"
          className={cn(
            "min-w-0 w-full overflow-hidden text-sidebar-foreground group-data-[collapsible=icon]:hidden",
            className,
          )}
        >
          {children ?? <FileTreeContent />}
        </section>
      </TreeContext>
    </DirectionProvider>
  );
};

const FileTreeHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    {...props}
    data-slot="file-tree-header"
    className={cn(
      "flex min-h-control items-center justify-between gap-related px-2 py-1",
      className,
    )}
  />
);

const FileTreeTitle = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    {...props}
    data-slot="file-tree-title"
    className={cn("min-w-0 truncate text-control-sm text-muted-foreground", className)}
  />
);

const FileTreeActions = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    {...props}
    data-slot="file-tree-actions"
    className={cn("flex shrink-0 items-center gap-related", className)}
  />
);

export { FileTree, useFileTree, FileTreeHeader, FileTreeTitle, FileTreeActions, FileTreeContent };

export type { FileTreeProps, FileTreeOptions };
