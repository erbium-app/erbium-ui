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
const stockSize = /(?:^|:)!?text-(?:xs|sm|base|lg|xl|\d+xl|micro|button-sm)(?:\/.*)?!?$/;
const arbitraryType =
  /(?:^|:)!?(?:text-\[|text-\(length:|font-\[|leading-|tracking-|\[(?:font(?:-size|-weight|-family|-variation-settings)?|line-height|letter-spacing):)/;
const roleLeadingOverride =
  /(?:^|:)!?text-(?:display|title|subtitle|body|caption|control(?:-sm)?|metadata|code-block|inline-code|field|editable)\//;
const dynamicType = /(?:^|:)(?:text|font|leading|tracking)-$/;
const fontUtilities = new Set([
  "font-sans",
  "font-heading",
  "font-mono",
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
]);

export function classContext(node, context, seen = new Set()) {
  if (seen.has(node)) return false;
  seen.add(node);
  const parents = context.sourceCode.getAncestors(node);
  if (
    parents.some((ancestor) => {
      if (ancestor.type === "JSXAttribute") {
        return (
          classAttributes.has(ancestor.name?.name) || ancestor.name?.namespace?.name === "class"
        );
      }
      if (ancestor.type === "Property")
        return classAttributes.has(ancestor.key?.name ?? ancestor.key?.value);
      if (ancestor.type === "AssignmentExpression") {
        const property = ancestor.left?.property?.name;
        return classAttributes.has(property) || property === "innerHTML";
      }
      if (ancestor.type === "VariableDeclarator")
        return /(?:Class|ClassName|Classes|Styles|Variants)$/.test(ancestor.id?.name ?? "");
      if (ancestor.type !== "CallExpression") return false;
      if (
        ancestor.callee?.property?.name === "setAttribute" &&
        classAttributes.has(ancestor.arguments?.[0]?.value)
      )
        return true;
      const name = ancestor.callee?.name;
      return classFunctions.has(name) || (name ?? "").endsWith("Variants");
    })
  )
    return true;

  // Follow locally named strings/maps into className or cn, including aliases.
  // This closes the gap between an inline class and const small = "text-sm".
  const declaration = parents.findLast((ancestor) => ancestor.type === "VariableDeclarator");
  if (declaration?.id?.type !== "Identifier") return false;
  let scope = context.sourceCode.getScope?.(declaration);
  while (scope) {
    const variable = scope.variables.find((candidate) => candidate.name === declaration.id.name);
    if (variable)
      return variable.references.some((reference) =>
        classContext(reference.identifier, context, seen),
      );
    scope = scope.upper;
  }
  return false;
}

export function typographyViolations(value) {
  return value.split(/\s+/).filter((token) => {
    const font = token.match(/(?:^|:)!?(font-[^\s!]+)!?$/)?.[1];
    return (
      stockSize.test(token) ||
      roleLeadingOverride.test(token) ||
      dynamicType.test(token) ||
      arbitraryType.test(token) ||
      (font !== undefined && !fontUtilities.has(font))
    );
  });
}

export default {
  meta: { name: "erbium-typography" },
  rules: {
    "use-roles": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          useRole:
            '"{{token}}" bypasses Erbium typography. Use a text role (display, title, subtitle, body, caption, control, control-sm, metadata, code-block, inline-code, field, or editable). Define new treatments centrally in typography.css.',
          useToken:
            '"{{property}}" hardcodes typography. Use a text role or the shared chartTextRole adapter for numerical chart APIs.',
        },
      },
      create(context) {
        function inspect(node, value) {
          if (typeof value !== "string" || !classContext(node, context)) return;
          const strings = /\bclass=["']/.test(value)
            ? Array.from(value.matchAll(/\bclass=["']([^"']*)/g), (match) => match[1])
            : [value];
          for (const classes of strings) {
            for (const token of typographyViolations(classes))
              context.report({ node, messageId: "useRole", data: { token } });
          }
        }
        return {
          Property(node) {
            const key = node.key?.name ?? node.key?.value;
            const property =
              typeof key === "string"
                ? key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                : key;
            if (!fontProperties.has(property) || node.value?.type !== "Literal") return;
            const parents = context.sourceCode.getAncestors(node);
            const file =
              context.physicalFilename ?? context.filename ?? context.getFilename?.() ?? "";
            if (
              !file.endsWith(".astro") &&
              parents.some(
                (parent) => parent.type === "JSXAttribute" && parent.name?.name === "style",
              )
            )
              return;
            // SSR defaults for numerical-only chart APIs belong in this adapter.
            if (file.endsWith("/packages/ui/src/lib/typography.ts")) return;
            context.report({ node, messageId: "useToken", data: { property } });
          },
          JSXAttribute(node) {
            const file =
              context.physicalFilename ?? context.filename ?? context.getFilename?.() ?? "";
            const property = node.name?.name;
            const value =
              node.value?.type === "JSXExpressionContainer" ? node.value.expression : node.value;
            if (fontProperties.has(property) && value?.type === "Literal")
              context.report({ node, messageId: "useToken", data: { property } });
            if (
              !file.endsWith(".astro") ||
              node.name?.name !== "style" ||
              typeof node.value?.value !== "string"
            )
              return;
            for (const match of node.value.value.matchAll(
              /(?:^|;)\s*(font(?:-size|-family|-weight|-variation-settings)?|line-height|letter-spacing)\s*:/g,
            )) {
              context.report({ node, messageId: "useToken", data: { property: match[1] } });
            }
          },
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
