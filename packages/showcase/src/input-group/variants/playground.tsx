import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";
import { InputGroup } from "@erbium/ui/components/input-group";

const Example = (args: {
  align: "inline-start" | "inline-end" | "block-start" | "block-end";
  placeholder: string;
  buttonSize: "xs" | "sm" | "icon-xs" | "icon-sm";
  buttonVariant: "default" | "secondary" | "outline" | "ghost" | "error" | "link";
  className: string;
}) => (
  <InputGroup className={`w-72 ${args.className}`}>
    <InputGroupAddon align={args.align}>
      <HugeiconsIcon icon={Search01Icon} aria-hidden="true" />
    </InputGroupAddon>
    <InputGroupInput placeholder={args.placeholder} />
    <InputGroupAddon align="inline-end">
      <InputGroupButton size={args.buttonSize} variant={args.buttonVariant}>
        Go
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
);

export default Example;
