import { CodeBlock } from "@erbium/ui/blocks/code-block";

const Example = () => (
  <CodeBlock
    className="w-full max-w-xl"
    lineNumbers
    items={[
      {
        code: `export function App() {
  return <main className="app">Hello, Erbium.</main>;
}`,
        label: "app.tsx",
        language: "tsx",
        value: "component",
      },
      {
        code: `.app {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}`,
        label: "styles.css",
        language: "css",
        value: "styles",
      },
      {
        code: '{ "theme": "system" }',
        disabled: true,
        label: "config.json",
        language: "json",
        value: "config",
      },
    ]}
  />
);

export default Example;
