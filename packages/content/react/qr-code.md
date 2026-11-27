---
title: "QR Code"
description: "Headless QR code with composable SVG parts, a logo area, and PNG or SVG export."
---

A QR code drawn from parts. The primitive encodes the value with [uqr](https://github.com/unjs/uqr), draws it as SVG, keeps space clear for a logo, and saves it as a file with the colors it has on screen.

Use [styled QR Code](/docs/components/qr-code) for Erbium's colors and compositions.

**Import:** `@erbium-ui/react/qr-code`

## Anatomy

```tsx
import { QRCode } from "@erbium-ui/react/qr-code";

<QRCode.Root value="https://example.com" logoSize={0.2}>
  <QRCode.Svg aria-label="Scan to open example.com">
    <QRCode.Background />
    <QRCode.Modules />
    <QRCode.EyeFrames />
    <QRCode.EyeCenters />
    <QRCode.Logo>
      <image href="/mark.svg" width="100%" height="100%" />
    </QRCode.Logo>
  </QRCode.Svg>
  <QRCode.Download>Download</QRCode.Download>
</QRCode.Root>;
```

`Root` renders a `<div>` and encodes during render, so the code is in the server's HTML. `Svg` is drawn in module units, one module being one unit, and everything inside it is saved by an export. Leave out any layer you do not want.

## Styling

Every part takes `render`, and `className` and `style` as values or functions of the part's state. `Background` is white and the other layers are black until CSS fills them:

```css
.plate {
  fill: var(--plate);
}

.ink {
  fill: var(--ink);
}
```

Keep a strong contrast between the two. Dark ink on a light background reads everywhere; some scanners cannot read the inverse.

## Logo

`logoSize` on `Root` is the width of the logo area as a fraction of the code's width, up to `0.3`. The modules inside it are left out and the error correction level defaults to `H`, which recovers them. `Logo` is a nested `<svg>` over that area, so give its content `width="100%"` and `height="100%"`. Rendering `Logo` without `logoSize` throws.

## Export

`Download` is a button that saves a PNG, or an SVG with `format="svg"`. For your own controls, pass `actionsRef`:

```tsx
const actions = React.useRef<QRCodeActions>(null);

<QRCode.Root value={url} actionsRef={actions}>
  …
</QRCode.Root>;

const file = await actions.current?.toBlob({ format: "png", size: 2048 });
```

A saved file cannot reach the page's styles, so the export writes the computed colors into a copy of the drawing, copies in the sprite symbols that `<use>` points at, and embeds linked images. It fails when an image or sprite cannot be fetched. With a Content Security Policy, PNG export needs `blob:` in `img-src`.

While the colors are read, `Svg` has `data-exporting`, so the file can differ from the screen. A code that is see-through on a page still needs a solid background in a file:

```css
.plate {
  fill: transparent;
}

[data-exporting] .plate {
  fill: var(--plate);
}
```

## Core

`@erbium-ui/react/qr-code/core` has the encoding and geometry without React, for servers, emails, or your own renderer:

| Function                  | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| `encodeQRCode`            | Encodes a value into modules and the logo area. |
| `getQRCodeModulesPath`    | The SVG path of the data modules.               |
| `getQRCodeEyeFramesPath`  | The eyes' rings. Fill with `evenodd`.           |
| `getQRCodeEyeCentersPath` | The eyes' centres.                              |
| `isQRCodeDataModule`      | Whether a data module is drawn.                 |

## API reference

### Root

| Prop         | Type                       | Default            | Description                           |
| ------------ | -------------------------- | ------------------ | ------------------------------------- |
| `value`      | `string`                   | required           | The text or URL to encode.            |
| `level`      | `"L" \| "M" \| "Q" \| "H"` | `"M"`, logo: `"H"` | Error correction level.               |
| `logoSize`   | `number`                   | `0`                | Logo area as a fraction of the width. |
| `margin`     | `number`                   | `4`                | Empty modules around the code.        |
| `minVersion` | `number`                   | `1`                | The lowest QR version to use.         |
| `actionsRef` | `Ref<QRCodeActions>`       |                    | Receives `toBlob()` and `download()`. |

`Root` sets `data-level`, `data-version`, and `data-logo`. It throws when the value is too long for a QR code.

### Parts

| Part         | Element    | Notes                                                                           |
| ------------ | ---------- | ------------------------------------------------------------------------------- |
| `Svg`        | `<svg>`    | `role="img"`. Name it with `aria-label`.                                        |
| `Background` | `<rect>`   | Covers the code and its margin.                                                 |
| `Modules`    | `<path>`   | The data modules, with rounded outer corners.                                   |
| `EyeFrames`  | `<path>`   | The rings of the three eyes.                                                    |
| `EyeCenters` | `<path>`   | The centres of the three eyes.                                                  |
| `Logo`       | `<svg>`    | Needs `logoSize` on `Root`.                                                     |
| `Download`   | `<button>` | `format`, `fileName`, `size` (default `1024`), `onExportError`. `data-pending`. |

`useQRCode()` reads the encoded `modules`, `size`, `version`, `level`, `cutout`, `margin`, and `value`, and the export actions.
