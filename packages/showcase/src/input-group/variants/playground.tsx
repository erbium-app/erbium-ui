import { Icon } from "@erbium/ui/components/icon";
import {
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroup,
} from "@erbium/ui/components/input-group";

const Example = (args: {
  align: "inline-start" | "inline-end" | "block-start" | "block-end";
  placeholder: string;
  buttonSize: "xs" | "sm" | "icon-xs" | "icon-sm";
  buttonVariant: "default" | "secondary" | "outline" | "ghost" | "error" | "link";
  className: string;
}) => (
  <InputGroup className={`w-72 ${args.className}`}>
    <InputGroupAddon align={args.align}>
      <Icon name="search-01" aria-hidden="true" />
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
