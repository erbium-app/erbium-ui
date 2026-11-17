import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = { align: "start", defaultOpen: false, side: "bottom" } satisfies {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
};

export default function DropdownMenuPlaygroundExample(
  args: {
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
    defaultOpen: boolean;
  } = defaultProps,
) {
  return (
    <DropdownMenu key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
      <DropdownMenuContent side={args.side} align={args.align}>
        <DropdownMenuList>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
