import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Switch } from "@erbium/ui/components/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import MoonIcon from "@hugeicons/core-free-icons/MoonIcon";
import Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon";
import XIcon from "@hugeicons/core-free-icons/XIcon";

export default function SwitchIcons() {
  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal">
        <Switch
          startIcon={<HugeiconsIcon icon={CheckIcon} />}
          endIcon={<HugeiconsIcon icon={XIcon} />}
          defaultChecked
        />
        <FieldLabel>Track icons</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch thumbIcon={<HugeiconsIcon icon={Sun01Icon} />} />
        <FieldLabel>Thumb icon</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch
          startIcon={<HugeiconsIcon icon={MoonIcon} />}
          endIcon={<HugeiconsIcon icon={Sun01Icon} />}
        />
        <FieldLabel>Dark mode</FieldLabel>
      </Field>
    </div>
  );
}
