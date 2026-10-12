import type { ComponentProps, ReactNode } from "react";
import { DirectionProvider } from "../components/direction";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../components/empty";
import { Separator } from "../components/separator";
import { Spinner } from "../components/spinner";
import { cn } from "../lib/utils";
import { CopyButton } from "./copy-button";
import type { CopyButtonProps } from "./copy-button";

// Shared chrome for blocks that present source code: the surface, header, title,
// actions, and the scrollable body. Code is direction-neutral, so every panel
// stays LTR even on RTL pages.
const codePanelSurface = "min-w-0 w-full overflow-hidden rounded-xl surface-panel text-foreground";
const codePanelHeader = "flex min-h-10 items-center justify-between gap-related px-3 py-1.5";
const codePanelTitle =
  "inline-flex min-w-0 items-center gap-related text-metadata font-medium text-muted-foreground";
const codePanelFocusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

type CodePanelProps = Omit<ComponentProps<"div">, "dir" | "dangerouslySetInnerHTML">;

function CodePanel({ className, ...props }: CodePanelProps) {
  return (
    <DirectionProvider direction="ltr">
      <div
        data-slot="code-panel"
        {...props}
        dir="ltr"
        className={cn(codePanelSurface, className)}
      />
    </DirectionProvider>
  );
}

function CodePanelHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <>
      <div
        data-slot="code-panel-header"
        {...props}
        className={cn(codePanelHeader, "flex-wrap", className)}
      />
      <Separator variant="full" />
    </>
  );
}

function CodePanelTitle({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="code-panel-title" {...props} className={cn(codePanelTitle, className)} />;
}

function CodePanelActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="code-panel-actions"
      {...props}
      className={cn("flex shrink-0 items-center gap-related", className)}
    />
  );
}

function CodePanelCopyButton({ children, ...props }: CopyButtonProps) {
  return (
    <CopyButton variant="ghost" size={children == null ? "icon-xs" : "xs"} {...props}>
      {children}
    </CopyButton>
  );
}

type CodePanelContentProps = Omit<ComponentProps<"div">, "dir" | "dangerouslySetInnerHTML"> & {
  /** Shown above the rendered code until the renderer has produced output. */
  loading?: boolean;
  /** Replaces the body when there is nothing to render. */
  empty?: ReactNode;
};

function CodePanelContent({
  loading,
  empty,
  children,
  className,
  ...props
}: CodePanelContentProps) {
  const showEmpty = empty != null && empty !== false;
  return (
    <div
      role="region"
      tabIndex={0}
      aria-busy={loading || undefined}
      data-slot="code-panel-content"
      {...props}
      dir="ltr"
      className={cn(
        "max-h-120 min-w-0 overflow-auto bg-surface-panel",
        codePanelFocusRing,
        className,
      )}
    >
      {showEmpty ? (
        empty
      ) : (
        <>
          {loading ? (
            <div className="flex min-h-32 items-center justify-center text-muted-foreground">
              <Spinner className="size-5" />
            </div>
          ) : null}
          {children}
        </>
      )}
    </div>
  );
}

function CodePanelEmpty({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <Empty className="rounded-none border-0 p-panel sm:p-panel">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
    </Empty>
  );
}

export {
  CodePanel,
  CodePanelHeader,
  CodePanelTitle,
  CodePanelActions,
  CodePanelCopyButton,
  CodePanelContent,
  CodePanelEmpty,
  codePanelFocusRing,
  codePanelHeader,
  codePanelSurface,
  codePanelTitle,
};
export type { CodePanelProps, CodePanelContentProps };
