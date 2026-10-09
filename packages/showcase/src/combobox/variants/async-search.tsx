import { useEffect, useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxSearchInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@erbium/ui/components/combobox";

const projects = [
  "Design system",
  "Documentation",
  "Website",
  "Mobile app",
  "Research",
  "Product analytics",
  "Release planning",
  "Customer feedback",
  "Engineering tools",
  "Team workspace",
  "Design review",
  "Design resources",
  "Design experiments",
  "Design handoff",
  "Design templates",
  "Design archive",
].map((name, id) => ({ id, name }));
type Project = (typeof projects)[number];

export default function AsyncSearchExample() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState({ query: "", items: projects });
  const [selected, setSelected] = useState<Project | null>(null);
  const [preview, setPreview] = useState("");
  const loading = response.query !== query;
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setResponse({
          query,
          items: projects.filter((project) =>
            project.name.toLowerCase().includes(query.toLowerCase()),
          ),
        }),
      350,
    );
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div className="grid gap-related">
      <Combobox
        items={loading ? [] : response.items}
        filter={null}
        autoHighlight
        value={selected}
        onValueChange={setSelected}
        onInputValueChange={setQuery}
        itemToStringLabel={(project) => project.name}
        onItemHighlighted={(project) => setPreview(project?.name ?? "")}
      >
        <ComboboxTrigger render={<Button variant="outline" className="w-72 justify-between" />}>
          <ComboboxValue placeholder="Find a project" />
        </ComboboxTrigger>
        <ComboboxContent className="w-72">
          <ComboboxSearchInput aria-label="Search projects" placeholder="Search projects…" />
          <ComboboxEmpty>{loading ? "Searching…" : "No projects found."}</ComboboxEmpty>
          <ComboboxList aria-busy={loading || undefined}>
            {(project) => (
              <ComboboxItem key={project.id} value={project}>
                {project.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p className="text-caption text-muted-foreground">Highlighted: {preview || "none"}</p>
      <p role="status" className="text-control">
        Selected: {selected?.name ?? "none"}
      </p>
    </div>
  );
}
