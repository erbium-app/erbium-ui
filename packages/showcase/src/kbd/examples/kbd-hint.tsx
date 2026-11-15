import * as React from "react";
import { Button, ButtonShortcut } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";
import { Icon } from "@erbium/ui/components/icon";
import { Kbd } from "@erbium/ui/components/kbd";

const KbdHintExample = () => {
  const [action, setAction] = React.useState("None yet");

  return (
    <div className="flex flex-col items-start gap-group">
      {/* Hints open above the controls, so the row keeps room for them. */}
      <div className="flex flex-wrap items-center gap-group pt-8">
        <Button
          variant="outline"
          size="sm"
          hotkey="Mod+S"
          onClick={() => {
            setAction("Save");
          }}
        >
          Save
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          hotkey="Mod+Shift+D"
          aria-label="Duplicate"
          onClick={() => {
            setAction("Duplicate");
          }}
        >
          <Icon name="copy" />
        </Button>
        <Button
          size="sm"
          hotkey="Mod+Enter"
          onClick={() => {
            setAction("Publish");
          }}
        >
          Publish
          <ButtonShortcut />
        </Button>
        <DirectionProvider direction="rtl">
          <div dir="rtl">
            <Button
              variant="outline"
              size="sm"
              hotkey="Mod+Shift+S"
              onClick={() => {
                setAction("ذخیره همه");
              }}
            >
              ذخیره همه
            </Button>
          </div>
        </DirectionProvider>
      </div>
      <p className="text-caption text-muted-foreground">
        Hold <Kbd>Mod</Kbd> to reveal the shortcuts. Last action: {action}
      </p>
    </div>
  );
};

export default KbdHintExample;
