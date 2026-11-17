import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarList,
} from "@erbium/ui/components/menubar";

export const defaultProps = {
  align: "start",
  className: "",
  disabled: false,
  itemVariant: "default",
} satisfies {
  className: string;
  align: "start" | "center" | "end";
  itemVariant: "default" | "error";
  disabled: boolean;
};

export default function MenubarPlaygroundExample(
  args: {
    className: string;
    align: "start" | "center" | "end";
    itemVariant: "default" | "error";
    disabled: boolean;
  } = defaultProps,
) {
  return (
    <Menubar className={args.className}>
      <MenubarMenu>
        <MenubarTrigger disabled={args.disabled}>File</MenubarTrigger>
        <MenubarContent align={args.align}>
          <MenubarList>
            <MenubarItem variant={args.itemVariant}>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarList>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
