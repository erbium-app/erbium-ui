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

/** A prompt for a coding agent, composed as in the Code Block prompt example. */
export const PromptBlock = ({ code, className }: { code: string; className?: string }) => (
  <CodeBlock code={code} language="text" wrap className={className}>
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
