import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@erbium/ui/components/autocomplete";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Grape", value: "grape" },
  { label: "Orange", value: "orange" },
];

const meta = {
  title: "UI/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LocalFiltering: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput aria-label="Search fruits" placeholder="Search fruits..." showClear />
      <AutocompletePopup>
        <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
        <AutocompleteList>
          {(fruit) => (
            <AutocompleteItem key={fruit.value} value={fruit}>
              {fruit.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  ),
};

export const EmptyResults: Story = {
  render: () => (
    <Autocomplete items={[]}>
      <AutocompleteInput aria-label="Search cities" placeholder="Search cities..." />
      <AutocompletePopup>
        <AutocompleteEmpty>No matching cities.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => <AutocompleteItem value={item}>{String(item)}</AutocompleteItem>}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  ),
};
