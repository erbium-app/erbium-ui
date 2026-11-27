import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";

export default function QRCodeExample() {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Open on your phone</CardTitle>
        <CardDescription>Scan the code with your camera.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <QRCode value="https://ui.erbium.app">
          <QRCodeImage aria-label="Scan to open ui.erbium.app" />
        </QRCode>
      </CardContent>
    </Card>
  );
}
