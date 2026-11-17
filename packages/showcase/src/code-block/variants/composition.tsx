import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockIcon,
  CodeBlockTitle,
} from "@erbium/ui/blocks/code-block";

export default function CodeBlockCompositionExample() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      code={'{\n  "name": "Erbium",\n  "accessible": true\n}'}
      language="json"
    >
      <CodeBlockHeader className="justify-start">
        <CodeBlockTitle>
          <CodeBlockIcon />
          <span className="truncate">project.json</span>
        </CodeBlockTitle>
        <CodeBlockLanguage />
      </CodeBlockHeader>
      <CodeBlockActions>
        <CodeBlockCopyButton aria-label="Copy project configuration" />
      </CodeBlockActions>
      <CodeBlockContent />
    </CodeBlock>
  );
}
