import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";
import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";

export default function QRCodeItemExample() {
  return (
    <Item variant="card" className="w-96">
      <ItemMedia>
        <QRCode value="https://ui.erbium.app">
          <QRCodeImage aria-label="Scan to get the mobile app" size="sm" />
        </QRCode>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Get the mobile app</ItemTitle>
        <ItemDescription>Point your phone’s camera at the code to install it.</ItemDescription>
      </ItemContent>
    </Item>
  );
}
