import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@erbium/ui/components/popover";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = { align: "center", defaultOpen: false, side: "bottom" } satisfies {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
};

export default function PopoverPlaygroundExample(
  args: {
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
    defaultOpen: boolean;
  } = defaultProps,
) {
  return (
    <Popover key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent side={args.side} align={args.align}>
        <PopoverHeader>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverDescription>Popover description.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
