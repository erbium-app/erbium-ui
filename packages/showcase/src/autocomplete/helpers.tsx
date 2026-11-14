import { Form, useAppForm } from "@erbium/ui/components/form";
import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";

import { Field, FieldLabel } from "@erbium/ui/components/field";

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

export const FruitAutocomplete = ({
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
}) => (
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
        {(item: (typeof items)[number]) => (
          <AutocompleteItem key={item.value} value={item}>
            {item.label}
          </AutocompleteItem>
        )}
      </AutocompleteList>
    </AutocompletePopup>
  </Autocomplete>
);

export const LabeledAutocomplete = () => {
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
          {(item: (typeof items)[number]) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  );
};

const tags = [
  { group: "Status", label: "Open" },
  { group: "Status", label: "In progress" },
  { group: "Status", label: "Blocked" },
  { group: "Priority", label: "Low" },
  { group: "Priority", label: "High" },
  { group: "Team", label: "Design" },
  { group: "Team", label: "Frontend" },
  { group: "Team", label: "Platform" },
];

const tagGroups = ["Status", "Priority", "Team"].map((group) => ({
  group,
  items: tags.filter((tag) => tag.group === group),
}));

export const GroupedAutocomplete = () => (
  <Autocomplete items={tagGroups} itemToStringValue={(group) => group.group}>
    <AutocompleteInput aria-label="Search tags" placeholder="Search tags…" />
    <AutocompletePopup>
      <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
      <AutocompleteList>
        {(group: (typeof tagGroups)[number]) => (
          <AutocompleteGroup key={group.group} items={group.items}>
            <AutocompleteGroupLabel>{group.group}</AutocompleteGroupLabel>
            <AutocompleteCollection>
              {(tag: (typeof tags)[number]) => (
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

export const LimitedAutocomplete = () => {
  const [value, setValue] = useState("");
  const { contains } = useAutocompleteFilter({ sensitivity: "base" });
  const matches = languages.filter((language) => !value || contains(language, value));

  return (
    <Autocomplete items={languages} limit={4} value={value} onValueChange={setValue}>
      <AutocompleteInput aria-label="Search languages" placeholder="Search languages…" />
      <AutocompletePopup>
        <AutocompleteEmpty>No languages found.</AutocompleteEmpty>
        <AutocompleteList>
          {(language: string) => (
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
};

export const movies = [
  { id: "1", title: "The Shawshank Redemption", year: 1994 },
  { id: "2", title: "The Godfather", year: 1972 },
  { id: "3", title: "The Dark Knight", year: 2008 },
  { id: "4", title: "Pulp Fiction", year: 1994 },
  { id: "5", title: "Forrest Gump", year: 1994 },
  { id: "6", title: "Inception", year: 2010 },
];

export const AsyncAutocomplete = () => {
  const [request, setRequest] = useState<{ query: string }>({ query: "" });
  const { query } = request;

  const [response, setResponse] = useState<{ request: { query: string }; results: typeof movies }>({
    request,
    results: [],
  });

  const results = query ? response.results : [];
  const loading = Boolean(query && response.request !== request);
  const { contains } = useAutocompleteFilter({ sensitivity: "base" });
  useEffect(() => {
    const timer =
      query === ""
        ? undefined
        : setTimeout(() => {
            setResponse({
              request,
              results: movies.filter(
                (movie) => contains(movie.title, query) || contains(String(movie.year), query),
              ),
            });
          }, 450);

    return () => {
      clearTimeout(timer);
    };
  }, [request, query, contains]);

  return (
    <Autocomplete
      items={results}
      autoHighlight
      filter={null}
      value={query}
      onValueChange={(nextQuery) => {
        const next = { query: nextQuery };
        setRequest(next);

        if (!nextQuery) {
          setResponse({ request: next, results: [] });
        }
      }}
      itemToStringValue={(movie) => movie.title}
    >
      <AutocompleteInput aria-label="Search movies" placeholder="Search title or year…" />
      {query && (
        <AutocompletePopup aria-busy={loading || undefined}>
          <AutocompleteStatus>
            {loading ? (
              <span className="flex items-center gap-related">
                Searching…
                <Spinner />
              </span>
            ) : (
              `${results.length} results found`
            )}
          </AutocompleteStatus>
          <AutocompleteList>
            {(movie: (typeof movies)[number]) => (
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
};

export const FormAutocomplete = () => {
  const id = useId();
  const form = useAppForm({ defaultValues: { fruit: "" } });

  return (
    <Form form={form} className="flex w-64 flex-col gap-3">
      <form.AppField
        name="fruit"
        validators={{
          onDynamic: ({ value }) => (value.trim() ? undefined : "Enter a favorite fruit."),
        }}
      >
        {(field) => (
          <field.Field>
            <FieldLabel htmlFor={id}>Favorite fruit</FieldLabel>
            <Autocomplete
              items={items}
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <AutocompleteInput id={id} onBlur={field.handleBlur} placeholder="Choose a fruit…" />
              <AutocompletePopup>
                <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
                <AutocompleteList>
                  {(item: (typeof items)[number]) => (
                    <AutocompleteItem key={item.value} value={item}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </AutocompleteList>
              </AutocompletePopup>
            </Autocomplete>
            <field.FieldError />
          </field.Field>
        )}
      </form.AppField>
      <form.SubmitButton>Submit</form.SubmitButton>
    </Form>
  );
};
