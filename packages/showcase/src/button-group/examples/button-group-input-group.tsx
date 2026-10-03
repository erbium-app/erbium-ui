import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import AudioLinesIcon from "@hugeicons/core-free-icons/AudioLinesIcon";
import PlusIcon from "@hugeicons/core-free-icons/PlusIcon";

import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";

export default function ButtonGroupInputGroup() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);

  return (
    <ButtonGroup className="[--radius:9999rem]">
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput
            placeholder={voiceEnabled ? "Record and send audio..." : "Send a message..."}
            disabled={voiceEnabled}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    size="icon-xs"
                    data-active={voiceEnabled}
                    className="data-[active=true]:bg-warning-soft data-[active=true]:text-warning-soft-foreground"
                    aria-pressed={voiceEnabled}
                  >
                    <HugeiconsIcon icon={AudioLinesIcon} />
                  </InputGroupButton>
                }
              />
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}
