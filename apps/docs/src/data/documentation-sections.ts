export type DocumentationKind = "foundation" | "component" | "provider" | "utility" | "hook";
export const documentationSections: {
  title: string;
  slug: string;
  kind: DocumentationKind;
  names: string[];
}[] = [
  {
    title: "Foundations",
    slug: "foundations",
    kind: "foundation",
    names: ["styles", "colors", "surfaces"],
  },
  {
    title: "Actions",
    slug: "actions",
    kind: "component",
    names: ["button", "button-group", "stateful-button", "toggle", "toggle-group", "toolbar"],
  },
  {
    title: "Inputs & forms",
    slug: "inputs-forms",
    kind: "component",
    names: [
      "form",
      "field",
      "input",
      "input-group",
      "textarea",
      "number-field",
      "otp-field",
      "checkbox",
      "radio-group",
      "switch",
      "slider",
      "select",
      "combobox",
      "autocomplete",
      "calendar",
      "editable",
      "control",
      "questionnaire",
    ],
  },
  {
    title: "Navigation",
    slug: "navigation",
    kind: "component",
    names: ["sidebar", "navigation-menu", "menubar", "breadcrumb", "tabs", "pagination", "command"],
  },
  {
    title: "Layout & containers",
    slug: "layout",
    kind: "component",
    names: [
      "card",
      "item",
      "separator",
      "aspect-ratio",
      "resizable",
      "scroll-area",
      "accordion",
      "collapsible",
      "carousel",
    ],
  },
  {
    title: "Data display",
    slug: "data-display",
    kind: "component",
    names: ["table", "chart", "avatar", "badge", "kbd"],
  },
  {
    title: "Feedback & status",
    slug: "feedback",
    kind: "component",
    names: ["alert", "toast", "empty", "progress", "meter", "spinner", "skeleton"],
  },
  {
    title: "Overlays & menus",
    slug: "overlays",
    kind: "component",
    names: [
      "dialog",
      "alert-dialog",
      "sheet",
      "drawer",
      "popover",
      "tooltip",
      "hover-card",
      "dropdown-menu",
      "context-menu",
    ],
  },
  {
    title: "Messaging",
    slug: "messaging",
    kind: "component",
    names: ["message", "bubble", "message-scroller", "attachment", "marker"],
  },
  { title: "Motion", slug: "motion", kind: "component", names: ["text-morph", "stateful-icon"] },
  {
    title: "Providers",
    slug: "providers",
    kind: "provider",
    names: ["direction", "overlay-provider", "csp-provider"],
  },
  { title: "Utilities", slug: "utilities", kind: "utility", names: ["scroll-fade", "shake"] },
  {
    title: "Hooks",
    slug: "hooks",
    kind: "hook",
    names: ["use-copy-to-clipboard", "use-drag-select", "use-is-mobile", "use-media-query"],
  },
];
export const kindPaths: Record<DocumentationKind, string> = {
  foundation: "foundations",
  component: "components",
  provider: "providers",
  utility: "utilities",
  hook: "hooks",
};
export const kindTitles: Record<DocumentationKind, string> = {
  foundation: "Foundations",
  component: "Components",
  provider: "Providers",
  utility: "Utilities",
  hook: "Hooks",
};
