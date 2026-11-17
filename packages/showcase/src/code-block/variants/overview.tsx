import { CodeBlock } from "@erbium/ui/blocks/code-block";

const code = `import { Button } from "@erbium/ui/components/button";

export function SaveButton() {
  return <Button>Save changes</Button>;
}
`;

export default function CodeBlockExample() {
  return (
    <CodeBlock className="w-full max-w-xl" code={code} language="tsx" title="save-button.tsx" />
  );
}
