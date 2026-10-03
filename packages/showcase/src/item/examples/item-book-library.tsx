import { useId, useState } from "react";
import { Badge } from "@erbium/ui/components/badge";
import { Checkbox } from "@erbium/ui/components/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@erbium/ui/components/item";
import { Field, FieldLabel } from "@erbium/ui/components/field";

const books = [
  {
    id: "left-hand-of-darkness",
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    year: 1969,
    status: "Reading",
    badgeVariant: "info",
    cover: "bg-info text-info-foreground",
    monogram: "LH",
  },
  {
    id: "a-room-of-ones-own",
    title: "A Room of One’s Own",
    author: "Virginia Woolf",
    year: 1929,
    status: "Finished",
    badgeVariant: "success",
    cover: "bg-warning text-warning-foreground",
    monogram: "AR",
  },
  {
    id: "the-dispossessed",
    title: "The Dispossessed",
    author: "Ursula K. Le Guin",
    year: 1974,
    status: "To read",
    badgeVariant: "secondary",
    cover: "bg-error text-error-foreground",
    monogram: "TD",
  },
  {
    id: "braiding-sweetgrass",
    title: "Braiding Sweetgrass",
    author: "Robin Wall Kimmerer",
    year: 2013,
    status: "To read",
    badgeVariant: "secondary",
    cover: "bg-success text-success-foreground",
    monogram: "BS",
  },
] as const;

export default function ItemBookLibrary() {
  const [selected, setSelected] = useState<string[]>([books[0].id, books[1].id]);
  const idPrefix = useId();
  const allSelected = selected.length === books.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <section className="w-[min(42rem,90vw)] space-y-4" aria-label="Book library">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">My library</h2>
          <p className="text-sm text-muted-foreground">Books on your shelf</p>
        </div>
        <p className="text-sm text-muted-foreground" role="status">
          {selected.length} of {books.length} selected
        </p>
      </div>

      <Field orientation="horizontal" className="px-4">
        <Checkbox
          id={`${idPrefix}-all`}
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) => setSelected(checked ? books.map((book) => book.id) : [])}
        />
        <FieldLabel htmlFor={`${idPrefix}-all`}>Select all books</FieldLabel>
      </Field>

      <ItemGroup variant="panel">
        {books.map((book, index) => {
          const checked = selected.includes(book.id);
          const checkboxId = `${idPrefix}-${book.id}`;

          return (
            <Item
              render={<Field orientation="horizontal" />}
              key={book.id}
              role="listitem"
              data-selected={checked}
              className="relative"
            >
              {index > 0 && (
                <ItemSeparator className="absolute inset-x-4 top-0 mx-0! my-0! w-auto" />
              )}
              <Checkbox
                id={checkboxId}
                checked={checked}
                aria-label={`Select ${book.title}`}
                onCheckedChange={(nextChecked) =>
                  setSelected((current) =>
                    nextChecked
                      ? [...current, book.id]
                      : current.filter((selectedId) => selectedId !== book.id),
                  )
                }
              />
              <ItemMedia variant="image" className="h-14 w-10 rounded-sm shadow-sm">
                <span
                  aria-hidden="true"
                  className={`flex size-full items-end border-s-4 border-border p-1 text-[10px] font-semibold tracking-wider ${book.cover}`}
                >
                  {book.monogram}
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <FieldLabel htmlFor={checkboxId} className="cursor-pointer">
                    {book.title}
                  </FieldLabel>
                </ItemTitle>
                <ItemDescription>
                  {book.author} · {book.year}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={book.badgeVariant}>{book.status}</Badge>
              </ItemActions>
            </Item>
          );
        })}
      </ItemGroup>
    </section>
  );
}
