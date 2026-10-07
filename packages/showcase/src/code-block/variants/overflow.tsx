import { CodeBlock } from "@erbium/ui/blocks/code-block";

const code =
  'const description = "A code block preserves the original source, including long lines, while keeping the surrounding layout within the available width.";';

export default function Example() {
  return (
    <div className="grid w-full max-w-xl gap-4">
      <CodeBlock code={code} language="ts" title="Horizontal scrolling" />
      <CodeBlock code={code} language="ts" title="Wrapped lines" wrap />
      <CodeBlock
        code={Array.from({ length: 40 }, (_, index) => `console.log("Line ${index + 1}");`).join(
          "\n",
        )}
        language="js"
        title="Bounded height"
        lineNumbers
      />
    </div>
  );
}
