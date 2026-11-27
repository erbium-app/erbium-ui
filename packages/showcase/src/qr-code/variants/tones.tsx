import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";

export default function QRCodeTonesExample() {
  return (
    <div className="flex flex-wrap justify-center gap-section">
      <QRCode value="https://ui.erbium.app">
        <QRCodeImage aria-label="Default QR code for ui.erbium.app" size="sm" />
      </QRCode>
      <QRCode value="https://ui.erbium.app" tone="accent">
        <QRCodeImage aria-label="Accent QR code for ui.erbium.app" size="sm" />
      </QRCode>
    </div>
  );
}
