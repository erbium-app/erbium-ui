import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
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

export default function ContextMenuIconsExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
        <span className="hidden pointer-fine:inline-block">Right click here</span>
        <span className="hidden pointer-coarse:inline-block">Long press here</span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuList>
          <ContextMenuGroup>
            <CopyButton value="Erbium UI" render={<ContextMenuItem />}>
              <CopyButtonIcon />
              <span>Copy</span>
            </CopyButton>
            <ContextMenuItem>
              <Icon name="scissors" />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <Icon name="clipboard-paste" />
              Paste
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
}
