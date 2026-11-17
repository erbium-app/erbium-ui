import { Icon } from "@erbium/ui/components/icon";

import { FruitAutocomplete } from "../helpers";

export default function AutocompleteWithStartAddonExample() {
  return <FruitAutocomplete startAddon={<Icon name="search-01" />} />;
}
