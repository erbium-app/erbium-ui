import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@erbium/ui/components/context-menu";

export function ContextMenuShortcuts() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">
        <span className="hidden pointer-fine:inline-block">Right click here</span>
        <span className="hidden pointer-coarse:inline-block">Long press here</span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut hotkey="Mod+[" />
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut hotkey="Mod+]" />
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut hotkey="Mod+R" />
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Save
            <ContextMenuShortcut hotkey="Mod+S" />
          </ContextMenuItem>
          <ContextMenuItem>
            Save As...
            <ContextMenuShortcut hotkey="Shift+Mod+S" />
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
