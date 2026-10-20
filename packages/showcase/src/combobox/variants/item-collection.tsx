import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Combobox,
  createComboboxItems,
  ComboboxTrigger,
  ComboboxSearchInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxValue,
} from "@erbium/ui/components/combobox";

const projects = [
  { description: "Shared components and foundations", id: "design", name: "Design system" },
  { description: "Guides and examples", id: "docs", name: "Documentation" },
  { description: "Product experience", id: "website", name: "Website" },
] as const;

const items = createComboboxItems(projects, {
  getLabel: (project) => project.name,
  getValue: (project) => project.id,
});

const ItemCollectionExample = () => {
  const [value, setValue] = useState<(typeof projects)[number]["id"] | null>("design");

  return (
    <div className="grid gap-related">
      <Combobox items={items} value={value} onValueChange={setValue} autoHighlight>
        <ComboboxTrigger render={<Button variant="outline" className="w-64 justify-between" />}>
          <ComboboxValue placeholder="Choose a project" />
        </ComboboxTrigger>
        <ComboboxContent className="w-72">
          <ComboboxSearchInput aria-label="Search projects" />
          <ComboboxEmpty>No projects found.</ComboboxEmpty>
          <ComboboxList>
            {(project) => (
              <ComboboxItem key={project.id} value={project.id}>
                <span className="grid gap-1">
                  <span>{project.name}</span>
                  <span className="text-caption text-muted-foreground">{project.description}</span>
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p role="status" className="text-caption text-muted-foreground">
        Saved project ID: {value ?? "none"}
      </p>
    </div>
  );
};

export default ItemCollectionExample;
