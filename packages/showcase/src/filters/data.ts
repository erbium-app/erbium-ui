import type { FilterOption } from "@erbium/ui/lib/filter-rules";

/* Sample tasks for the filter examples. Each example builds its own filters on top of these. */

type Status = "backlog" | "todo" | "in-progress" | "done" | "canceled";

type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  labels: string[];
  assignee: string;
  estimate: number;
  due: string;
}

const statusOptions: FilterOption[] = [
  { icon: "circle-fading-plus", label: "Backlog", value: "backlog" },
  { icon: "circle-fading-arrow-up", label: "Todo", value: "todo" },
  { icon: "circle-fading-arrow-up", label: "In progress", value: "in-progress" },
  { icon: "circle-check", label: "Done", value: "done" },
  { icon: "x", label: "Canceled", value: "canceled" },
];

const priorityOptions: FilterOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const labelOptions: FilterOption[] = [
  { label: "Bug", value: "bug" },
  { label: "Feature", value: "feature" },
  { label: "Docs", value: "docs" },
  { label: "Design", value: "design" },
];

const titles = [
  "Fix focus ring on menu items",
  "Add RTL support to the date picker",
  "Document the filter bar",
  "Tighten table header spacing",
  "Debounce server-side search",
  "Animate chip removal",
  "Audit color contrast in dark mode",
  "Support multi-select in combobox",
  "Write migration notes for v2",
  "Persist filters in the URL",
  "Reduce bundle size of icons",
  "Add empty state to file tree",
];

const assignees = ["Maya Okafor", "Leo Brandt", "Sana Rahimi", "Aiko Tanaka"];

const statuses: Status[] = ["backlog", "todo", "in-progress", "done", "canceled", "todo"];

const priorities: Priority[] = ["low", "medium", "high", "medium"];

const labelSets = [["bug"], ["feature"], ["docs"], ["design", "feature"], ["bug", "design"], []];

const tasks: Task[] = Array.from({ length: 36 }, (_, index) => ({
  assignee: assignees[index % assignees.length] ?? "Maya Okafor",
  due: new Date(Date.UTC(2026, 10, 1 + ((index * 5) % 40))).toISOString().slice(0, 10),
  estimate: ((index * 7) % 13) + 1,
  id: `TASK-${String(200 + index)}`,
  labels: labelSets[index % labelSets.length] ?? [],
  priority: priorities[index % priorities.length] ?? "low",
  status: statuses[index % statuses.length] ?? "todo",
  title: titles[index % titles.length] ?? "Untitled task",
}));

/** The label of an option value, for cells and list rows. */
const labelOf = (options: FilterOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

const priorityVariant = { high: "error", low: "secondary", medium: "warning" } as const;

export { labelOf, labelOptions, priorityOptions, priorityVariant, statusOptions, tasks };

export type { Task };
