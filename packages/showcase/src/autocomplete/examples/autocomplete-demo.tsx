import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@erbium/ui/components/autocomplete";

const autocompleteItems = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Grape", value: "grape" },
  { label: "Orange", value: "orange" },
];

export default function AutocompleteShowcaseExample() {
  return (
    <div className="w-full max-w-72">
      <Autocomplete items={autocompleteItems}>
        <AutocompleteInput aria-label="Search fruits" placeholder="Search fruits…" />
        <AutocompletePopup>
          <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item: (typeof autocompleteItems)[number]) => (
              <AutocompleteItem key={item.value} value={item}>
                {item.label}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    </div>
  );
}
