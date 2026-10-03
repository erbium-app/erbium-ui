import type { ShowcaseStory } from "@erbium/showcase/catalog";

export function displayValue(value: unknown): string {
  if (value === undefined) return "—";
  if (typeof value === "function") return "Callback";
  return JSON.stringify(value) ?? "—";
}

export function controlRows(story: ShowcaseStory) {
  return [...new Set([...Object.keys(story.argTypes ?? {}), ...Object.keys(story.args ?? {})])].map(
    (name) => {
      const settings = story.argTypes?.[name];
      const value = story.args?.[name];
      const control =
        typeof settings?.control === "string"
          ? settings.control
          : settings?.control && settings.control.type;
      const type =
        settings?.options?.map(displayValue).join(" | ") ||
        (control === "object"
          ? Array.isArray(value)
            ? "number[]"
            : "object"
          : control === "text"
            ? "string"
            : control === "range"
              ? "number"
              : control || (name.startsWith("on") ? "callback" : typeof value));
      return {
        name,
        value,
        control,
        type,
        description: settings?.description,
        options: settings?.options,
        constraints: typeof settings?.control === "object" ? settings.control : undefined,
      };
    },
  );
}

export interface ControlsElement extends HTMLElement {
  values: Record<string, unknown>;
}
