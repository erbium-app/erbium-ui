import { useState } from "react";
import { CodeBlock } from "@erbium/ui/blocks/code-block";

const items = [
  { code: "bun install", label: "Bun", language: "shell", value: "bun" },
  { code: "npm install", label: "npm", language: "shell", value: "npm" },
];

const runItems = [
  { code: "bun run dev", label: "Bun", language: "shell", value: "bun" },
  { code: "npm run dev", label: "npm", language: "shell", value: "npm" },
];

const Example = () => {
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
};

export default Example;
