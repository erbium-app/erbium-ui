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
    "use-overlay-layout": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          padding:
            "{{owner}} owns its padding. Remove this padding override or extra padded wrapper; compose Header, Content, and Footer as siblings.",
          scrolling:
            "{{owner}} already owns scrolling. Place independently scrolling content beside it in the panel, not inside its viewport.",
        },
      },
      create(context) {
        const imports = new Map();
        const namespaces = new Set();
        const padded = new Set([
          "DialogContent",
          "DrawerContent",
          "SheetContent",
          "PopoverContent",
          "HoverCardContent",
          "AlertDialogContent",
        ]);
        const scrolling = new Set([
          "DialogContent",
          "DrawerContent",
          "SheetContent",
          "ScrollArea",
          "SidebarContent",
          "CommandList",
          "ComboboxList",
          "AutocompleteList",
          "DropdownMenuList",
          "ContextMenuList",
          "MenubarList",
          "SelectContent",
        ]);
        const scrollChildren = new Set([...scrolling, "Command"]);
        // These components portal their children; lexical nesting is not scroll nesting.
        const portals = new Set([
          "DialogPanel",
          "DrawerPanel",
          "SheetPanel",
          "CommandDialog",
          "PopoverContent",
          "HoverCardContent",
          "AlertDialogContent",
          "DropdownMenuContent",
          "DropdownMenuSubContent",
          "ContextMenuContent",
          "ContextMenuSubContent",
          "MenubarContent",
          "MenubarSubContent",
          "ComboboxContent",
          "AutocompletePopup",
          "SelectContent",
          "TooltipContent",
        ]);
        function name(element) {
          const tag = element?.openingElement.name;
          if (tag?.type === "JSXMemberExpression" && namespaces.has(tag.object.name))
            return tag.property.name;
          return imports.get(tag?.name);
        }
        function strings(node, seen = new Set()) {
          if (!node || seen.has(node)) return [];
          seen.add(node);
          if (node.type === "Literal" && typeof node.value === "string") return [node.value];
          if (node.type === "JSXExpressionContainer") return strings(node.expression, seen);
          if (node.type === "TemplateLiteral") return node.quasis.map((part) => part.value.raw);
          if (node.type === "ConditionalExpression")
            return [...strings(node.consequent, seen), ...strings(node.alternate, seen)];
          if (node.type === "CallExpression" || node.type === "ArrayExpression")
            return (node.arguments ?? node.elements).flatMap((arg) => strings(arg, seen));
          if (node.type === "LogicalExpression")
            return [...strings(node.left, seen), ...strings(node.right, seen)];
          if (node.type !== "Identifier") return [];
          for (let scope = context.sourceCode.getScope?.(node); scope; scope = scope.upper) {
            const variable = scope.variables.find((item) => item.name === node.name);
            if (variable) return variable.defs.flatMap((def) => strings(def.node?.init, seen));
          }
          return [];
        }
        function owner(ancestors, owners) {
          for (const ancestor of ancestors) {
            const component = name(ancestor);
            if (owners.has(component)) return component;
            if (portals.has(component)) return null;
            const classes = ancestor.openingElement.attributes
              .filter((attribute) => ["className", "class"].includes(attribute.name?.name))
              .flatMap((attribute) => strings(attribute.value));
            const style = ancestor.openingElement.attributes.find(
              (attribute) => attribute.name?.name === "style",
            )?.value?.expression;
            if (
              style?.properties?.some(
                (property) =>
                  (property.key?.name ?? property.key?.value ?? "").startsWith("overflow") &&
                  strings(property.value).some((value) => ["auto", "scroll"].includes(value)),
              )
            )
              return "This scroll container";
            if (
              classes.some((value) =>
                value
                  .split(/\s+/)
                  .some((token) => /(?:^|:)!?overflow-(?:[xy]-)?(?:auto|scroll)!?$/.test(token)),
              )
            )
              return "This scroll container";
          }
          return null;
        }
        return {
          ImportDeclaration(node) {
            const source = node.source.value;
            if (!source.startsWith("@erbium/ui/components/") && !/^\.\/[^/]+$/.test(source)) return;
            for (const specifier of node.specifiers) {
              if (specifier.type === "ImportNamespaceSpecifier")
                namespaces.add(specifier.local.name);
              if (specifier.imported?.name)
                imports.set(specifier.local.name, specifier.imported.name);
            }
          },
          JSXElement(node) {
            const component = name(node);
            const ancestors = context.sourceCode
              .getAncestors(node)
              .filter((parent) => parent.type === "JSXElement")
              .reverse();
            const attributes = node.openingElement.attributes;
            const classes = attributes
              .filter((attribute) =>
                ["className", "class", "viewportClassName", "contentClassName"].includes(
                  attribute.name?.name,
                ),
              )
              .flatMap((attribute) => strings(attribute.value))
              .flatMap((value) => value.split(/\s+/));
            const padding = classes.some((token) =>
              /(?:^|:)!?(?:p|px|py|pt|pb|pl|pr|ps|pe)-/.test(token),
            );
            const nativeScroll = classes.some((token) =>
              /(?:^|:)!?overflow-(?:[xy]-)?(?:auto|scroll)!?$/.test(token),
            );
            const style = attributes.find((attribute) => attribute.name?.name === "style")?.value
              ?.expression;
            const stylePadding = style?.properties?.some((property) =>
              (property.key?.name ?? property.key?.value ?? "").startsWith("padding"),
            );
            const styleScroll = style?.properties?.some(
              (property) =>
                (property.key?.name ?? property.key?.value ?? "").startsWith("overflow") &&
                strings(property.value).some((value) => ["auto", "scroll"].includes(value)),
            );
            const paddingOwner = padded.has(component)
              ? component
              : padded.has(name(ancestors[0])) && /^[a-z]/.test(node.openingElement.name.name ?? "")
                ? name(ancestors[0])
                : null;
            if (paddingOwner && (padding || stylePadding))
              context.report({
                node: node.openingElement,
                messageId: "padding",
                data: { owner: paddingOwner },
              });
            // A portal starts a new visual surface even when nested in JSX.
            if (portals.has(component)) return;
            const scrollOwner = owner(ancestors, scrolling);
            if (scrollOwner && (scrollChildren.has(component) || nativeScroll || styleScroll))
              context.report({
                node: node.openingElement,
                messageId: "scrolling",
                data: { owner: scrollOwner },
              });
          },
        };
      },
    },
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
          const file = context.physicalFilename ?? context.filename ?? "";
          // Library recipes may intentionally coordinate children; consumers
          // cannot redefine their control geometry through ancestor selectors.
          if (file.includes("/packages/ui/src/")) return;
          for (const token of value.split(/\s+/)) {
            const end = token.lastIndexOf("]:");
            if (end < 0) continue;
            const selector = token.slice(0, end + 1);
            const utility = token.slice(end + 2).replace(/^!/, "");
            const targetsControl =
              /(?:docs-search-trigger|docs-nav-link|data-slot=['"]?(?:button|input|textarea|select-trigger|sidebar-menu-button|toggle|input-group))/.test(
                selector,
              ) || /(?:_|>|\s)(?:button|input|select|textarea)(?:\]|_|:|\s|$)/.test(selector);
            if (targetsControl && /^(?:h-|min-h-|size-|p-|px-|py-|pt-|pb-|ps-|pe-)/.test(utility))
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
            if (controls.has(opening?.name?.name) && node.name?.name === "style") {
              const expression =
                node.value?.type === "JSXExpressionContainer" ? node.value.expression : null;
              for (const property of expression?.properties ?? []) {
                const key = property.key?.name ?? property.key?.value;
                if (
                  [
                    "height",
                    "minHeight",
                    "maxHeight",
                    "padding",
                    "paddingBlock",
                    "paddingInline",
                    "paddingTop",
                    "paddingBottom",
                    "paddingLeft",
                    "paddingRight",
                  ].includes(key)
                )
                  context.report({
                    node: property,
                    messageId: "useSize",
                    data: { token: `style.${key}` },
                  });
              }
            }
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
