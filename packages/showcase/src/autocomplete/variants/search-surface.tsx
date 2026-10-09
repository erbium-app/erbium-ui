import { useState } from "react";
import {
  Autocomplete,
  AutocompleteSearchInput,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from "@erbium/ui/components/autocomplete";

const documents = [
  "Design system overview",
  "Typography foundations",
  "Sizing foundations",
  "Surface guidelines",
  "Accessibility checklist",
];

export default function SearchSurfaceExample() {
  const [selected, setSelected] = useState("");
  return (
    <div className="grid w-80 max-w-full gap-related">
      <Autocomplete items={documents} inline open autoHighlight="always" keepHighlight>
        <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border surface-overlay">
          <AutocompleteSearchInput aria-label="Search documents" placeholder="Search documents…" />
          <AutocompleteEmpty>No documents found.</AutocompleteEmpty>
          <AutocompleteList>
            {(document) => (
              <AutocompleteItem
                key={document}
                value={document}
                onClick={() => setSelected(document)}
              >
                {document}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </div>
      </Autocomplete>
      <p role="status" className="text-caption text-muted-foreground">
        {selected || "Search or choose a document."}
      </p>
    </div>
  );
}
