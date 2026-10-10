export const file = {
  name: "greeting.ts",
  contents:
    `export function greet(name: string = "world") {\n  const greeting = ` +
    "`Welcome, ${name}!`" +
    `;\n  return greeting;\n}\n`,
};
