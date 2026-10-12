import { FileTree as PierreTree, useFileTree as usePierreTree } from "@pierre/trees/react";
import type { FileTreeProps as PierreTreeProps } from "@pierre/trees/react";
import type { FileTreeOptions as PierreTreeOptions } from "@pierre/trees";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";
import { DirectionProvider } from "../components/direction";
import { treeThemeCSS } from "../lib/tree-theme";
import { cn } from "../lib/utils";

type FileTreeOptions = Omit<
  PierreTreeOptions,
  | "unsafeCSS"
  | "composition"
  | "searchFakeFocus"
  | "density"
  | "itemHeight"
  | "paths"
  | "preparedInput"
> & { paths: readonly string[] };
function useFileTree(options: FileTreeOptions) {
  // Match the sidebar’s 1.75rem control height; Pierre needs pixels for virtualization.
  return usePierreTree({ ...options, density: "default", itemHeight: 28, unsafeCSS: treeThemeCSS });
}
type FileTreeProps = Omit<ComponentProps<"div">, "children" | "dangerouslySetInnerHTML" | "dir"> &
  Pick<PierreTreeProps, "model" | "preloadedData" | "renderContextMenu"> & { children?: ReactNode };
const TreeContext = createContext<Pick<
  PierreTreeProps,
  "model" | "preloadedData" | "renderContextMenu"
> | null>(null);
function FileTree({
  model,
  preloadedData,
  renderContextMenu,
  children,
  className,
  ...props
}: FileTreeProps) {
  // File names and paths are code; the tree stays LTR even on RTL pages.
  return (
    <DirectionProvider direction="ltr">
      <TreeContext value={{ model, preloadedData, renderContextMenu }}>
        <div
          role="region"
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
        </div>
      </TreeContext>
    </DirectionProvider>
  );
}
function FileTreeHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="file-tree-header"
      className={cn(
        "flex min-h-control items-center justify-between gap-related px-2 py-1",
        className,
      )}
    />
  );
}
function FileTreeTitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      {...props}
      data-slot="file-tree-title"
      className={cn(
        "min-w-0 truncate text-control-sm font-medium text-sidebar-foreground/70",
        className,
      )}
    />
  );
}
function FileTreeActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="file-tree-actions"
      className={cn("flex shrink-0 items-center gap-related", className)}
    />
  );
}
function FileTreeContent({
  className,
  ...props
}: Omit<PierreTreeProps, "model" | "header" | "preloadedData" | "renderContextMenu">) {
  const context = use(TreeContext);
  if (!context) throw new Error("File tree content must be inside FileTree.");
  return (
    <PierreTree
      {...props}
      {...context}
      data-slot="file-tree-content"
      className={cn("block h-80 min-w-0", className)}
    />
  );
}
export { FileTree, useFileTree, FileTreeHeader, FileTreeTitle, FileTreeActions, FileTreeContent };
export type { FileTreeProps, FileTreeOptions };
