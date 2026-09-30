import { createCn } from "cn/config";

/**
 * Surface shadows are registered so `cn` merges them with the built-in shadow
 * scale; without this, `cn("shadow-control", "shadow-none")` keeps both.
 */
export const cn = createCn({
  extend: {
    theme: {
      shadow: [
        "panel",
        "control",
        "overlay",
        "modal",
        "knob",
        "fill",
        "pressed",
        "edge",
        "well",
        "tint",
      ],
    },
  },
});
