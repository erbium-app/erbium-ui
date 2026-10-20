import { CodeBlock } from "@erbium/ui/blocks/code-block";

const Example = () => (
  <CodeBlock
    className="w-full max-w-xl"
    surface="command"
    defaultValue="bun"
    items={[
      {
        code: "bunx shadcn@latest add @erbium/button",
        label: "Bun",
        language: "shell",
        value: "bun",
      },
      {
        code: "npx shadcn@latest add @erbium/button",
        label: "npm",
        language: "shell",
        value: "npm",
      },
      {
        code: "pnpm dlx shadcn@latest add @erbium/button",
        label: "pnpm",
        language: "shell",
        value: "pnpm",
      },
      {
        code: "yarn dlx shadcn@latest add @erbium/button",
        label: "Yarn",
        language: "shell",
        value: "yarn",
      },
    ]}
  />
);

export default Example;
