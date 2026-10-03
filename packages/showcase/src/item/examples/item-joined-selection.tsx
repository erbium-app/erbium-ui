import CloudIcon from "@hugeicons/core-free-icons/CloudIcon";
import CubeIcon from "@hugeicons/core-free-icons/CubeIcon";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import DashboardSquare01Icon from "@hugeicons/core-free-icons/DashboardSquare01Icon";
import Database01Icon from "@hugeicons/core-free-icons/Database01Icon";
import MagicWand01Icon from "@hugeicons/core-free-icons/MagicWand01Icon";
import Globe02Icon from "@hugeicons/core-free-icons/Globe02Icon";
import { HugeiconsIcon } from "@hugeicons/react";
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
  { id: "gateway", name: "Cloud gateway", icon: CloudIcon, color: "text-tag-orange", issues: 30 },
  { id: "reader", name: "Read platform", icon: CubeIcon, color: "text-tag-blue", issues: 13 },
  {
    id: "knowledge",
    name: "Knowledge hub",
    icon: BookOpen01Icon,
    color: "text-tag-red",
    issues: 9,
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: Link01Icon,
    color: "text-tag-purple",
    issues: 27,
  },
  {
    id: "admin",
    name: "Admin panel",
    icon: DashboardSquare01Icon,
    color: "text-tag-magenta",
    issues: 27,
  },
  { id: "data", name: "Data layer", icon: Database01Icon, color: "text-tag-cyan", issues: 29 },
  {
    id: "generate",
    name: "Generate",
    icon: MagicWand01Icon,
    color: "text-tag-green",
    issues: 15,
  },
  { id: "website", name: "Website", icon: Globe02Icon, color: "text-tag-blue", issues: 15 },
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
      <div className="flex justify-between px-3 pb-2 text-xs text-muted-foreground">
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
                <HugeiconsIcon
                  icon={project.icon}
                  className={`size-4 ${project.color}`}
                  aria-hidden="true"
                />
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
