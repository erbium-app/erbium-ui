// @vitest-environment node
import { Resvg } from "@resvg/resvg-js";
import jsQR from "jsqr";
import { describe, expect, it } from "vite-plus/test";
import {
  encodeQRCode,
  getQRCodeEyeCentersPath,
  getQRCodeEyeFramesPath,
  getQRCodeModulesPath,
  isQRCodeDataModule,
  QR_CODE_MARGIN,
  QR_CODE_MAX_LOGO_SIZE,
} from "./core";
import type { QRCodeData } from "./core";

const url = "https://ui.erbium.app";

const values = [
  url,
  "https://ui.erbium.app/docs/components/qr-code",
  "https://pair.example.com/#token=9f8a7b6c5d4e3f2a1b0c",
  "WIFI:T:WPA;S:erbium;P:correct-horse;;",
  "otpauth://totp/Erbium:demo?secret=JBSWY3DPEHPK3PXP&issuer=Erbium",
  "سلام دنیا",
];

const draw = (code: QRCodeData) => {
  const total = code.size + QR_CODE_MARGIN * 2;
  const { cutout } = code;

  // A solid block over the whole cutout is the worst logo it can hold.
  const logo =
    cutout === null
      ? ""
      : `<rect x="${cutout.x + QR_CODE_MARGIN}" y="${cutout.y + QR_CODE_MARGIN}" width="${cutout.size}" height="${cutout.size}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}"><rect width="${total}" height="${total}" fill="#fff"/><path d="${getQRCodeModulesPath(code)}"/><path fill-rule="evenodd" d="${getQRCodeEyeFramesPath(code.size)}"/><path d="${getQRCodeEyeCentersPath(code.size)}"/>${logo}</svg>`;
};

const scan = (markup: string) => {
  const image = new Resvg(markup, { fitTo: { mode: "width", value: 512 } }).render();
  const pixels = new Uint8ClampedArray(image.pixels);

  return jsQR(pixels, image.width, image.height)?.data;
};

/** The values that do not read back as encoded. */
const unreadable = (logoSize: number) =>
  values.filter((value) => scan(draw(encodeQRCode({ logoSize, value }))) !== value);

describe("QR code core", () => {
  it("encodes at level M, and at H to make room for a logo", () => {
    const plain = encodeQRCode({ value: url });
    const branded = encodeQRCode({ logoSize: 0.2, value: url });

    expect({
      branded: branded.level,
      cutout: plain.cutout,
      plain: plain.level,
      rows: plain.modules.length,
      sides: plain.size === plain.version * 4 + 17,
    }).toStrictEqual({ branded: "H", cutout: null, plain: "M", rows: plain.size, sides: true });
  });

  it("keeps an explicit level and version floor", () => {
    const code = encodeQRCode({ level: "Q", logoSize: 0.2, minVersion: 6, value: url });

    expect([code.level, code.version]).toStrictEqual(["Q", 6]);
  });

  it("centres an odd cutout and limits its size", () => {
    const code = encodeQRCode({ logoSize: 1, value: url });
    const { cutout, size } = code;

    expect(cutout).not.toBeNull();
    expect({
      centred: cutout?.x === (size - (cutout?.size ?? 0)) / 2 && cutout.y === cutout.x,
      odd: (cutout?.size ?? 0) % 2,
      within: (cutout?.size ?? size) <= size * QR_CODE_MAX_LOGO_SIZE,
    }).toStrictEqual({ centred: true, odd: 1, within: true });
  });

  it("leaves eyes and the cutout out of the data modules", () => {
    const code = encodeQRCode({ logoSize: 0.3, value: url });
    const centre = (code.size - 1) / 2;

    expect({
      centre: isQRCodeDataModule(code, centre, centre),
      eye: isQRCodeDataModule(code, 0, 0),
      outside: isQRCodeDataModule(code, -1, 0),
    }).toStrictEqual({ centre: false, eye: false, outside: false });
  });

  it("offsets the paths by the margin", () => {
    expect([
      getQRCodeEyeCentersPath(21).startsWith("M7 6"),
      getQRCodeEyeCentersPath(21, { margin: 0 }).startsWith("M3 2"),
    ]).toStrictEqual([true, true]);
  });

  it("rejects a value that no QR code can hold", () => {
    expect(() => encodeQRCode({ value: "a".repeat(3000) })).toThrow(/too long/iu);
  });

  it("scans back every value", () => {
    expect(unreadable(0)).toStrictEqual([]);
  }, 60_000);

  it("scans back every value with the largest logo", () => {
    expect(unreadable(QR_CODE_MAX_LOGO_SIZE)).toStrictEqual([]);
  }, 60_000);
});
