const oldFile = {
  contents: "export function greet(name: string) {\n  return `Hello, ${name}`;\n}\n",
  name: "greeting.ts",
};

const newFile = {
  contents:
    'export function greet(name: string = "world") {\n  const greeting = `Welcome, ${name}!`;\n  return greeting;\n}\n',
  name: "greeting.ts",
};

export { oldFile, newFile };
