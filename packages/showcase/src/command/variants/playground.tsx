import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandItem,
  Command,
} from "@erbium/ui/components/command";

const commandGroups = [
  {
    items: [
      { content: <> Open file </>, disabled: false, label: "Open file" },
      { content: <> Open settings </>, disabled: false, label: "Open settings" },
    ],
    label: "Actions",
  },
];

export const defaultProps = {
  disabled: false,
  placeholder: "Search commands",
} satisfies { placeholder: string; disabled: boolean };

export default function CommandPlaygroundExample(
  args: { placeholder: string; disabled: boolean } = defaultProps,
) {
  return (
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
}
