import {
  CopyButton,
  CopyButtonIcon,
  CopyButtonLabel,
  CopyButtonLabelIdle,
  CopyButtonLabelCopied,
  CopyButtonLabelError,
} from "@erbium/ui/blocks/copy-button";

const Example = () => (
  <div className="flex flex-wrap items-center gap-3">
    <CopyButton value="Small" size="icon-xs" variant="outline" />
    <CopyButton value="Medium" size="icon-sm" variant="secondary" />
    <CopyButton value="Large" size="icon-lg" />
    <CopyButton value="Erbium UI" size="sm" variant="outline">
      <CopyButtonIcon data-icon="inline-start" />
      <CopyButtonLabel />
    </CopyButton>
    <CopyButton value="Erbium UI" size="sm" variant="outline">
      <CopyButtonIcon data-icon="inline-start" />
      <CopyButtonLabel>
        <CopyButtonLabelIdle>Copy project name</CopyButtonLabelIdle>
        <CopyButtonLabelCopied>Name copied!</CopyButtonLabelCopied>
        <CopyButtonLabelError>Try again</CopyButtonLabelError>
      </CopyButtonLabel>
    </CopyButton>
  </div>
);

export default Example;
