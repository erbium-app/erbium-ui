import { CodeBlock } from "@erbium/ui/blocks/code-block";

const Example = () => (
  <div className="grid w-full max-w-xl gap-group">
    <CodeBlock title="TypeScript" language="typescript" code='const name: string = "Erbium";' />
    <CodeBlock title="Python" language="py" code='print("Hello, Erbium.")' />
    <CodeBlock title="Plain text" language="text" code="A readable source without highlighting." />
    <CodeBlock
      title="Unknown language"
      language="unknown-language"
      code="Unknown languages use the generic file icon."
    />
  </div>
);

export default Example;
