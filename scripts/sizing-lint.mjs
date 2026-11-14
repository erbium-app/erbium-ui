import { definePlugin, defineRule } from "vite-plus/lint/plugins";
import { classContext } from "./typography-lint.mjs";

/** @typedef {import("vite-plus/lint/plugins").Context} Context */
/** @typedef {import("vite-plus/lint/plugins").ESTree.Node} Node */
/** @typedef {import("vite-plus/lint/plugins").ESTree.JSXAttribute} JSXAttribute */
/** @typedef {import("vite-plus/lint/plugins").ESTree.JSXElement} JSXElement */
/** @typedef {import("vite-plus/lint/plugins").ESTree.JSXOpeningElement} JSXOpeningElement */
/** @typedef {import("vite-plus/lint/plugins").ESTree.ObjectExpression} ObjectExpression */

// The guard is scoped to shared control recipes. Media, illustrations, layout
// widths, and component-specific tracks remain free to own their dimensions.
const rawControlHeight = /(?:^|:)!?(?:h|min-h|size)-(?:5|6|7|8|9)!?$/u;
const whitespace = /\s+/u;
const importantPrefix = /^!/u;

const controlSelector =
  /(?:docs-search-trigger|docs-nav-link|data-slot=['"]?(?:button|input|textarea|select-trigger|sidebar-menu-button|toggle|input-group))/u;

const controlElementSelector = /(?:_|>|\s)(?:button|input|select|textarea)(?:\]|_|:|\s|$)/u;
const geometryUtility = /^(?:h-|min-h-|size-|p-|px-|py-|pt-|pb-|ps-|pe-)/u;
const spacingUtility = /(?:^|:)!?(?:p|px|py|pt|pb|pl|pr|ps|pe|gap|gap-x|gap-y)-/u;
const heightUtility = /(?:^|:)!?(?:h|min-h)-\d+(?:\.\d+)?!?$/u;
const sizeUtility = /(?:^|:)!?size-(?:[5-9]|[1-9]\d+)(?:\.\d+)?!?$/u;
const arbitraryHeight = /(?:^|:)!?(?:h|min-h|size)-\[/u;
const paddingUtility = /(?:^|:)!?(?:p|px|py|pt|pb|pl|pr|ps|pe)-/u;
const scrollUtility = /(?:^|:)!?overflow-(?:[xy]-)?(?:auto|scroll)!?$/u;
const topBorderUtility = /(?:^|:)!?border-t(?:-|!|$)/u;
const siblingModule = /^\.\/[^/]+$/u;
const lowercaseStart = /^[a-z]/u;
const libraryPath = "/packages/ui/src/";
const scrollContainer = "This scroll container";

const sizedStyleProperties = new Set([
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
]);

const classAttributes = new Set(["className", "class"]);

const overlayClassAttributes = new Set([
  "className",
  "class",
  "viewportClassName",
  "contentClassName",
]);

const scrollValues = new Set(["auto", "scroll"]);

/**
 * @param {string} classes - A space-separated class list.
 * @returns {string[]} The raw control heights that bypass Erbium geometry.
 */
export const sizingViolations = (classes) =>
  classes.split(whitespace).filter((token) => rawControlHeight.test(token));

/**
 * The text of a string literal. Every literal kind has the type "Literal", so
 * the value decides: only a string equals its own conversion.
 * @param {Node | null | undefined} node - Any node.
 * @returns {string | undefined} The string, or undefined for any other node.
 */
const literalText = (node) =>
  node?.type === "Literal" && node.value === String(node.value) ? node.value : undefined;

/**
 * @param {Node | null | undefined} node - Any node.
 * @returns {string | undefined} The name when the node is an identifier.
 */
const identifierName = (node) => (node?.type === "Identifier" ? node.name : undefined);

/**
 * @param {Node} attribute - A JSX attribute or spread attribute.
 * @returns {string | undefined} The plain attribute name, if it has one.
 */
const attributeName = (attribute) =>
  attribute.type === "JSXAttribute" && attribute.name.type === "JSXIdentifier"
    ? attribute.name.name
    : undefined;

/**
 * @param {Node} property - An object property or spread element.
 * @returns {string | undefined} The key as written: an identifier name or a string literal.
 */
const propertyKey = (property) =>
  property.type === "Property"
    ? (identifierName(property.key) ?? literalText(property.key))
    : undefined;

/**
 * @param {JSXOpeningElement | undefined} opening - A JSX opening element.
 * @returns {string | undefined} The tag name when it is a plain identifier.
 */
const tagName = (opening) =>
  opening?.name.type === "JSXIdentifier" ? opening.name.name : undefined;

/**
 * @param {JSXAttribute["value"] | undefined} value - A JSX attribute value.
 * @returns {ObjectExpression | undefined} The object literal inside `{...}`, if any.
 */
const objectValue = (value) =>
  value?.type === "JSXExpressionContainer" && value.expression.type === "ObjectExpression"
    ? value.expression
    : undefined;

/**
 * @param {JSXOpeningElement} opening - A JSX opening element.
 * @returns {ObjectExpression | undefined} The object literal of its first style attribute.
 */
const styleObject = (opening) => {
  const style = opening.attributes.find((attribute) => attributeName(attribute) === "style");

  return style?.type === "JSXAttribute" ? objectValue(style.value) : undefined;
};

/**
 * @param {Context} context - The rule context.
 * @returns {string} The file being linted.
 */
const lintedFile = (context) => context.physicalFilename;

/**
 * Collects the static strings an expression can evaluate to, following local
 * identifiers to their initializers.
 * @param {Context} context - The rule context, for scope lookups.
 * @param {boolean} deep - Whether to also follow array elements and logical operands.
 * @param {Node | null | undefined} node - The expression.
 * @param {Set<Node>} [seen] - Nodes already visited, to stop reference cycles.
 * @returns {string[]} The strings found.
 */
const strings = (context, deep, node, seen = new Set()) => {
  if (node === null || node === undefined || seen.has(node)) {
    return [];
  }

  seen.add(node);
  const text = literalText(node);

  if (text !== undefined) {
    return [text];
  }

  if (node.type === "JSXExpressionContainer") {
    return strings(context, deep, node.expression, seen);
  }

  if (node.type === "TemplateLiteral") {
    return node.quasis.map((part) => part.value.raw);
  }

  if (node.type === "ConditionalExpression") {
    return [
      ...strings(context, deep, node.consequent, seen),
      ...strings(context, deep, node.alternate, seen),
    ];
  }

  if (node.type === "CallExpression") {
    return node.arguments.flatMap((argument) => strings(context, deep, argument, seen));
  }

  if (deep && node.type === "ArrayExpression") {
    return node.elements.flatMap((element) => strings(context, deep, element, seen));
  }

  if (deep && node.type === "LogicalExpression") {
    return [
      ...strings(context, deep, node.left, seen),
      ...strings(context, deep, node.right, seen),
    ];
  }

  if (node.type !== "Identifier") {
    return [];
  }

  let scope = context.sourceCode.getScope(node);

  while (scope !== null) {
    const variable = scope.variables.find((item) => item.name === node.name);

    if (variable !== undefined) {
      return variable.defs.flatMap((definition) =>
        definition.node.type === "VariableDeclarator"
          ? strings(context, deep, definition.node.init, seen)
          : [],
      );
    }

    scope = scope.upper;
  }

  return [];
};

/**
 * @param {ObjectExpression | undefined} style - A style object literal.
 * @param {string} prefix - The property name prefix.
 * @returns {boolean} Whether any property key starts with the prefix.
 */
const hasStyleKey = (style, prefix) =>
  style?.properties.some((property) => (propertyKey(property) ?? "").startsWith(prefix)) ?? false;

/**
 * @param {Context} context - The rule context.
 * @param {ObjectExpression | undefined} style - A style object literal.
 * @returns {boolean} Whether the style sets an overflow property to auto or scroll.
 */
const hasStyleScroll = (context, style) =>
  style?.properties.some(
    (property) =>
      property.type === "Property" &&
      (propertyKey(property) ?? "").startsWith("overflow") &&
      strings(context, true, property.value).some((value) => scrollValues.has(value)),
  ) ?? false;

/**
 * @param {Node} node - The node to start from.
 * @param {Context} context - The rule context.
 * @returns {JSXOpeningElement | undefined} The nearest enclosing JSX opening element.
 */
const openingElementOf = (node, context) => {
  /** @type {JSXOpeningElement | undefined} */
  let nearest;

  for (const ancestor of context.sourceCode.getAncestors(node)) {
    if (ancestor.type === "JSXOpeningElement") {
      nearest = ancestor;
    }
  }

  return nearest;
};

/**
 * @param {string} selector - The arbitrary variant part of a class, up to "]".
 * @returns {boolean} Whether the selector reaches into a shared control.
 */
const targetsControl = (selector) =>
  controlSelector.test(selector) || controlElementSelector.test(selector);

/**
 * @param {string} token - One class token.
 * @param {string} file - The file being linted.
 * @returns {boolean} Whether the token overrides a shared control's geometry.
 */
const overridesGeometry = (token, file) =>
  (!file.includes(libraryPath) && spacingUtility.test(token)) ||
  heightUtility.test(token) ||
  sizeUtility.test(token) ||
  arbitraryHeight.test(token);

const sizedControls = new Set([
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

const useComponentGeometry = defineRule({
  create(context) {
    /** @type {Set<string>} */
    const controls = new Set();

    /**
     * @param {Node} node - A string literal or template element.
     * @param {unknown} value - Its value.
     */
    const inspectDescendantOverrides = (node, value) => {
      if (value !== String(value) || !classContext(node, context)) {
        return;
      }

      // Library recipes may intentionally coordinate children; consumers
      // cannot redefine their control geometry through ancestor selectors.
      if (lintedFile(context).includes(libraryPath)) {
        return;
      }

      for (const token of value.split(whitespace)) {
        const end = token.lastIndexOf("]:");

        if (end === -1) {
          continue;
        }

        const selector = token.slice(0, end + 1);
        const utility = token.slice(end + 2).replace(importantPrefix, "");

        if (targetsControl(selector) && geometryUtility.test(utility)) {
          context.report({ data: { token }, messageId: "useSize", node });
        }
      }
    };

    /**
     * @param {JSXAttribute} node - A style attribute on a sized control.
     */
    const inspectStyle = (node) => {
      for (const property of objectValue(node.value)?.properties ?? []) {
        const key = propertyKey(property);

        if (key !== undefined && sizedStyleProperties.has(key)) {
          context.report({ data: { token: `style.${key}` }, messageId: "useSize", node: property });
        }
      }
    };

    return {
      ImportDeclaration(node) {
        if (!node.source.value.startsWith("@erbium/ui/components/")) {
          return;
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            sizedControls.has(identifierName(specifier.imported) ?? "")
          ) {
            controls.add(specifier.local.name);
          }
        }
      },
      JSXAttribute(node) {
        const owner = tagName(openingElementOf(node, context));
        const name = attributeName(node);

        if (owner === undefined || !controls.has(owner)) {
          return;
        }

        if (name === "style") {
          inspectStyle(node);
        }

        if (name === undefined || !classAttributes.has(name)) {
          return;
        }

        const file = lintedFile(context);

        for (const value of strings(context, false, node.value)) {
          for (const token of value.split(whitespace)) {
            if (overridesGeometry(token, file)) {
              context.report({ data: { token }, messageId: "useSize", node });
            }
          }
        }
      },
      Literal(node) {
        inspectDescendantOverrides(node, node.value);
      },
      TemplateElement(node) {
        inspectDescendantOverrides(node, node.value.raw);
      },
    };
  },
  meta: {
    messages: {
      useSize:
        "Use shared component geometry instead of '{{token}}'; choose an existing size where supported.",
    },
    schema: [],
    type: "problem",
  },
});

const useGeometry = defineRule({
  create(context) {
    /**
     * @param {Node} node - A string literal or template element.
     * @param {unknown} value - Its value.
     */
    const inspect = (node, value) => {
      if (value !== String(value) || !classContext(node, context)) {
        return;
      }

      for (const token of sizingViolations(value)) {
        context.report({ data: { token }, messageId: "useGeometry", node });
      }
    };

    return {
      Literal(node) {
        inspect(node, node.value);
      },
      TemplateElement(node) {
        inspect(node, node.value.raw);
      },
    };
  },
  meta: {
    messages: {
      useGeometry:
        "Use Erbium control geometry instead of '{{token}}'. Height, padding, and typography must stay coordinated.",
    },
    schema: [],
    type: "problem",
  },
});

const separatedFooters = new Set(["CardFooter", "DialogFooter", "DrawerFooter", "SheetFooter"]);

const padded = new Set([
  "CardContent",
  "CardHeader",
  "CardFooter",
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
  "MessageScrollerViewport",
  "CommandList",
  "ComboboxList",
  "AutocompleteList",
  "DropdownMenuList",
  "ContextMenuList",
  "MenubarList",
  "SelectContent",
]);

const scrollChildren = new Set([...scrolling, "Command", "MessageScroller"]);

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

/**
 * @param {string | undefined} component - A component name.
 * @param {Set<string>} names - The names to look for.
 * @returns {component is string} Whether the component is one of the names.
 */
const isOneOf = (component, names) => component !== undefined && names.has(component);

/**
 * @param {string | undefined} component - The element's component.
 * @param {string | undefined} parent - The enclosing element's component.
 * @returns {string} The footer that owns a separator here, or "".
 */
const footerOwnerOf = (component, parent) => {
  if (isOneOf(component, separatedFooters)) {
    return component;
  }

  return component === "Separator" && isOneOf(parent, separatedFooters) ? parent : "";
};

/**
 * @param {string | undefined} component - The element's component.
 * @param {string | undefined} parent - The enclosing element's component.
 * @param {string} tag - The element's plain tag name, or "".
 * @returns {string} The component that owns padding here, or "".
 */
const paddingOwnerOf = (component, parent, tag) => {
  if (isOneOf(component, padded)) {
    return component;
  }

  return isOneOf(parent, padded) && lowercaseStart.test(tag) ? parent : "";
};

const useOverlayLayout = defineRule({
  create(context) {
    /** @type {Map<string, string>} */
    const imports = new Map();

    /** @type {Set<string>} */
    const namespaces = new Set();

    /**
     * @param {JSXElement | undefined} element - A JSX element.
     * @returns {string | undefined} The imported component it renders, if known.
     */
    const name = (element) => {
      const tag = element?.openingElement.name;

      if (
        tag?.type === "JSXMemberExpression" &&
        tag.object.type === "JSXIdentifier" &&
        namespaces.has(tag.object.name)
      ) {
        return tag.property.name;
      }

      return tag?.type === "JSXIdentifier" ? imports.get(tag.name) : undefined;
    };

    /**
     * @param {JSXOpeningElement} opening - A JSX opening element.
     * @param {Set<string>} names - The attribute names to read.
     * @returns {string[]} The static strings of those attributes.
     */
    const attributeStrings = (opening, names) =>
      opening.attributes.flatMap((attribute) =>
        attribute.type === "JSXAttribute" && isOneOf(attributeName(attribute), names)
          ? strings(context, true, attribute.value)
          : [],
      );

    /**
     * @param {JSXElement[]} ancestors - Enclosing elements, nearest first.
     * @param {Set<string>} owners - Components that own scrolling.
     * @returns {string} The nearest scroll owner, or "" when there is none.
     */
    const owner = (ancestors, owners) => {
      for (const ancestor of ancestors) {
        const component = name(ancestor);

        if (isOneOf(component, owners)) {
          return component;
        }

        if (isOneOf(component, portals)) {
          return "";
        }

        const classes = attributeStrings(ancestor.openingElement, classAttributes);

        if (hasStyleScroll(context, styleObject(ancestor.openingElement))) {
          return scrollContainer;
        }

        if (
          classes.some((value) =>
            value.split(whitespace).some((token) => scrollUtility.test(token)),
          )
        ) {
          return scrollContainer;
        }
      }

      return "";
    };

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (!source.startsWith("@erbium/ui/components/") && !siblingModule.test(source)) {
          return;
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportNamespaceSpecifier") {
            namespaces.add(specifier.local.name);
          }

          const imported =
            specifier.type === "ImportSpecifier" ? identifierName(specifier.imported) : undefined;

          if (imported !== undefined && imported !== "") {
            imports.set(specifier.local.name, imported);
          }
        }
      },
      JSXElement(node) {
        const component = name(node);

        /** @type {JSXElement[]} */
        const ancestors = [];

        // Nearest first: getAncestors lists the root first.
        for (const ancestor of context.sourceCode.getAncestors(node)) {
          if (ancestor.type === "JSXElement") {
            ancestors.unshift(ancestor);
          }
        }

        const parent = name(ancestors[0]);

        const classes = attributeStrings(node.openingElement, overlayClassAttributes).flatMap(
          (value) => value.split(whitespace),
        );

        const padding = classes.some((token) => paddingUtility.test(token));
        const nativeScroll = classes.some((token) => scrollUtility.test(token));
        const style = styleObject(node.openingElement);
        const stylePadding = hasStyleKey(style, "padding");
        const styleScroll = hasStyleScroll(context, style);
        const footerOwner = footerOwnerOf(component, parent);

        if (
          footerOwner !== "" &&
          (component === "Separator" ||
            classes.some((token) => topBorderUtility.test(token)) ||
            hasStyleKey(style, "borderTop"))
        ) {
          context.report({
            data: { owner: footerOwner },
            messageId: "separator",
            node: node.openingElement,
          });
        }

        const paddingOwner = paddingOwnerOf(component, parent, tagName(node.openingElement) ?? "");

        if (paddingOwner !== "" && (padding || stylePadding)) {
          context.report({
            data: { owner: paddingOwner },
            messageId: "padding",
            node: node.openingElement,
          });
        }

        // A portal starts a new visual surface even when nested in JSX.
        if (isOneOf(component, portals)) {
          return;
        }

        const scrollOwner = owner(ancestors, scrolling);

        if (
          scrollOwner !== "" &&
          (isOneOf(component, scrollChildren) || nativeScroll || styleScroll)
        ) {
          context.report({
            data: { owner: scrollOwner },
            messageId: "scrolling",
            node: node.openingElement,
          });
        }
      },
    };
  },
  meta: {
    messages: {
      padding:
        "{{owner}} owns its padding. Remove this padding override or extra padded wrapper; compose Header, Content, and Footer as siblings.",
      scrolling:
        "{{owner}} already owns scrolling. Place independently scrolling content beside it in the panel, not inside its viewport.",
      separator:
        "{{owner}} already provides its separator. Remove the extra top border or Separator.",
    },
    schema: [],
    type: "problem",
  },
});

export default definePlugin({
  meta: { name: "erbium-sizing" },
  rules: {
    "use-component-geometry": useComponentGeometry,
    "use-geometry": useGeometry,
    "use-overlay-layout": useOverlayLayout,
  },
});
