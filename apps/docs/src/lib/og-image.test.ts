import { expect, test, vi } from "vite-plus/test";
import sharp from "sharp";
import { createOgImage } from "./og-image";

vi.mock("./og-pages", () => ({ ogSize: { width: 1200, height: 630 } }));

test("renders a shareable JPEG with bundled fonts and escaped content", async () => {
  const image = await createOgImage({
    route: "/docs/hooks/use-copy-to-clipboard",
    title: "Use Copy To Clipboard",
    description: 'Copy <text> & "code" from your documentation.',
    section: "Hooks",
    imagePath: "/og/test.jpg",
  });
  const metadata = await sharp(image).metadata();
  expect(metadata.format).toBe("jpeg");
  expect(metadata.width).toBe(1200);
  expect(metadata.height).toBe(630);
  expect(image.byteLength).toBeLessThan(300_000);
});
