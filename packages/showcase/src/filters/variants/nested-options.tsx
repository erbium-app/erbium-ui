import { FilterFacets } from "@erbium/ui/blocks/filters";
import { Badge } from "@erbium/ui/components/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@erbium/ui/components/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@erbium/ui/components/item";
import { useListFilters } from "@erbium/ui/hooks/use-filters";
import type { ListFilterField } from "@erbium/ui/hooks/use-filters";
import {
  areaOptions,
  assigneeOptions,
  labelOf,
  priorityOptions,
  priorityVariant,
  statusOptions,
  tasks,
} from "../data";
import type { Task } from "../data";

// `areaOptions` and `assigneeOptions` are trees: an option with `children` opens a level of the
// option menu, and tasks hold only the options without children.
const fields = {
  area: {
    icon: "cube",
    label: "Area",
    options: areaOptions,
    type: "option",
    value: (task) => task.area,
  },
  assignee: {
    icon: "user",
    label: "Assignee",
    options: assigneeOptions,
    type: "option",
    value: (task) => task.assignee,
  },
  status: {
    icon: "circle-check",
    label: "Status",
    options: statusOptions,
    type: "option",
    value: (task) => task.status,
  },
} satisfies Record<string, ListFilterField<Task>>;

export default function FiltersNestedOptionsExample() {
  const { filters, items } = useListFilters({ fields, items: tasks });

  return (
    <div className="flex w-full max-w-2xl min-w-72 flex-col gap-group p-4">
      <FilterFacets filters={filters} />
      <p aria-live="polite" className="text-caption text-muted-foreground">
        {items.length} of {tasks.length} tasks
      </p>
      {items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No tasks match</EmptyTitle>
            <EmptyDescription>Change or clear the filters.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup variant="panel" className="max-h-96 overflow-y-auto">
          {items.map((task) => (
            <Item key={task.id} size="sm">
              <ItemContent>
                <ItemTitle>{task.title}</ItemTitle>
                <ItemDescription>
                  {task.id} · {labelOf(areaOptions, task.area)} · {task.assignee} ·{" "}
                  {labelOf(statusOptions, task.status)}
                </ItemDescription>
              </ItemContent>
              <Badge variant={priorityVariant[task.priority]}>
                {labelOf(priorityOptions, task.priority)}
              </Badge>
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
