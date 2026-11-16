export const file = {
  contents: [
    'export function greet(name: string = "world") {',
    `  const greeting = \`Welcome, \${name}!\`;`,
    "  return greeting;",
    "}",
    "",
  ].join("\n"),
  name: "greeting.ts",
};
