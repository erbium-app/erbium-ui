import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import { HugeiconsIcon } from "@hugeicons/react";
import ClipboardPasteIcon from "@hugeicons/core-free-icons/ClipboardPasteIcon";
import ScissorsIcon from "@hugeicons/core-free-icons/ScissorsIcon";
import TrashIcon from "@hugeicons/core-free-icons/TrashIcon";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuList,
} from "@erbium/ui/components/context-menu";

export function ContextMenuIcons() {
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
              <HugeiconsIcon icon={ScissorsIcon} />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <HugeiconsIcon icon={ClipboardPasteIcon} />
              Paste
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="error">
              <HugeiconsIcon icon={TrashIcon} />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuList>
      </ContextMenuContent>
    </ContextMenu>
  );
}
