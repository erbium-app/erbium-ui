import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@erbium/ui/components/popover";
import { Button } from "@erbium/ui/components/button";

const Example = (args: {
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
}) => (
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

export default Example;
