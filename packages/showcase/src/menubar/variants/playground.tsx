import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@erbium/ui/components/menubar";

const Example = (args: {
  className: string;
  align: "start" | "center" | "end";
  itemVariant: "default" | "error";
  disabled: boolean;
}) => (
  <Menubar className={args.className}>
    <MenubarMenu>
      <MenubarTrigger disabled={args.disabled}>File</MenubarTrigger>
      <MenubarContent align={args.align}>
        <MenubarItem variant={args.itemVariant}>New</MenubarItem>
        <MenubarItem>Open</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);

export default Example;
