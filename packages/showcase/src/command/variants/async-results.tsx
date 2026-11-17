import { useEffect, useState } from "react";
import { Spinner } from "@erbium/ui/components/spinner";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@erbium/ui/components/command";

const actions = [
  { description: "Continue working in this workspace", id: "open", label: "Open project" },
  { description: "Share access to this workspace", id: "invite", label: "Invite teammate" },
  { description: "Download a copy of your work", id: "export", label: "Export project" },
];

export default function AsyncResultsExample() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState({ items: actions, query: "" });
  const [preview, setPreview] = useState<(typeof actions)[number] | undefined>();
  const [selected, setSelected] = useState("No command selected.");
  const loading = response.query !== query;
  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({
        items: actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase())),
        query,
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
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
        <CommandEmpty className="flex h-10 items-center justify-center not-empty:py-0">
          {loading ? <Spinner aria-label="Searching commands" /> : "No commands found."}
        </CommandEmpty>
        <CommandList>
          {(action: (typeof actions)[number]) => (
            <CommandItem
              key={action.id}
              value={action}
              onClick={() => {
                setSelected(action.label);
              }}
            >
              {action.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>
      <p className="text-caption text-muted-foreground">
        {preview?.description ?? "Highlight a command to preview it."}
      </p>
      <output className="text-control">{selected}</output>
    </div>
  );
}
