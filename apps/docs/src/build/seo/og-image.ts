import satori from "satori";
import sharp from "sharp";
import regularFont from "@/assets/og/Geist-Regular.ttf?inline";
import semiboldFont from "@/assets/og/Geist-SemiBold.ttf?inline";
import logo from "@public/brand/erbium-logo-dark.svg?raw";
import { darkColors } from "@/build/theme/colors";
import { ogSize, type OgPage } from "@/build/seo/og-pages";

const fonts = [
  { name: "Geist", data: Buffer.from(regularFont.split(",")[1], "base64"), weight: 400 as const },
  { name: "Geist", data: Buffer.from(semiboldFont.split(",")[1], "base64"), weight: 600 as const },
];
const logoSource = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

function excerpt(value: string, limit: number) {
  if (value.length <= limit) return value;
  return `${value
    .slice(0, limit)
    .replace(/\s+\S*$/, "")
    .trimEnd()}…`;
}

// Satori consumes a stateless element tree and inline layout data, not browser CSS.
function imageBlock(
  style: import("react").CSSProperties,
  children: import("react").ReactNode,
): import("react").ReactElement {
  return { type: "div", key: null, props: { style, children } };
}

export async function createOgImage(page: OgPage) {
  const image = imageBlock(
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: darkColors.background,
      color: darkColors.foreground,
      fontFamily: "Geist",
      padding: "64px 72px",
    },
    [
      imageBlock({ display: "flex", justifyContent: "space-between", alignItems: "center" }, [
        { type: "img", key: null, props: { src: logoSource, alt: "", width: 64, height: 64 } },
        imageBlock(
          { display: "flex", fontSize: 20, color: darkColors.mutedForeground },
          page.section,
        ),
      ]),
      imageBlock(
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
          gap: 24,
        },
        [
          imageBlock(
            {
              display: "flex",
              fontSize: page.title.length > 32 ? 64 : 80,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-3px",
              maxWidth: 1056,
            },
            page.title,
          ),
          imageBlock(
            {
              display: "flex",
              fontSize: 28,
              lineHeight: 1.4,
              color: darkColors.mutedForeground,
              maxWidth: 960,
            },
            excerpt(page.description, 180),
          ),
        ],
      ),
      imageBlock(
        {
          display: "flex",
          justifyContent: "space-between",
          borderTop: `2px solid ${darkColors.border}`,
          paddingTop: 24,
          fontSize: 18,
          color: darkColors.mutedForeground,
        },
        [
          imageBlock({ display: "flex" }, "ui.erbium.app"),
          imageBlock({ display: "flex" }, page.route),
        ],
      ),
    ],
  );
  const svg = await satori(image, { ...ogSize, fonts });
  return sharp(Buffer.from(svg)).jpeg({ mozjpeg: true, quality: 88 }).toBuffer();
}
