import { CodeBlock } from "@erbium/ui/blocks/code-block";

export default function CodeBlockLanguagesExample() {
  return (
    <div className="grid w-full max-w-xl gap-group">
      <CodeBlock title="TypeScript" language="typescript" code='const name: string = "Erbium";' />
      <CodeBlock title="Python" language="py" code='print("Hello, Erbium.")' />
      <CodeBlock
        title="Patch"
        language="diff"
        code={'@@ -1,2 +1,2 @@\n const theme = "system";\n-const radius = 4;\n+const radius = 8;'}
      />
      <CodeBlock
        title="Terminal output"
        language="ansi"
        code={"\u001B[32m✓\u001B[0m built in 120ms\n\u001B[33mwarning\u001B[0m: 2 unused exports"}
      />
      <CodeBlock
        title="Plain text"
        language="text"
        code="A readable source without highlighting."
      />
      <CodeBlock
        title="Unknown language"
        language="unknown-language"
        code="Unknown languages use the generic file icon."
      />
    </div>
  );
}
