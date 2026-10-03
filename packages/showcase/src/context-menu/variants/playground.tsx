import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@erbium/ui/components/context-menu";

const Example = (args: {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
}) => (
  <ContextMenu>
    <ContextMenuTrigger className="rounded-xl border border-dashed bg-surface-panel p-8">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent side={args.side} align={args.align}>
      <ContextMenuItem>Copy</ContextMenuItem>
      <ContextMenuItem>Paste</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

export default Example;
