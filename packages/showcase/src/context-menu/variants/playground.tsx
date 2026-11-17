import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuList,
} from "@erbium/ui/components/context-menu";

export const defaultProps = { align: "start", side: "bottom" } satisfies {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
};

export default function ContextMenuPlaygroundExample(
  args: {
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
  } = defaultProps,
) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-xl border border-dashed bg-surface-panel p-8">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent side={args.side} align={args.align}>
        <ContextMenuList>
          <CopyButton value="Erbium UI" render={<ContextMenuItem />}>
            <CopyButtonIcon />
            <span>Copy</span>
          </CopyButton>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuList>
      </ContextMenuContent>
    </ContextMenu>
  );
}
