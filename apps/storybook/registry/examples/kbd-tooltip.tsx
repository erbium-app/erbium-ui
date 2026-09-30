// @ts-nocheck
import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Kbd } from "../components/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";

export default function KbdTooltip() {
  return (
    <div className="flex flex-wrap gap-4">
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
