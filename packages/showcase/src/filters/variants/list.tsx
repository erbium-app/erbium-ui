import { FilterBar } from "@erbium/ui/blocks/filters";
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
  labelOf,
  labelOptions,
  priorityOptions,
  priorityVariant,
  statusOptions,
  tasks,
} from "../data";
import type { Task } from "../data";

// The same field configs a table column takes, plus a `value` accessor for each field.
const fields = {
  assignee: { icon: "user", label: "Assignee", type: "option", value: (task) => task.assignee },
  due: { icon: "calendar-01", label: "Due", type: "date", value: (task) => task.due },
  labels: {
    icon: "tag-01",
    label: "Labels",
    options: labelOptions,
    type: "multiOption",
    value: (task) => task.labels,
  },
  priority: {
    icon: "arrow-up-down",
    label: "Priority",
    options: priorityOptions,
    type: "option",
    value: (task) => task.priority,
  },
  status: {
    icon: "circle-check",
    label: "Status",
    options: statusOptions,
    type: "option",
    value: (task) => task.status,
  },
  title: { icon: "file-text", label: "Title", type: "text", value: (task) => task.title },
} satisfies Record<string, ListFilterField<Task>>;

export default function FiltersListExample() {
  // `filters` drives the filter UI; `items` are the tasks that pass the active rules.
  const { filters, items } = useListFilters({ fields, items: tasks });

  return (
    <div className="flex w-full max-w-2xl min-w-72 flex-col gap-group p-4">
      <FilterBar filters={filters} />
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
                  {task.id} · {labelOf(statusOptions, task.status)} · {task.assignee} · due{" "}
                  {task.due}
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
