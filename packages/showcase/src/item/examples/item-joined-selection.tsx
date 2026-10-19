import { Icon } from "@erbium/ui/components/icon";
import { useId, useState } from "react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";
import { Field, FieldLabel } from "@erbium/ui/components/field";

const projects = [
  { color: "text-tag-orange", icon: "cloud", id: "gateway", issues: 30, name: "Cloud gateway" },
  { color: "text-tag-blue", icon: "cube", id: "reader", issues: 13, name: "Read platform" },
  {
    color: "text-tag-red",
    icon: "book-open-01",
    id: "knowledge",
    issues: 9,
    name: "Knowledge hub",
  },
  {
    color: "text-tag-purple",
    icon: "link-01",
    id: "integrations",
    issues: 27,
    name: "Integrations",
  },
  {
    color: "text-tag-magenta",
    icon: "dashboard-square-01",
    id: "admin",
    issues: 27,
    name: "Admin panel",
  },
  { color: "text-tag-cyan", icon: "database-01", id: "data", issues: 29, name: "Data layer" },
  {
    color: "text-tag-green",
    icon: "magic-wand-01",
    id: "generate",
    issues: 15,
    name: "Generate",
  },
  { color: "text-tag-blue", icon: "globe-02", id: "website", issues: 15, name: "Website" },
] as const;

export default function ItemJoinedSelection() {
  const [selected, setSelected] = useState<string[]>([
    "gateway",
    "reader",
    "integrations",
    "admin",
    "generate",
    "website",
  ]);

  const idPrefix = useId();

  return (
    <section className="w-[min(48rem,92vw)]" aria-label="Projects">
      <div className="flex justify-between px-3 pb-2 text-metadata text-muted-foreground">
        <span>Name</span>
        <span>Issues</span>
      </div>
      <ItemGroup>
        {projects.map((project) => {
          const checkboxId = `${idPrefix}-${project.id}`;

          return (
            <Item
              render={<Field orientation="horizontal" />}
              key={project.id}
              role="listitem"
              size="sm"
              data-selected={selected.includes(project.id)}
              className="min-h-12"
            >
              <Checkbox
                id={checkboxId}
                checked={selected.includes(project.id)}
                aria-label={`Select ${project.name}`}
                onCheckedChange={(checked) => {
                  setSelected((current) =>
                    checked
                      ? [...current, project.id]
                      : current.filter((selectedId) => selectedId !== project.id),
                  );
                }}
              />
              <ItemMedia variant="icon">
                <span className={project.color}>
                  <Icon name={project.icon} className="size-4" aria-hidden="true" />
                </span>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <FieldLabel htmlFor={checkboxId} className="cursor-pointer">
                    {project.name}
                  </FieldLabel>
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <span className="tabular-nums text-muted-foreground">{project.issues}</span>
              </ItemActions>
            </Item>
          );
        })}
      </ItemGroup>
    </section>
  );
}
