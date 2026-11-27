import * as React from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Button, ButtonShortcut } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";
import { Kbd } from "@erbium/ui/components/kbd";

export default function KbdHintExample() {
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
        <CopyButton
          value="https://ui.erbium.app"
          variant="outline"
          size="icon-sm"
          hotkey="Mod+Shift+D"
          aria-label="Copy link"
          onClick={() => {
            setAction("Copy link");
          }}
        />
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
}
