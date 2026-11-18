import { findOption } from "@erbium/ui/lib/filter-rules";
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
  area: string;
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

/*
 * Option trees. An option with children groups the options below it and opens as a level of the
 * option menu; tasks hold only the options without children.
 */
const areaOptions: FilterOption[] = [
  {
    children: [
      { label: "Dashboard", value: "dashboard" },
      { label: "Settings", value: "settings" },
      { keywords: ["invoices", "plans"], label: "Billing", value: "billing" },
    ],
    icon: "app-window",
    label: "Web app",
    value: "web",
  },
  {
    children: [
      { label: "iOS", value: "ios" },
      { label: "Android", value: "android" },
    ],
    icon: "layout-grid",
    label: "Mobile",
    value: "mobile",
  },
  {
    children: [
      {
        children: [
          { label: "REST", value: "rest" },
          { icon: "graphql", label: "GraphQL", value: "graphql" },
        ],
        label: "API",
        value: "api",
      },
      { keywords: ["login", "SSO"], label: "Authentication", value: "auth" },
      { label: "Infrastructure", value: "infrastructure" },
    ],
    icon: "cloud",
    label: "Platform",
    value: "platform",
  },
];

/** Assignees grouped by team. The groups are levels; the people are the values. */
const assigneeOptions: FilterOption[] = [
  {
    children: [
      { label: "Maya Okafor", value: "Maya Okafor" },
      { label: "Noor Haddad", value: "Noor Haddad" },
    ],
    label: "Design",
    value: "team-design",
  },
  {
    children: [
      { label: "Leo Brandt", value: "Leo Brandt" },
      { label: "Sana Rahimi", value: "Sana Rahimi" },
      { label: "Jonas Weber", value: "Jonas Weber" },
    ],
    label: "Engineering",
    value: "team-engineering",
  },
  {
    children: [{ label: "Aiko Tanaka", value: "Aiko Tanaka" }],
    label: "Product",
    value: "team-product",
  },
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

const assignees = [
  "Maya Okafor",
  "Leo Brandt",
  "Sana Rahimi",
  "Aiko Tanaka",
  "Jonas Weber",
  "Noor Haddad",
];

const areas = [
  "dashboard",
  "graphql",
  "ios",
  "auth",
  "billing",
  "rest",
  "android",
  "infrastructure",
  "settings",
];

const statuses: Status[] = ["backlog", "todo", "in-progress", "done", "canceled", "todo"];

const priorities: Priority[] = ["low", "medium", "high", "medium"];

const labelSets = [["bug"], ["feature"], ["docs"], ["design", "feature"], ["bug", "design"], []];

const tasks: Task[] = Array.from({ length: 36 }, (_, index) => ({
  area: areas[index % areas.length] ?? "dashboard",
  assignee: assignees[index % assignees.length] ?? "Maya Okafor",
  due: new Date(Date.UTC(2026, 10, 1 + ((index * 5) % 40))).toISOString().slice(0, 10),
  estimate: ((index * 7) % 13) + 1,
  id: `TASK-${String(200 + index)}`,
  labels: labelSets[index % labelSets.length] ?? [],
  priority: priorities[index % priorities.length] ?? "low",
  status: statuses[index % statuses.length] ?? "todo",
  title: titles[index % titles.length] ?? "Untitled task",
}));

/** The label of an option value at any depth, for cells and list rows. */
const labelOf = (options: FilterOption[], value: string) =>
  findOption(options, value)?.label ?? value;

const priorityVariant = { high: "error", low: "secondary", medium: "warning" } as const;

export {
  areaOptions,
  assigneeOptions,
  labelOf,
  labelOptions,
  priorityOptions,
  priorityVariant,
  statusOptions,
  tasks,
};

export type { Task };
