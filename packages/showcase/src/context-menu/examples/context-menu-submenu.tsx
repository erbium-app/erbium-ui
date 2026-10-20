import { CopyButton, CopyButtonIcon } from "@erbium/ui/blocks/copy-button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuList,
} from "@erbium/ui/components/context-menu";

export const ContextMenuSubmenu = () => (
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
            <ContextMenuShortcut hotkey="Mod+C" />
          </CopyButton>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut hotkey="Mod+X" />
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuList>
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="error">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuList>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuList>
    </ContextMenuContent>
  </ContextMenu>
);
