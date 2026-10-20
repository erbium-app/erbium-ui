import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@erbium/ui/components/combobox";

const frameworks = ["TanStack Start", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;

export const ComboboxWithClear = () => (
  <Combobox items={frameworks} defaultValue={frameworks[0]}>
    <ComboboxInput placeholder="Select a framework" showClear />
    <ComboboxContent>
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {(item) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
);
