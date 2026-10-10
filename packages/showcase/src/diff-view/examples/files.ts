const oldFile = {
  name: "greeting.ts",
  contents: "export function greet(name: string) {\n  return `Hello, ${name}`;\n}\n",
};
const newFile = {
  name: "greeting.ts",
  contents:
    'export function greet(name: string = "world") {\n  const greeting = `Welcome, ${name}!`;\n  return greeting;\n}\n',
};
export { oldFile, newFile };
