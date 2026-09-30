import { useMemo, useState } from "react";
import { Kbd } from "@erbium/ui/components/kbd";
type Component = { name: string; title: string; description: string };
export default function ComponentSearch({ components }: { components: Component[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      components
        .filter((item) =>
          `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5),
    [components, query],
  );
  return (
    <div className="search-wrap">
      <label className="search-box">
        <span>⌕</span>
        <input
          aria-label="Search components"
          placeholder="Search components"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Kbd>⌘ K</Kbd>
      </label>
      {query && (
        <div className="search-results">
          {results.map((item) => (
            <a href={`/docs/components/${item.name}`}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </a>
          ))}
          {results.length === 0 && <span className="empty-result">No components found.</span>}
        </div>
      )}
    </div>
  );
}
