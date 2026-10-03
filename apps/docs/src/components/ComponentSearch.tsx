import { useEffect, useState } from "react";
import { Button } from "@erbium/ui/components/button";
import { Kbd } from "@erbium/ui/components/kbd";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@erbium/ui/components/command";

type Component = { name: string; title: string; description: string; href: string; kind: string };

function filterDocumentation(value: string, search: string, keywords: string[] = []) {
  const normalize = (text: string) => text.toLowerCase().replace(/[-_]/g, " ").trim();
  const query = normalize(search);
  const title = normalize(value);
  if (!query || title === query) return 1;
  if (title.includes(query)) return 0.9;
  return keywords.some((keyword) => normalize(keyword).includes(query)) ? 0.5 : 0;
}
export default function ComponentSearch({ components }: { components: Component[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);
  const navigate = (href: string) => window.location.assign(href);
  return (
    <>
      <Button
        variant="outline"
        className="docs-search-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="7" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <span>Search documentation…</span>
        <Kbd hotkey="Mod+K" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Find a component, hook, or guide."
        className="docs-search-dialog sm:max-w-lg"
        showCloseButton
      >
        <Command filter={filterDocumentation}>
          <CommandInput placeholder="Search documentation…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Getting started">
              <CommandItem onSelect={() => navigate("/docs")}>Introduction</CommandItem>
              <CommandItem onSelect={() => navigate("/docs/installation")}>
                Installation
              </CommandItem>
            </CommandGroup>
            {["component", "hook"].map((kind) => (
              <CommandGroup key={kind} heading={kind === "hook" ? "Hooks" : "Components"}>
                {components
                  .filter((item) => item.kind === kind)
                  .map((item) => (
                    <CommandItem
                      key={item.name}
                      value={item.title}
                      keywords={[item.name, item.description]}
                      onSelect={() => navigate(item.href)}
                    >
                      <span>{item.title}</span>
                      <span className="search-result-path">{item.href.replace("/docs/", "")}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
          <div className="search-footer">
            <span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> Navigate
            </span>
            <span>
              <Kbd>Enter</Kbd> Open
            </span>
            <span>
              <Kbd>Esc</Kbd> Close
            </span>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}
