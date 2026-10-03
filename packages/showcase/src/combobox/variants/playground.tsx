import {
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@erbium/ui/components/combobox";
import { Combobox } from "@erbium/ui/components/combobox";

const Example = (args: {
  placeholder: string;
  disabled: boolean;
  showTrigger: boolean;
  showClear: boolean;
  autoHighlight: boolean;
}) => (
  <Combobox items={["React", "Vue", "Svelte"]} autoHighlight={args.autoHighlight}>
    <ComboboxInput
      placeholder={args.placeholder}
      disabled={args.disabled}
      showTrigger={args.showTrigger}
      showClear={args.showClear}
    />
    <ComboboxContent>
      <ComboboxEmpty>No results.</ComboboxEmpty>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
);

export default Example;
