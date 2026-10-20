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
import { CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";

const Example = () => (
  <CodeBlock
    className="w-full max-w-xl"
    code={'{\n  "name": "Erbium",\n  "accessible": true\n}'}
    language="json"
  >
    <CodeBlockHeader className="justify-start pe-24">
      <CodeBlockTitle>
        <CodeBlockIcon />
        <span className="truncate">project.json</span>
      </CodeBlockTitle>
      <CodeBlockLanguage />
    </CodeBlockHeader>
    <CodeBlockActions>
      <CodeBlockCopyButton aria-label="Copy project configuration">
        <CopyButtonIcon data-icon="inline-start" />
        <CopyButtonLabel />
      </CodeBlockCopyButton>
    </CodeBlockActions>
    <CodeBlockContent className="pe-24" />
  </CodeBlock>
);

export default Example;
