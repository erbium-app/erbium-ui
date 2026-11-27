import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";
import type { QRCodeProps, QRCodeSvgProps } from "@erbium/ui/components/qr-code";

export const defaultProps = {
  size: "default",
  tone: "default",
  value: "https://ui.erbium.app",
} satisfies PlaygroundProps;

type PlaygroundProps = Pick<QRCodeSvgProps, "size"> & Pick<QRCodeProps, "tone" | "value">;

export default function QRCodePlaygroundExample({
  size,
  tone,
  value,
}: PlaygroundProps = defaultProps) {
  return (
    <QRCode value={value} tone={tone}>
      <QRCodeImage aria-label="Scan to open the link" size={size} />
    </QRCode>
  );
}
