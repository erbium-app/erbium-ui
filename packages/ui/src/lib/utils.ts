import { createCn } from "cn/config";

const anySurfaceColor = () => true;

/**
 * Surface roles are registered as one class group so `cn` keeps only the last
 * role: `cn("surface-control", "surface-fill-primary")` yields the fill.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      surface: [
        {
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
            { fill: [anySurfaceColor], tint: [anySurfaceColor], tag: [anySurfaceColor] },
          ],
        },
      ],
    },
  },
});
