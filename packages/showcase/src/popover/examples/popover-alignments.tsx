import { Button } from "@erbium/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";

export const PopoverAlignments = () => (
  <>
    <div className="flex gap-section">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>Start</PopoverTrigger>
        <PopoverContent align="start" className="w-40">
          Aligned to start
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>Center</PopoverTrigger>
        <PopoverContent align="center" className="w-40">
          Aligned to center
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>End</PopoverTrigger>
        <PopoverContent align="end" className="w-40">
          Aligned to end
        </PopoverContent>
      </Popover>
    </div>
  </>
);
