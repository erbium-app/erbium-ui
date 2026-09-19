import registry from "../../../../packages/ui/registry.json";

export type ComponentEntry = {
  name: string;
  title: string;
  description: string;
  files?: Array<{ path: string }>;
};

export const components = (registry.items as ComponentEntry[]).filter(
  (item) => item.name !== "utils",
);

export const componentGroups = [
  { label: "Foundations", names: ["button", "badge", "card", "separator", "skeleton"] },
  {
    label: "Forms",
    names: ["input", "textarea", "checkbox", "radio-group", "select", "switch", "slider"],
  },
  {
    label: "Navigation",
    names: ["breadcrumb", "pagination", "tabs", "menubar", "navigation-menu"],
  },
  { label: "Overlays", names: ["dialog", "alert-dialog", "popover", "tooltip", "sheet", "drawer"] },
  { label: "Data display", names: ["table", "avatar", "calendar", "carousel", "progress"] },
];

export function getComponent(name: string) {
  return components.find((component) => component.name === name);
}
