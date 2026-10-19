import { createCn } from "cn/config";

const anySurfaceColor = () => true;

/**
 * Surface roles are registered as one class group so `cn` keeps only the last
 * role: `cn("surface-control", "surface-fill-primary")` yields the fill.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "control-adaptation": ["control-adaptive", "control-embedded"],
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
          "control-adaptation": ["control-adaptive", "control-embedded"],
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
