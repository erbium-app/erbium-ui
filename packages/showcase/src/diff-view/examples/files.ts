const oldFile = {
  contents: [
    "export function greet(name: string) {",
    `  return \`Hello, \${name}\`;`,
    "}",
    "",
  ].join("\n"),
  name: "greeting.ts",
};

const newFile = {
  contents: [
    'export function greet(name: string = "world") {',
    `  const greeting = \`Welcome, \${name}!\`;`,
    "  return greeting;",
    "}",
    "",
  ].join("\n"),
  name: "greeting.ts",
};

export { oldFile, newFile };
