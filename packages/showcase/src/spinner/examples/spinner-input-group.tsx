import { Icon } from "@erbium/ui/components/icon";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";

const SpinnerInputGroup = () => (
  <div className="grid w-full gap-group sm:grid-cols-2">
    {(["ltr", "rtl"] as const).map((direction) => (
      <div key={direction} dir={direction} className="flex w-full max-w-md flex-col gap-group">
        <InputGroup loading>
          <InputGroupInput
            placeholder={direction === "rtl" ? "ارسال پیام..." : "Send a message..."}
            disabled
          />
        </InputGroup>
        <InputGroup loading>
          <InputGroupTextarea
            placeholder={direction === "rtl" ? "ارسال پیام..." : "Send a message..."}
            disabled
          />
          <InputGroupAddon align="block-end">
            {direction === "rtl" ? "در حال اعتبارسنجی..." : "Validating..."}
            <InputGroupButton className="ms-auto" variant="default">
              <Icon name="arrow-up-01" />
              <span className="sr-only">{direction === "rtl" ? "ارسال" : "Send"}</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    ))}
  </div>
);

export default SpinnerInputGroup;
