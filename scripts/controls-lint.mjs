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

const clipboardWriteMethods = new Set(["write", "writeText"]);

/**
 * Whether an `Icon` name can resolve to the copy icon, including through a
 * ternary or a logical fallback.
 * @param {import("vite-plus/lint/plugins").ESTree.Node | null | undefined} node - An attribute value.
 * @returns {boolean} True when any branch is the literal "copy".
 */
const namesCopyIcon = (node) => {
  if (node?.type === "JSXExpressionContainer") {
    return namesCopyIcon(node.expression);
  }

  if (node?.type === "ConditionalExpression") {
    return namesCopyIcon(node.consequent) || namesCopyIcon(node.alternate);
  }

  if (node?.type === "LogicalExpression") {
    return namesCopyIcon(node.left) || namesCopyIcon(node.right);
  }

  return node?.type === "Literal" && node.value === "copy";
};

/**
 * @param {import("vite-plus/lint/plugins").ESTree.Node} node - A member expression's object or property.
 * @param {string} name - The expected name.
 * @returns {boolean} True for `name` and for `anything.name`.
 */
const isNamed = (node, name) =>
  (node.type === "Identifier" && node.name === name) ||
  (node.type === "MemberExpression" && isNamed(node.property, name));

const useCopyButton = defineRule({
  create: (context) => ({
    CallExpression(node) {
      const { callee } = node;

      if (
        callee.type === "MemberExpression" &&
        callee.property.type === "Identifier" &&
        clipboardWriteMethods.has(callee.property.name) &&
        isNamed(callee.object, "clipboard")
      ) {
        context.report({
          node,
          message:
            'Use CopyButton from "@erbium/ui/blocks/copy-button", or useCopyToClipboard when there is no button. They handle pending, failure and announcements.',
        });
      }
    },
    JSXOpeningElement(node) {
      if (node.name.type !== "JSXIdentifier" || node.name.name !== "Icon") {
        return;
      }

      const copyIcon = node.attributes.some(
        (attribute) =>
          attribute.type === "JSXAttribute" &&
          attribute.name.name === "name" &&
          namesCopyIcon(attribute.value),
      );

      if (copyIcon) {
        context.report({
          node,
          message:
            'The copy icon belongs to CopyButton. Use CopyButton from "@erbium/ui/blocks/copy-button" (with CopyButtonIcon in labelled buttons and menu items), or pick another icon for a different action.',
        });
      }
    },
  }),
  meta: {
    docs: { description: "Route copy actions through the Erbium CopyButton." },
    schema: [],
    type: "problem",
  },
});

export default definePlugin({
  meta: { name: "erbium-controls" },
  rules: { "use-copy-button": useCopyButton, "use-slider": useSlider },
});
