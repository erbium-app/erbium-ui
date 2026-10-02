// @ts-nocheck
import { Field, FieldLabel } from "../components/field";
import { Switch } from "../components/switch";
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
          id="icons-track"
          startIcon={<HugeiconsIcon icon={CheckIcon} />}
          endIcon={<HugeiconsIcon icon={XIcon} />}
          defaultChecked
        />
        <FieldLabel htmlFor="icons-track">Track icons</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="icons-thumb" thumbIcon={<HugeiconsIcon icon={Sun01Icon} />} />
        <FieldLabel htmlFor="icons-thumb">Thumb icon</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch
          id="icons-theme"
          startIcon={<HugeiconsIcon icon={MoonIcon} />}
          endIcon={<HugeiconsIcon icon={Sun01Icon} />}
        />
        <FieldLabel htmlFor="icons-theme">Dark mode</FieldLabel>
      </Field>
    </div>
  );
}
