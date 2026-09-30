import { Label } from "@erbium/ui/components/label";
import { Switch } from "@erbium/ui/components/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import MoonIcon from "@hugeicons/core-free-icons/MoonIcon";
import Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon";
import XIcon from "@hugeicons/core-free-icons/XIcon";

export default function SwitchIcons() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch
          id="icons-track"
          startIcon={<HugeiconsIcon icon={CheckIcon} />}
          endIcon={<HugeiconsIcon icon={XIcon} />}
          defaultChecked
        />
        <Label htmlFor="icons-track">Track icons</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="icons-thumb" thumbIcon={<HugeiconsIcon icon={Sun01Icon} />} />
        <Label htmlFor="icons-thumb">Thumb icon</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="icons-theme"
          startIcon={<HugeiconsIcon icon={MoonIcon} />}
          endIcon={<HugeiconsIcon icon={Sun01Icon} />}
        />
        <Label htmlFor="icons-theme">Dark mode</Label>
      </div>
    </div>
  );
}
