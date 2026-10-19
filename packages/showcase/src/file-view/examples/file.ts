export const file = {
  contents:
    `export function greet(name: string = "world") {\n  const greeting = ` +
    "`Welcome, ${name}!`" +
    `;\n  return greeting;\n}\n`,
  name: "greeting.ts",
};
