import { useState } from "react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuList,
  DropdownMenuCheckboxItem,
} from "@erbium/ui/components/dropdown-menu";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuList,
  ContextMenuCheckboxItem,
} from "@erbium/ui/components/context-menu";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarList,
  MenubarCheckboxItem,
} from "@erbium/ui/components/menubar";

export default function CheckboxStateExample() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="grid gap-group">
      <Field orientation="horizontal">
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        <FieldLabel>Show details</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox indeterminate />
        <FieldLabel>Mixed selection</FieldLabel>
      </Field>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          View options
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuList>
            <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Show details
            </DropdownMenuCheckboxItem>
          </DropdownMenuList>
        </DropdownMenuContent>
      </DropdownMenu>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarList>
              <MenubarCheckboxItem checked={checked} onCheckedChange={setChecked}>
                Show details
              </MenubarCheckboxItem>
            </MenubarList>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <ContextMenu>
        <ContextMenuTrigger className="rounded-lg border border-dashed p-panel text-control">
          Right-click for view options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuList>
            <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Show details
            </ContextMenuCheckboxItem>
          </ContextMenuList>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
