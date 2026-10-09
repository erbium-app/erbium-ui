import { CodeBlock } from "@erbium/ui/blocks/code-block";

export default function CodeExample() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <CodeBlock surface="command" language="shell" code="bunx shadcn@latest add @erbium/button" />
      <CodeBlock title="button.tsx" language="tsx" code="<Button>Continue</Button>" />
    </div>
  );
}
