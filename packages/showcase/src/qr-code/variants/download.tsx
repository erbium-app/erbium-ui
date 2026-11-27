import { QRCode, QRCodeDownload, QRCodeImage } from "@erbium/ui/components/qr-code";

export default function QRCodeDownloadExample() {
  return (
    <QRCode value="https://ui.erbium.app">
      <QRCodeImage aria-label="Scan to open ui.erbium.app" />
      <div className="flex gap-related">
        <QRCodeDownload fileName="erbium" buttonSize="sm">
          Download PNG
        </QRCodeDownload>
        <QRCodeDownload fileName="erbium" format="svg" buttonSize="sm">
          Download SVG
        </QRCodeDownload>
      </div>
    </QRCode>
  );
}
