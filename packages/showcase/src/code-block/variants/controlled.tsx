import { useState } from "react";
import { CodeBlock } from "@erbium/ui/blocks/code-block";

const items = [
  { value: "bun", label: "Bun", language: "shell", code: "bun install" },
  { value: "npm", label: "npm", language: "shell", code: "npm install" },
];
const runItems = [
  { value: "bun", label: "Bun", language: "shell", code: "bun run dev" },
  { value: "npm", label: "npm", language: "shell", code: "npm run dev" },
];

export default function Example() {
  const [manager, setManager] = useState("bun");
  return (
    <div className="grid w-full max-w-xl gap-group">
      <p className="text-caption text-muted-foreground">
        Choose once. Both commands follow your preference.
      </p>
      <CodeBlock surface="command" items={items} value={manager} onValueChange={setManager} />
      <CodeBlock surface="command" items={runItems} value={manager} onValueChange={setManager} />
    </div>
  );
}
