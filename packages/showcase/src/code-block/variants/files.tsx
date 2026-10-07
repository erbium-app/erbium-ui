import { CodeBlock } from "@erbium/ui/blocks/code-block";

export default function Example() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      lineNumbers
      items={[
        {
          value: "component",
          label: "app.tsx",
          language: "tsx",
          code: `export function App() {
  return <main className="app">Hello, Erbium.</main>;
}`,
        },
        {
          value: "styles",
          label: "styles.css",
          language: "css",
          code: `.app {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}`,
        },
        {
          value: "config",
          label: "config.json",
          language: "json",
          code: '{ "theme": "system" }',
          disabled: true,
        },
      ]}
    />
  );
}
