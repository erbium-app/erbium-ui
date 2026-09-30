// @ts-nocheck
import { Button, ButtonShortcut } from "../components/button";
import { DirectionProvider } from "../components/direction";

export default function KbdButton() {
  return (
    <div className="flex flex-wrap items-center gap-4">
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
}
