// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { QRCode } from "./index";

describe("QR code on the server", () => {
  it("renders the whole code, with the logo's space already clear", () => {
    const markup = renderToString(
      <QRCode.Root value="https://ui.erbium.app" logoSize={0.2}>
        <QRCode.Svg aria-label="Open Erbium">
          <QRCode.Modules />
          <QRCode.EyeFrames />
          <QRCode.EyeCenters />
          <QRCode.Logo />
        </QRCode.Svg>
      </QRCode.Root>,
    );

    expect([
      markup.includes('aria-label="Open Erbium"'),
      markup.includes('data-logo=""'),
      markup.split("<path").length - 1,
    ]).toStrictEqual([true, true, 3]);
  });
});
