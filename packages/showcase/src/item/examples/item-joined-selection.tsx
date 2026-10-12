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
  { id: "gateway", name: "Cloud gateway", icon: "cloud", color: "text-tag-orange", issues: 30 },
  { id: "reader", name: "Read platform", icon: "cube", color: "text-tag-blue", issues: 13 },
  {
    id: "knowledge",
    name: "Knowledge hub",
    icon: "book-open-01",
    color: "text-tag-red",
    issues: 9,
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: "link-01",
    color: "text-tag-purple",
    issues: 27,
  },
  {
    id: "admin",
    name: "Admin panel",
    icon: "dashboard-square-01",
    color: "text-tag-magenta",
    issues: 27,
  },
  { id: "data", name: "Data layer", icon: "database-01", color: "text-tag-cyan", issues: 29 },
  {
    id: "generate",
    name: "Generate",
    icon: "magic-wand-01",
    color: "text-tag-green",
    issues: 15,
  },
  { id: "website", name: "Website", icon: "globe-02", color: "text-tag-blue", issues: 15 },
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
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked
                      ? [...current, project.id]
                      : current.filter((selectedId) => selectedId !== project.id),
                  )
                }
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
