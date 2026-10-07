import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@erbium/ui/blocks/code-block";

export default function Example() {
  return (
    <div className="grid w-full max-w-xl gap-4">
      <CodeBlock code="" title="Empty source" />
      <CodeBlock
        code="An unsupported language remains readable and copyable."
        language="unknown-language"
      />
      <CodeBlock code="Copy is unavailable for this example." title="Disabled copy">
        <CodeBlockHeader>
          <CodeBlockTitle>Disabled copy</CodeBlockTitle>
          <CodeBlockCopyButton disabled />
        </CodeBlockHeader>
        <CodeBlockContent />
      </CodeBlock>
      <CodeBlock items={[]} title="No examples" />
    </div>
  );
}
