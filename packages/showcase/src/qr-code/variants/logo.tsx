import { QRCode, QRCodeImage, QRCodeLogo } from "@erbium/ui/components/qr-code";

export default function QRCodeLogoExample() {
  return (
    <QRCode value="https://ui.erbium.app" logoSize={0.26}>
      <QRCodeImage aria-label="Scan to open ui.erbium.app">
        {/* The Erbium mark, in its brand colors where the theme has them. */}
        <QRCodeLogo viewBox="0 0 49 49">
          <path
            className="fill-(--logo-body,var(--foreground))"
            d="M47.54 13.23L34.48 8.71L1.84 31.48L30.06 41.24L36.58 36.69L21.43 31.45V24.63L34.48 29.14L41.01 24.59L27.96 20.08V13.26L41.01 17.78L47.54 13.23Z"
          />
          <path
            className="fill-(--logo-shadow,var(--muted-foreground))"
            d="M13.91 23.11L21.34 31.55V24.73L27.87 20.18V13.37L13.91 23.11Z"
          />
        </QRCodeLogo>
      </QRCodeImage>
    </QRCode>
  );
}
