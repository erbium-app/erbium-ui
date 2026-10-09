import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@erbium/ui/components/context-menu";

export function ContextMenuGroups() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-caption">
        <span className="hidden pointer-fine:inline-block">Right click here</span>
        <span className="hidden pointer-coarse:inline-block">Long press here</span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>File</ContextMenuLabel>
          <ContextMenuItem>
            New File
            <ContextMenuShortcut hotkey="Mod+N" />
          </ContextMenuItem>
          <ContextMenuItem>
            Open File
            <ContextMenuShortcut hotkey="Mod+O" />
          </ContextMenuItem>
          <ContextMenuItem>
            Save
            <ContextMenuShortcut hotkey="Mod+S" />
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Edit</ContextMenuLabel>
          <ContextMenuItem>
            Undo
            <ContextMenuShortcut hotkey="Mod+Z" />
          </ContextMenuItem>
          <ContextMenuItem>
            Redo
            <ContextMenuShortcut hotkey="Shift+Mod+Z" />
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut hotkey="Mod+X" />
          </ContextMenuItem>
          <CopyButton value="Erbium UI" render={<ContextMenuItem />}>
            <CopyButtonIcon />
            <span>Copy</span>
            <ContextMenuShortcut hotkey="Mod+C" />
          </CopyButton>
          <ContextMenuItem>
            Paste
            <ContextMenuShortcut hotkey="Mod+V" />
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="error">
            Delete
            <ContextMenuShortcut hotkey="Backspace" />
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
