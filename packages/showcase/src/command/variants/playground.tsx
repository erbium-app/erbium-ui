import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@erbium/ui/components/command";
import { Command } from "@erbium/ui/components/command";

const Example = (args: { placeholder: string; disabled: boolean }) => (
  <Command className="w-72">
    <CommandInput placeholder={args.placeholder} disabled={args.disabled} />
    <CommandList>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandGroup heading="Actions">
        <CommandItem>Open file</CommandItem>
        <CommandItem>Open settings</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);

export default Example;
