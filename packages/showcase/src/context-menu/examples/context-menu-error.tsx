import { Icon } from "@erbium/ui/components/icon";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuList,
} from "@erbium/ui/components/context-menu";

export const ContextMenuError = () => (
  <ContextMenu>
    <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
      <span className="hidden pointer-fine:inline-block">Right click here</span>
      <span className="hidden pointer-coarse:inline-block">Long press here</span>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuList>
        <ContextMenuGroup>
          <ContextMenuItem>
            <Icon name="pencil" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <Icon name="share-01" />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="error">
            <Icon name="trash" />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuList>
    </ContextMenuContent>
  </ContextMenu>
);
