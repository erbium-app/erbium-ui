import { Button } from "@erbium/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@erbium/ui/components/popover";

export default function PopoverBasicExample() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-fit" />}>
        Open Popover
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
