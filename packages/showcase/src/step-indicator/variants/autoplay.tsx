import { useState } from "react";
import { StepIndicator } from "@erbium/ui/blocks/step-indicator";
import { Button } from "@erbium/ui/components/button";
import { Card, CardContent } from "@erbium/ui/components/card";
import { Icon } from "@erbium/ui/components/icon";
import { StatefulIcon } from "@erbium/ui/components/stateful-icon";

const folders = ["Inbox", "Drafts", "Sent", "Archive"];

const Example = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="size-40">
        <CardContent className="flex min-h-0 flex-1 items-center justify-center">
          <span className="text-title font-semibold">{folders[index]}</span>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          onClick={() => {
            setPaused(!paused);
          }}
        >
          <StatefulIcon
            state={paused ? "play" : "pause"}
            icons={{ pause: <Icon name="pause" />, play: <Icon name="play" /> }}
          />
          <span className="sr-only">{paused ? "Play folders" : "Pause folders"}</span>
        </Button>
        <StepIndicator
          variant="dots"
          count={folders.length}
          value={index}
          onValueChange={setIndex}
          autoplay={{ duration: 3000, paused }}
          aria-label="Folders"
        />
      </div>
    </div>
  );
};

export default Example;
