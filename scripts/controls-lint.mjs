import { definePlugin, defineRule } from "vite-plus/lint/plugins";

const useSlider = defineRule({
  create: (context) => ({
    JSXOpeningElement(node) {
      if (node.name.type !== "JSXIdentifier" || node.name.name !== "input") {
        return;
      }

      for (const attribute of node.attributes) {
        if (
          attribute.type !== "JSXAttribute" ||
          attribute.name.type !== "JSXIdentifier" ||
          attribute.name.name !== "type"
        ) {
          continue;
        }

        const { value } = attribute;
        const inputType = value?.type === "JSXExpressionContainer" ? value.expression : value;

        if (inputType?.type === "Literal" && inputType.value === "range") {
          context.report({
            node,
            message: 'Use Slider from "@erbium/ui/components/slider" for showcase range controls.',
          });
        }
      }
    },
  }),
  meta: {
    docs: { description: "Use the Erbium Slider for showcase range controls." },
    schema: [],
    type: "problem",
  },
});

export default definePlugin({
  meta: { name: "erbium-controls" },
  rules: { "use-slider": useSlider },
});
