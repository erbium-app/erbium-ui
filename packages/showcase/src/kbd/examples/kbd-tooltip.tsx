import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Kbd } from "@erbium/ui/components/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

export default function KbdTooltipExample() {
  return (
    <div className="flex flex-wrap gap-group">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button size="sm" variant="outline">
                Save
              </Button>
            }
          />
          <TooltipContent>
            Save Changes <Kbd hotkey="S" />
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button size="sm" variant="outline">
                Print
              </Button>
            }
          />
          <TooltipContent>
            Print Document <Kbd hotkey="Mod+P" />
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
}
