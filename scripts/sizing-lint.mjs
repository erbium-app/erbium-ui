import { classContext } from "./typography-lint.mjs";

// The guard is scoped to shared control recipes. Media, illustrations, layout
// widths, and component-specific tracks remain free to own their dimensions.
const rawControlHeight = /(?:^|:)!?(?:h|min-h|size)-(?:5|6|7|8|9)(?:!)?$/;

export function sizingViolations(classes) {
  return classes.split(/\s+/).filter((token) => rawControlHeight.test(token));
}

export default {
  meta: { name: "erbium-sizing" },
  rules: {
    "use-geometry": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          useGeometry:
            "Use Erbium control geometry instead of '{{token}}'. Height, padding, and typography must stay coordinated.",
        },
      },
      create(context) {
        function inspect(node, value) {
          if (typeof value !== "string" || !classContext(node, context)) return;
          for (const token of sizingViolations(value))
            context.report({ node, messageId: "useGeometry", data: { token } });
        }
        return {
          Literal(node) {
            inspect(node, node.value);
          },
          TemplateElement(node) {
            inspect(node, node.value.raw);
          },
        };
      },
    },
  },
};
