import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockIcon,
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
      <CodeBlock code="This source remains copyable with a custom header." title="Custom header">
        <CodeBlockHeader>
          <CodeBlockTitle>
            <CodeBlockIcon />
            <span className="truncate">Custom header</span>
          </CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockActions>
          <CodeBlockCopyButton />
        </CodeBlockActions>
        <CodeBlockContent />
      </CodeBlock>
    </div>
  );
}
