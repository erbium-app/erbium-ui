import { useEffect, useId, useState, type ReactNode } from "react";

import { Field, FieldLabel } from "@erbium/ui/components/field";

import { Button } from "@erbium/ui/components/button";

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteSeparator,
  AutocompleteStatus,
  useAutocompleteFilter,
} from "@erbium/ui/components/autocomplete";

import { Spinner } from "@erbium/ui/components/spinner";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Mango", value: "mango" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
];

export function FruitAutocomplete({
  disabled,
  size,
  mode,
  autoHighlight,
  showClear,
  showTrigger,
  startAddon,
}: {
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  mode?: "list" | "inline" | "both";
  autoHighlight?: boolean;
  showClear?: boolean;
  showTrigger?: boolean;
  startAddon?: ReactNode;
}) {
  return (
    <Autocomplete items={items} disabled={disabled} mode={mode} autoHighlight={autoHighlight}>
      <AutocompleteInput
        aria-label="Search fruits"
        placeholder="Search fruits…"
        size={size}
        showClear={showClear}
        showTrigger={showTrigger}
        startAddon={startAddon}
      />
      <AutocompletePopup>
        <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  );
}

export function LabeledAutocomplete() {
  const id = useId();
  return (
    <Autocomplete items={items}>
      <Field className="w-64 items-start">
        <FieldLabel htmlFor={id}>Fruits</FieldLabel>
        <AutocompleteInput id={id} aria-label="Search fruits" placeholder="Search fruits…" />
      </Field>
      <AutocompletePopup>
        <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  );
}

const tags = [
  { label: "Open", group: "Status" },
  { label: "In progress", group: "Status" },
  { label: "Blocked", group: "Status" },
  { label: "Low", group: "Priority" },
  { label: "High", group: "Priority" },
  { label: "Design", group: "Team" },
  { label: "Frontend", group: "Team" },
  { label: "Platform", group: "Team" },
];

const tagGroups = ["Status", "Priority", "Team"].map((group) => ({
  group,
  items: tags.filter((tag) => tag.group === group),
}));

export function GroupedAutocomplete() {
  return (
    <Autocomplete items={tagGroups} itemToStringValue={(group) => group.group}>
      <AutocompleteInput aria-label="Search tags" placeholder="Search tags…" />
      <AutocompletePopup>
        <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
        <AutocompleteList>
          {(group) => (
            <AutocompleteGroup key={group.group} items={group.items}>
              <AutocompleteGroupLabel>{group.group}</AutocompleteGroupLabel>
              <AutocompleteCollection>
                {(tag) => (
                  <AutocompleteItem key={tag.label} value={tag}>
                    {tag.label}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
              {group.group !== "Team" && <AutocompleteSeparator />}
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  );
}

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Ruby",
  "Swift",
];

export function LimitedAutocomplete() {
  const [value, setValue] = useState("");
  const { contains } = useAutocompleteFilter({ sensitivity: "base" });
  const matches = languages.filter((language) => !value || contains(language, value));
  return (
    <Autocomplete items={languages} limit={4} value={value} onValueChange={setValue}>
      <AutocompleteInput aria-label="Search languages" placeholder="Search languages…" />
      <AutocompletePopup>
        <AutocompleteEmpty>No languages found.</AutocompleteEmpty>
        <AutocompleteList>
          {(language) => (
            <AutocompleteItem key={language} value={language}>
              {language}
            </AutocompleteItem>
          )}
        </AutocompleteList>
        {matches.length > 4 && (
          <AutocompleteStatus>
            +{matches.length - 4} more (keep typing to narrow down)
          </AutocompleteStatus>
        )}
      </AutocompletePopup>
    </Autocomplete>
  );
}

export const movies = [
  { id: "1", title: "The Shawshank Redemption", year: 1994 },
  { id: "2", title: "The Godfather", year: 1972 },
  { id: "3", title: "The Dark Knight", year: 2008 },
  { id: "4", title: "Pulp Fiction", year: 1994 },
  { id: "5", title: "Forrest Gump", year: 1994 },
  { id: "6", title: "Inception", year: 2010 },
];

export function AsyncAutocomplete() {
  const [request, setRequest] = useState({ query: "" });
  const { query } = request;
  const [response, setResponse] = useState({ request, results: [] as typeof movies });
  const results = query ? response.results : [];
  const loading = Boolean(query && response.request !== request);
  const { contains } = useAutocompleteFilter({ sensitivity: "base" });
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(() => {
      setResponse({
        request,
        results: movies.filter(
          (movie) => contains(movie.title, query) || contains(String(movie.year), query),
        ),
      });
    }, 450);
    return () => clearTimeout(timer);
  }, [request, query, contains]);
  return (
    <Autocomplete
      items={results}
      filter={null}
      value={query}
      onValueChange={(query) => {
        const next = { query };
        setRequest(next);
        if (!query) setResponse({ request: next, results: [] });
      }}
      itemToStringValue={(movie) => movie.title}
    >
      <AutocompleteInput aria-label="Search movies" placeholder="Search title or year…" />
      {query && (
        <AutocompletePopup aria-busy={loading || undefined}>
          <AutocompleteStatus>
            {loading ? (
              <span className="flex items-center gap-2">
                Searching…
                <Spinner className="size-4" />
              </span>
            ) : (
              `${results.length} results found`
            )}
          </AutocompleteStatus>
          <AutocompleteList>
            {(movie) => (
              <AutocompleteItem key={movie.id} value={movie}>
                <span className="flex flex-col">
                  <span className="font-medium">{movie.title}</span>
                  <span className="text-metadata text-muted-foreground">{movie.year}</span>
                </span>
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      )}
    </Autocomplete>
  );
}

export function FormAutocomplete() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="flex w-64 flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Autocomplete items={items} required>
        <Field>
          <FieldLabel htmlFor="favorite-fruit">Favorite fruit</FieldLabel>
          <AutocompleteInput id="favorite-fruit" name="fruit" placeholder="Choose a fruit…" />
        </Field>
        <AutocompletePopup>
          <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.value} value={item}>
                {item.label}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
      <Button type="submit">Submit</Button>
      {submitted && <p className="text-caption text-muted-foreground">Form submitted.</p>}
    </form>
  );
}
