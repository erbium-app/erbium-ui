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
    "use-component-geometry": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          useSize:
            "Use the component size prop instead of '{{token}}'; geometry comes from its shared recipe.",
        },
      },
      create(context) {
        const controls = new Set();
        const sized = new Set([
          "Button",
          "StatefulButton",
          "SidebarMenuButton",
          "Input",
          "Textarea",
          "SelectTrigger",
          "Toggle",
          "ToggleGroupItem",
          "TabsList",
          "TabsTrigger",
          "InputGroup",
          "InputGroupButton",
          "NumberFieldGroup",
          "AutocompleteInput",
          "ComboboxInput",
          "OtpFieldInput",
          "Badge",
        ]);
        function strings(node, seen = new Set()) {
          if (!node || seen.has(node)) return [];
          seen.add(node);
          if (node.type === "Literal" && typeof node.value === "string") return [node.value];
          if (node.type === "JSXExpressionContainer") return strings(node.expression, seen);
          if (node.type === "TemplateLiteral") return node.quasis.map((part) => part.value.raw);
          if (node.type === "ConditionalExpression")
            return [...strings(node.consequent, seen), ...strings(node.alternate, seen)];
          if (node.type === "CallExpression")
            return node.arguments.flatMap((arg) => strings(arg, seen));
          if (node.type !== "Identifier") return [];
          for (let scope = context.sourceCode.getScope?.(node); scope; scope = scope.upper) {
            const variable = scope.variables.find((item) => item.name === node.name);
            if (variable) return variable.defs.flatMap((def) => strings(def.node?.init, seen));
          }
          return [];
        }
        function inspectDescendantOverrides(node, value) {
          if (typeof value !== "string" || !classContext(node, context)) return;
          for (const token of value.split(/\s+/)) {
            if (
              /(?:docs-search-trigger|docs-nav-link)\]:(?:!?)(?:h-|min-h-|size-|p-|px-|py-|text-(?:control|caption|body|metadata))/.test(
                token,
              )
            )
              context.report({ node, messageId: "useSize", data: { token } });
          }
        }
        return {
          Literal(node) {
            inspectDescendantOverrides(node, node.value);
          },
          TemplateElement(node) {
            inspectDescendantOverrides(node, node.value.raw);
          },
          ImportDeclaration(node) {
            const primitive = node.source.value.match(
              /primitives\/(?:sidebar\/)?(Button|Input|Textarea|Select|SidebarMenuButton)\.astro$/,
            )?.[1];
            if (primitive) {
              for (const specifier of node.specifiers) controls.add(specifier.local.name);
              return;
            }
            if (!node.source.value.startsWith("@erbium/ui/components/")) return;
            for (const specifier of node.specifiers)
              if (sized.has(specifier.imported?.name)) controls.add(specifier.local.name);
          },
          JSXAttribute(node) {
            const opening = context.sourceCode
              .getAncestors(node)
              .findLast((parent) => parent.type === "JSXOpeningElement");
            if (
              !["className", "class"].includes(node.name?.name) ||
              !controls.has(opening?.name?.name)
            )
              return;
            for (const value of strings(node.value)) {
              for (const token of value.split(/\s+/)) {
                if (
                  /(?:^|:)!?(?:h|min-h)-\d+(?:\.\d+)?!?$/.test(token) ||
                  /(?:^|:)!?size-(?:[5-9]|[1-9]\d+)(?:\.\d+)?!?$/.test(token) ||
                  /(?:^|:)!?(?:h|min-h|size)-\[/.test(token)
                )
                  context.report({ node, messageId: "useSize", data: { token } });
              }
            }
          },
        };
      },
    },
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
