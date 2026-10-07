import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { DirectionProvider } from "@erbium/ui/components/direction";

export default function Example() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-full max-w-xl">
        <CodeBlock
          defaultValue="bun"
          surface="command"
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
          ]}
        />
      </div>
    </DirectionProvider>
  );
}
