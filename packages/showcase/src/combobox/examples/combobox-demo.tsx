import * as React from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxSearchInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@erbium/ui/components/combobox";

const frameworks = [
  {
    label: "TanStack Start",
    value: "tanstack-start",
  },
  {
    label: "SvelteKit",
    value: "sveltekit",
  },
  {
    label: "Nuxt.js",
    value: "nuxt.js",
  },
  {
    label: "Remix",
    value: "remix",
  },
  {
    label: "Astro",
    value: "astro",
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<(typeof frameworks)[number] | null>(null);
  const anchor = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Combobox
      items={frameworks}
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxTrigger
        render={<Button ref={anchor} variant="outline" className="w-[200px] justify-between" />}
      >
        {value?.label ?? "Select framework..."}
      </ComboboxTrigger>
      <ComboboxContent anchor={anchor} className="w-[200px]">
        <ComboboxSearchInput aria-label="Search frameworks" placeholder="Search framework..." />
        <ComboboxEmpty className="py-6">No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(framework: (typeof frameworks)[number]) => (
            <ComboboxItem key={framework.value} value={framework}>
              {framework.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
