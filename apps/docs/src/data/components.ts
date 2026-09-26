import registry from "../../../../packages/ui/registry.json";

export type ComponentEntry = {
  name: string;
  title: string;
  description: string;
  files?: Array<{ path: string }>;
};

export const components = (registry.items as ComponentEntry[])
  .filter((item) => item.name !== "utils")
  .map((item) =>
    item.name === "autocomplete"
      ? {
          ...item,
          description:
            "An accessible free-text input with filtered suggestions, async search states, and keyboard-highlighted options. Use Combobox when users must select a listed value.",
        }
      : item,
  );

export const componentGroups = [
  { label: "Foundations", names: ["button", "badge", "card", "separator", "skeleton"] },
  {
    label: "Forms",
    names: [
      "input",
      "textarea",
      "checkbox",
      "radio-group",
      "select",
      "autocomplete",
      "switch",
      "slider",
    ],
  },
  {
    label: "Navigation",
    names: ["breadcrumb", "pagination", "tabs", "menubar", "navigation-menu"],
  },
  { label: "Overlays", names: ["dialog", "alert-dialog", "popover", "tooltip", "sheet", "drawer"] },
  {
    label: "Data display",
    names: ["table", "avatar", "calendar", "carousel", "chart", "progress"],
  },
];

export function getComponent(name: string) {
  return components.find((component) => component.name === name);
}
