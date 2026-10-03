import satori from "satori";
import sharp from "sharp";
import regularFont from "../assets/og/Geist-Regular.ttf?inline";
import semiboldFont from "../assets/og/Geist-SemiBold.ttf?inline";
import logo from "../../public/brand/erbium-logo-dark.svg?raw";
import { ogSize, type OgPage } from "./og-pages";

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

export async function createOgImage(page: OgPage) {
  const svg = await satori(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#111210",
        color: "#e3e2d8",
        fontFamily: "Geist",
        padding: "64px 72px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={logoSource} alt="" width={64} height={64} />
        <div style={{ display: "flex", fontSize: 20, color: "#94b5a2" }}>{page.section}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: page.title.length > 32 ? 64 : 80,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-3px",
            maxWidth: 1056,
          }}
        >
          {page.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            lineHeight: 1.4,
            color: "#a2aaa3",
            maxWidth: 960,
          }}
        >
          {excerpt(page.description, 180)}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #2b302b",
          paddingTop: 24,
          fontSize: 18,
          color: "#89958b",
        }}
      >
        <div style={{ display: "flex" }}>ui.erbium.app</div>
        <div style={{ display: "flex" }}>{page.route}</div>
      </div>
    </div>,
    { ...ogSize, fonts },
  );
  return sharp(Buffer.from(svg)).jpeg({ mozjpeg: true, quality: 88 }).toBuffer();
}
