import { HugeiconsIcon } from "@hugeicons/react";
import CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";
import CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";
import Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";
import SmileIcon from "@hugeicons/core-free-icons/SmileIcon";
import UserIcon from "@hugeicons/core-free-icons/UserIcon";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@erbium/ui/components/command";

export default function CommandDemo() {
  return (
    <Command className="md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <HugeiconsIcon icon={Calendar01Icon} />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <HugeiconsIcon icon={SmileIcon} />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <HugeiconsIcon icon={CalculatorIcon} />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <HugeiconsIcon icon={UserIcon} />
            <span>Profile</span>
            <CommandShortcut hotkey="Mod+P" />
          </CommandItem>
          <CommandItem>
            <HugeiconsIcon icon={CreditCardIcon} />
            <span>Billing</span>
            <CommandShortcut hotkey="Mod+B" />
          </CommandItem>
          <CommandItem>
            <HugeiconsIcon icon={Settings01Icon} />
            <span>Settings</span>
            <CommandShortcut hotkey="Mod+S" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
