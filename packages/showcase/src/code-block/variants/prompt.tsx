import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@erbium/ui/blocks/code-block";
import {
  CopyButtonIcon,
  CopyButtonLabel,
  CopyButtonLabelCopied,
  CopyButtonLabelError,
  CopyButtonLabelIdle,
} from "@erbium/ui/blocks/copy-button";

const prompt = `Build a settings form with Erbium UI: a name field, an email field, and a switch for email notifications.

1. Run \`erbium search form\` and read the match with \`erbium docs form\` before writing code.
2. Install what you need with \`erbium add\`, and compose the form from the installed components.
3. Show validation errors inside each field, and keep the labels with their controls.
4. Run \`erbium check\` and the project's build when you are done.`;

export default function CodeBlockPromptExample() {
  return (
    <CodeBlock className="w-full max-w-xl" code={prompt} language="text" wrap>
      <CodeBlockHeader className="pe-32">
        <CodeBlockTitle>Prompt</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockActions>
        <CodeBlockCopyButton aria-label="Copy prompt">
          <CopyButtonIcon data-icon="inline-start" />
          <CopyButtonLabel>
            <CopyButtonLabelIdle>Copy prompt</CopyButtonLabelIdle>
            <CopyButtonLabelCopied>Copied</CopyButtonLabelCopied>
            <CopyButtonLabelError>Failed</CopyButtonLabelError>
          </CopyButtonLabel>
        </CodeBlockCopyButton>
      </CodeBlockActions>
      <CodeBlockContent />
    </CodeBlock>
  );
}
