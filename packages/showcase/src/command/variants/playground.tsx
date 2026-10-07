import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandItem,
} from "@erbium/ui/components/command";
import { Command } from "@erbium/ui/components/command";

const commandGroups = [
  {
    label: "Actions",
    items: [
      { label: "Open file", disabled: false, content: <> Open file </> },
      { label: "Open settings", disabled: false, content: <> Open settings </> },
    ],
  },
];

const Example = (args: { placeholder: string; disabled: boolean }) => (
  <Command items={commandGroups} className="w-72">
    <CommandInput
      aria-label="Search commands"
      placeholder={args.placeholder}
      disabled={args.disabled}
    />
    <CommandEmpty>No results.</CommandEmpty>
    <CommandList>
      {(group: (typeof commandGroups)[number]) => (
        <CommandGroup key={group.label} items={group.items}>
          <CommandGroupLabel>{group.label}</CommandGroupLabel>
          <CommandCollection>
            {(item: (typeof commandGroups)[number]["items"][number]) => (
              <CommandItem key={item.label} value={item} disabled={item.disabled}>
                {item.content}
              </CommandItem>
            )}
          </CommandCollection>
        </CommandGroup>
      )}
    </CommandList>
  </Command>
);

export default Example;
