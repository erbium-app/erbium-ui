import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentTitle,
} from "@erbium/ui/components/attachment";

const Demo = () => (
  <AttachmentGroup>
    <Attachment>
      <AttachmentContent>
        <AttachmentTitle>report.pdf</AttachmentTitle>
        <AttachmentDescription>PDF document · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  </AttachmentGroup>
);

export default Demo;
