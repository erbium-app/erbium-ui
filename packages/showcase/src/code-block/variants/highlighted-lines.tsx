import { CodeBlock } from "@erbium/ui/blocks/code-block";

const config = `export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: "es2022",
  },
});
`;

const Example = () => (
  <div className="grid w-full max-w-xl gap-group">
    <CodeBlock
      code={config}
      language="ts"
      title="vite.config.ts"
      lineNumbers
      highlightLines={[3, 4]}
    />
    <CodeBlock code={config} language="ts" highlightLines={[7]} />
  </div>
);

export default Example;
