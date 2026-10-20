import { Button, ButtonShortcut } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";

const KbdButton = () => (
  <div className="flex flex-wrap items-center gap-group">
    <Button variant="outline" size="sm">
      Accept
      <ButtonShortcut hotkey="Enter" />
    </Button>
    <Button variant="outline" size="sm">
      Cancel
      <ButtonShortcut hotkey="Escape" />
    </Button>
    <DirectionProvider direction="rtl">
      <div dir="rtl">
        <Button variant="outline" size="sm">
          قبول
          <ButtonShortcut hotkey="Enter" />
        </Button>
      </div>
    </DirectionProvider>
  </div>
);

export default KbdButton;
