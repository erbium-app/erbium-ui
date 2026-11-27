import { CopyButton } from "@erbium/ui/blocks/copy-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Icon } from "@erbium/ui/components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@erbium/ui/components/input-group";
import { QRCode, QRCodeDownload, QRCodeImage } from "@erbium/ui/components/qr-code";

const link = "https://ui.erbium.app/invite/9f8a7b6c";

export default function QRCodeShareLinkExample() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Invite your team</CardTitle>
        <CardDescription>Scan the code or send the link.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-group">
        <QRCode value={link} className="w-full">
          <QRCodeImage aria-label="Scan to open the invite link" />
          <InputGroup>
            <InputGroupInput aria-label="Invite link" dir="ltr" readOnly value={link} />
            <InputGroupAddon align="inline-end">
              <CopyButton
                value={link}
                aria-label="Copy invite link"
                render={<InputGroupButton variant="embedded" size="icon-xs" />}
              />
              <QRCodeDownload
                aria-label="Download QR code"
                fileName="invite"
                render={<InputGroupButton variant="embedded" size="icon-xs" />}
              >
                <Icon name="download-01" />
              </QRCodeDownload>
            </InputGroupAddon>
          </InputGroup>
        </QRCode>
      </CardContent>
    </Card>
  );
}
