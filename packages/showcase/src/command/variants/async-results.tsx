import { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@erbium/ui/components/command";

const actions = [
  { id: "open", label: "Open project", description: "Continue working in this workspace" },
  { id: "invite", label: "Invite teammate", description: "Share access to this workspace" },
  { id: "export", label: "Export project", description: "Download a copy of your work" },
];

export default function AsyncResultsExample() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState({ query: "", items: actions });
  const [preview, setPreview] = useState<(typeof actions)[number] | undefined>();
  const [selected, setSelected] = useState("No command selected.");
  const loading = response.query !== query;
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setResponse({
          query,
          items: actions.filter((action) =>
            action.label.toLowerCase().includes(query.toLowerCase()),
          ),
        }),
      300,
    );
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div className="grid w-80 max-w-full gap-related">
      <Command
        items={loading ? [] : response.items}
        filter={null}
        value={query}
        onValueChange={setQuery}
        itemToStringValue={(action) => action.label}
        onItemHighlighted={setPreview}
        aria-busy={loading || undefined}
      >
        <CommandInput
          aria-label="Search workspace commands"
          placeholder="Search workspace commands…"
        />
        <CommandEmpty>{loading ? "Searching…" : "No commands found."}</CommandEmpty>
        <CommandList>
          {(action) => (
            <CommandItem key={action.id} value={action} onClick={() => setSelected(action.label)}>
              {action.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>
      <p className="text-caption text-muted-foreground">
        {preview?.description ?? "Highlight a command to preview it."}
      </p>
      <p role="status" className="text-control">
        {selected}
      </p>
    </div>
  );
}
