import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuList,
} from "@erbium/ui/components/context-menu";

export const ContextMenuSides = () => (
  <div className="grid w-full max-w-sm grid-cols-2 gap-group">
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
        <span className="hidden pointer-fine:inline-block">Right click (top)</span>
        <span className="hidden pointer-coarse:inline-block">Long press (top)</span>
      </ContextMenuTrigger>
      <ContextMenuContent side="top">
        <ContextMenuList>
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuList>
      </ContextMenuContent>
    </ContextMenu>
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
        <span className="hidden pointer-fine:inline-block">Right click (right)</span>
        <span className="hidden pointer-coarse:inline-block">Long press (right)</span>
      </ContextMenuTrigger>
      <ContextMenuContent side="right">
        <ContextMenuList>
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuList>
      </ContextMenuContent>
    </ContextMenu>
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
        <span className="hidden pointer-fine:inline-block">Right click (bottom)</span>
        <span className="hidden pointer-coarse:inline-block">Long press (bottom)</span>
      </ContextMenuTrigger>
      <ContextMenuContent side="bottom">
        <ContextMenuList>
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuList>
      </ContextMenuContent>
    </ContextMenu>
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
        <span className="hidden pointer-fine:inline-block">Right click (left)</span>
        <span className="hidden pointer-coarse:inline-block">Long press (left)</span>
      </ContextMenuTrigger>
      <ContextMenuContent side="left">
        <ContextMenuList>
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuList>
      </ContextMenuContent>
    </ContextMenu>
  </div>
);
