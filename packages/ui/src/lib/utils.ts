import { createCn } from "cn/config";
import type { CSSProperties } from "react";

const anySurfaceColor = () => true;

/**
 * Surface roles are registered as one class group so `cn` keeps only the last
 * role: `cn("surface-control", "surface-fill-primary")` yields the fill.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "control-geometry": ["control-size", "control-size-sm", "control-size-xs", "control-size-lg"],
      "font-size": [
        {
          text: [
            "control",
            "control-sm",
            "metadata",
            "code-block",
            "inline-code",
            "field",
            "editable",
            "display",
            "title",
            "subtitle",
            "body",
            "caption",
          ],
        },
      ],
      gap: [{ gap: ["related", "group", "section", "control-gap"] }],
      p: [{ p: ["panel", "panel-sm"] }],
      px: [{ px: ["panel", "related", "control-inset"] }],
      py: [{ py: ["panel", "related", "control-gap"] }],
      surface: [
        {
          "control-geometry": [
            "control-size",
            "control-size-sm",
            "control-size-xs",
            "control-size-lg",
          ],
          surface: [
            "panel",
            "control",
            "field",
            "overlay",
            "modal",
            "flat",
            "frame",
            "well",
            "knob",
            {
              fill: [anySurfaceColor],
              ghost: [anySurfaceColor],
              tag: [anySurfaceColor],
              tint: [anySurfaceColor],
            },
          ],
        },
      ],
    },
  },
});

/** CSS custom properties keyed by name, e.g. `{ "--ratio": 1.5 }`. */
export type CSSVariables<Value = string | number> = Partial<
  Record<`--${string}`, Value | undefined>
>;

/**
 * Inline `style` that also accepts CSS custom properties. React's `CSSProperties`
 * omits them, and this type is assignable to it, so annotating a constant replaces
 * an `as CSSProperties` cast. Annotate a constant rather than using `satisfies`:
 * an inline literal still fails React's excess-property check.
 */
export type CSSVariableStyle = CSSProperties & CSSVariables;
