import { definePlugin, defineRule } from "vite-plus/lint/plugins";

/** @typedef {import("vite-plus/lint/plugins").Context} Context */
/** @typedef {import("vite-plus/lint/plugins").ESTree.Node} Node */
/** @typedef {import("vite-plus/lint/plugins").ESTree.JSXAttribute} JSXAttribute */
/** @typedef {import("vite-plus/lint/plugins").ESTree.CallExpression} CallExpression */
/** @typedef {import("vite-plus/lint/plugins").ESTree.VariableDeclarator} VariableDeclarator */

// shadcn/lint validates Tailwind vocabulary and component contracts. This rule
// additionally keeps valid but off-policy typography out of HTML and recipes.
const classFunctions = new Set(["cn", "cva", "clsx", "classNames", "classnames", "twMerge"]);
const classAttributes = new Set(["class", "className", "classNames"]);

const fontProperties = new Set([
  "font",
  "fontSize",
  "fontFamily",
  "fontWeight",
  "fontVariationSettings",
  "lineHeight",
  "letterSpacing",
]);

const stockSize = /(?:^|:)!?text-(?:xs|sm|base|lg|xl|\d+xl|micro|button-sm)(?:\/.*)?!?$/u;

const arbitraryType =
  /(?:^|:)!?(?:text-\[|text-\(length:|font-\[|leading-|tracking-|\[(?:font(?:-size|-weight|-family|-variation-settings)?|line-height|letter-spacing):)/u;

const roleLeadingOverride =
  /(?:^|:)!?text-(?:display|title|subtitle|body|caption|control(?:-sm)?|metadata|code-block|inline-code|field|editable)\//u;

const dynamicType = /(?:^|:)(?:text|font|leading|tracking)-$/u;

const typesetModifier = /(?:^|:)typeset-(?:docs|compact)$/u;

const fontUtility = /(?:^|:)!?(?<font>font-[^\s!]+)!?$/u;

const classVariable = /(?:Class|ClassName|Classes|Styles|Variants)$/u;

const fontUtilities = new Set([
  "font-sans",
  "font-heading",
  "font-mono",
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
]);

/**
 * The text of a string literal. Oxc gives every literal kind the type
 * "Literal", so the value decides: only a string equals its own conversion.
 * @param {Node | null | undefined} node - Any node, usually a key or an argument.
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
 * @param {JSXAttribute} attribute - A JSX attribute.
 * @returns {boolean} Whether it is class, className, classNames, or class:*.
 */
const isClassAttribute = (attribute) =>
  attribute.name.type === "JSXNamespacedName"
    ? attribute.name.namespace.name === "class"
    : classAttributes.has(attribute.name.name);

/**
 * @param {CallExpression} call - A call expression.
 * @returns {boolean} Whether its arguments become class names.
 */
const isClassCall = (call) => {
  const { callee } = call;

  if (
    callee.type === "MemberExpression" &&
    identifierName(callee.property) === "setAttribute" &&
    classAttributes.has(literalText(call.arguments[0]) ?? "")
  ) {
    return true;
  }

  const name = identifierName(callee) ?? "";

  return classFunctions.has(name) || name.endsWith("Variants");
};

/**
 * @param {Node} ancestor - One ancestor of the inspected node.
 * @returns {boolean} Whether the ancestor puts its strings in a class context.
 */
const isClassAncestor = (ancestor) => {
  if (ancestor.type === "JSXAttribute") {
    return isClassAttribute(ancestor);
  }

  if (ancestor.type === "Property") {
    return classAttributes.has(identifierName(ancestor.key) ?? literalText(ancestor.key) ?? "");
  }

  if (ancestor.type === "AssignmentExpression") {
    if (ancestor.left.type !== "MemberExpression") {
      return false;
    }

    const property = identifierName(ancestor.left.property) ?? "";

    return classAttributes.has(property) || property === "innerHTML";
  }

  if (ancestor.type === "VariableDeclarator") {
    return classVariable.test(identifierName(ancestor.id) ?? "");
  }

  return ancestor.type === "CallExpression" && isClassCall(ancestor);
};

/**
 * @param {Node} ancestor - One ancestor of a style property.
 * @returns {boolean} Whether it is a JSX style attribute.
 */
const isStyleAttribute = (ancestor) =>
  ancestor.type === "JSXAttribute" &&
  ancestor.name.type === "JSXIdentifier" &&
  ancestor.name.name === "style";

/**
 * Whether a string node ends up in a class list: directly, through a class
 * helper, or through a local variable that is later used as one.
 * @param {Node} node - The string-bearing node.
 * @param {Context} context - The rule context.
 * @param {Set<Node>} [seen] - Nodes already visited, to stop reference cycles.
 * @returns {boolean} Whether the node's text is used as classes.
 */
export const classContext = (node, context, seen = new Set()) => {
  if (seen.has(node)) {
    return false;
  }

  seen.add(node);
  const parents = context.sourceCode.getAncestors(node);

  if (parents.some(isClassAncestor)) {
    return true;
  }

  // Follow locally named strings/maps into className or cn, including aliases.
  // This closes the gap between an inline class and const small = "text-sm".
  /** @type {VariableDeclarator | undefined} */
  let declaration;

  for (const ancestor of parents) {
    if (ancestor.type === "VariableDeclarator") {
      declaration = ancestor;
    }
  }

  if (declaration?.id.type !== "Identifier") {
    return false;
  }

  const { name } = declaration.id;
  let scope = context.sourceCode.getScope(declaration);

  while (scope !== null) {
    const variable = scope.variables.find((candidate) => candidate.name === name);

    if (variable !== undefined) {
      return variable.references.some((reference) =>
        classContext(reference.identifier, context, seen),
      );
    }

    scope = scope.upper;
  }

  return false;
};

/**
 * @param {string} value - A space-separated class list.
 * @returns {string[]} The tokens that bypass the typography roles.
 */
export const typographyViolations = (value) =>
  value.split(/\s+/u).filter((token) => {
    const font = fontUtility.exec(token)?.groups?.font;

    return (
      typesetModifier.test(token) ||
      stockSize.test(token) ||
      roleLeadingOverride.test(token) ||
      dynamicType.test(token) ||
      arbitraryType.test(token) ||
      (font !== undefined && !fontUtilities.has(font))
    );
  });

/**
 * @param {string} key - A style property key, in camel or kebab case.
 * @returns {string} The key in camel case.
 */
const camelCase = (key) => key.replaceAll(/-[a-z]/gu, (match) => match.slice(1).toUpperCase());

const useRoles = defineRule({
  create(context) {
    /**
     * @param {Node} node - The node to report on.
     * @param {string} value - Its text: a class list or HTML with class attributes.
     */
    const inspect = (node, value) => {
      if (!classContext(node, context)) {
        return;
      }

      const strings = /\bclass=["']/u.test(value)
        ? Array.from(
            value.matchAll(/\bclass=["'](?<classes>[^"']*)/gu),
            (match) => match.groups?.classes ?? "",
          )
        : [value];

      for (const classes of strings) {
        for (const token of typographyViolations(classes)) {
          context.report({ data: { token }, messageId: "useRole", node });
        }
      }
    };

    return {
      JSXAttribute(node) {
        const property = node.name.type === "JSXIdentifier" ? node.name.name : "";

        const value =
          node.value?.type === "JSXExpressionContainer" ? node.value.expression : node.value;

        if (fontProperties.has(property) && value?.type === "Literal") {
          context.report({ data: { property }, messageId: "useToken", node });
        }
      },
      Literal(node) {
        const text = literalText(node);

        if (text !== undefined) {
          inspect(node, text);
        }
      },
      Property(node) {
        const key = identifierName(node.key) ?? literalText(node.key);

        if (key === undefined) {
          return;
        }

        const property = camelCase(key);

        if (!fontProperties.has(property) || node.value.type !== "Literal") {
          return;
        }

        const insideStyle = context.sourceCode.getAncestors(node).some(isStyleAttribute);

        // SSR defaults for numerical-only chart APIs belong in this adapter.
        if (
          insideStyle ||
          context.physicalFilename.endsWith("/packages/ui/src/lib/typography.ts")
        ) {
          return;
        }

        context.report({ data: { property }, messageId: "useToken", node });
      },
      TemplateElement(node) {
        inspect(node, node.value.raw);
      },
    };
  },
  meta: {
    messages: {
      useRole:
        '"{{token}}" bypasses Erbium typography. Use a text role (display, title, subtitle, body, caption, control, control-sm, metadata, code-block, inline-code, field, or editable). Define new treatments centrally in typography.css.',
      useToken:
        '"{{property}}" hardcodes typography. Use a text role or the shared chartTextRole adapter for numerical chart APIs.',
    },
    schema: [],
    type: "problem",
  },
});

export default definePlugin({
  meta: { name: "erbium-typography" },
  rules: { "use-roles": useRoles },
});
