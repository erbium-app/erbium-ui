import { CodeBlock } from "@erbium/ui/blocks/code-block";

export default function Example() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      surface="command"
      defaultValue="bun"
      items={[
        {
          value: "bun",
          label: "Bun",
          language: "shell",
          code: "bunx shadcn@latest add @erbium/button",
        },
        {
          value: "npm",
          label: "npm",
          language: "shell",
          code: "npx shadcn@latest add @erbium/button",
        },
        {
          value: "pnpm",
          label: "pnpm",
          language: "shell",
          code: "pnpm dlx shadcn@latest add @erbium/button",
        },
        {
          value: "yarn",
          label: "Yarn",
          language: "shell",
          code: "yarn dlx shadcn@latest add @erbium/button",
        },
      ]}
    />
  );
}
