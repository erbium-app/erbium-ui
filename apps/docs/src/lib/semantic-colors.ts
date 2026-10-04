import Color from "colorjs.io";
import themeCss from "../../../../packages/ui/src/styles/theme.css?raw";
import surfacesCss from "../../../../packages/ui/src/styles/surfaces.css?raw";

// Build-time renderers cannot read browser CSS variables. Resolve only the
// shared semantic colors needed by metadata and social preview images.
function colorsFor(selector: ":root" | ".dark") {
  const declarations = new Map<string, string>();
  for (const css of [themeCss, surfacesCss]) {
    const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
    for (const match of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      declarations.set(match[1], match[2].trim());
    }
  }
  function resolve(name: string): string {
    const value = declarations.get(name);
    if (!value) throw new Error(`Missing shared color token: ${name}`);
    const alias = /^var\(--([\w-]+)\)$/.exec(value);
    if (alias) return resolve(alias[1]);
    const color = new Color(value).to("srgb");
    return color.toString({ format: color.alpha < 1 ? "rgba_number" : "rgb_number", precision: 8 });
  }
  return {
    background: resolve("background"),
    foreground: resolve("foreground"),
    mutedForeground: resolve("muted-foreground"),
    border: resolve("border"),
  };
}

export const lightColors = colorsFor(":root");
export const darkColors = colorsFor(".dark");

// A local light scope must reset inherited dark tokens without copying the palette.
export const showcaseLightThemeCss = [themeCss, surfacesCss]
  .map((css) => {
    const start = css.indexOf(":root {");
    const end = css.indexOf("\n}", start) + 2;
    return css.slice(start, end).replace(":root", ".showcase-content.light");
  })
  .join("\n");
