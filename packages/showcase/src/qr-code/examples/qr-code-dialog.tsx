import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";
import { QRCode, QRCodeDownload, QRCodeImage } from "@erbium/ui/components/qr-code";

export default function QRCodeDialogExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Show QR code</Button>} />
      <DialogPanel className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Open on your phone</DialogTitle>
          <DialogDescription>Scan the code with your camera.</DialogDescription>
        </DialogHeader>
        <DialogContent className="flex justify-center">
          <QRCode value="https://ui.erbium.app">
            <QRCodeImage aria-label="Scan to open ui.erbium.app" size="lg" />
            <QRCodeDownload fileName="erbium" buttonSize="sm">
              Download
            </QRCodeDownload>
          </QRCode>
        </DialogContent>
      </DialogPanel>
    </Dialog>
  );
}
