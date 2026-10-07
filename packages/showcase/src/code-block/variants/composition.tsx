import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@erbium/ui/blocks/code-block";
import { CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";

export default function Example() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      code={'{\n  "name": "Erbium",\n  "accessible": true\n}'}
      language="json"
    >
      <CodeBlockHeader>
        <CodeBlockTitle>project.json</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockLanguage className="me-2" />
          <CodeBlockCopyButton aria-label="Copy project configuration" variant="outline">
            <CopyButtonIcon data-icon="inline-start" />
            <CopyButtonLabel />
          </CodeBlockCopyButton>
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent />
    </CodeBlock>
  );
}
