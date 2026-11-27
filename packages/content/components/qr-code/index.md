---
title: "QR Code"
description: "A scannable code for a link or text, drawn in SVG with a logo and download."
---

## Usage

Turns a link or a short text into a code that a phone camera reads. It draws rounded modules and eyes in the theme's colors, renders on the server, and saves as a PNG or SVG.

**Import:** `@erbium/ui/components/qr-code`

```tsx
import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";

<QRCode value="https://ui.erbium.app">
  <QRCodeImage aria-label="Scan to open ui.erbium.app" />
</QRCode>;
```

`<QRCode value="…" />` on its own draws the same image, named "QR code". Say what scanning does in `aria-label`, and keep a link or the text next to the code for people who cannot scan it.

## Anatomy

```tsx
<QRCode value={url} logoSize={0.25}>
  <QRCodeImage aria-label="Scan to pair this device">
    <QRCodeLogo>
      <image href="/logo.svg" width="100%" height="100%" />
    </QRCodeLogo>
  </QRCodeImage>
  <QRCodeDownload>Download</QRCodeDownload>
</QRCode>
```

`QRCodeImage` draws the modules and eyes. To change a single layer, compose `QRCodeSvg` with `QRCodeBackground`, `QRCodeModules`, `QRCodeEyeFrames` and `QRCodeEyeCenters` yourself.

## Compositions

| Part            | Use                                                                   |
| --------------- | --------------------------------------------------------------------- |
| `QRCodeCaption` | A line under the code: what it opens, or how long it lasts.           |
| `QRCodeFrame`   | Holds the image and an overlay.                                       |
| `QRCodeOverlay` | Lies over a faded code that should not be scanned, with the way back. |

```tsx
<QRCode value={url}>
  <QRCodeFrame>
    <QRCodeImage aria-label="Expired pairing code" />
    <QRCodeOverlay>
      <Button size="sm" onClick={renew}>
        New code
      </Button>
    </QRCodeOverlay>
  </QRCodeFrame>
  <QRCodeCaption>Get a new code to pair.</QRCodeCaption>
</QRCode>
```

## Surface

The code paints no surface of its own. It sits on whatever holds it: a card, a dialog, an item or the page. Where it needs a panel, such as over an image, give a wrapper one:

```tsx
<div className="rounded-xl surface-panel">
  <QRCode value={url} />
</div>
```

## Colors

The ink contrasts with the theme: dark on light surfaces, and light on dark ones. It uses the theme's tokens, so it follows your theme:

| Layer            | Token                                        |
| ---------------- | -------------------------------------------- |
| Modules and logo | `foreground`                                 |
| Eyes             | `foreground`, or `link` with `tone="accent"` |
| Background       | none on screen, `card` in downloads          |

A download has nothing behind it, so it is painted on `card` and keeps the theme's colors. A code saved in dark mode is light on dark. Phone cameras commonly read that, but some scanner apps and libraries only read dark on light. Where it matters, compose the layers and swap the two colors in dark mode:

```tsx
<QRCodeSvg aria-label="Scan to open ui.erbium.app">
  <QRCodeBackground className="dark:fill-foreground" />
  <QRCodeModules className="dark:fill-card" />
  <QRCodeEyeFrames className="dark:fill-card" />
  <QRCodeEyeCenters className="dark:fill-card" />
</QRCodeSvg>
```

## Scanning

- `margin` keeps four empty modules around the code, which scanners expect. Keep what lies behind the code plain and in contrast with its ink.
- A longer value needs more, smaller modules. Use `size="lg"` for long links.
- `logoSize` raises the error correction level to `H` and accepts up to `0.3` of the code's width.

## API

| Part             | Props                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `QRCode`         | `value`, `level`, `logoSize`, `margin`, `minVersion`, `tone`, `actionsRef`                          |
| `QRCodeImage`    | `size` (`sm`, `default`, `lg`)                                                                      |
| `QRCodeLogo`     | An `Icon` fills the space `logoSize` clears. Size other content `100%`.                             |
| `QRCodeDownload` | `format` (`png`, `svg`), `fileName`, `fileSize`, `variant`, `buttonSize`, `render`, `onExportError` |

The state, encoding and export come from the [unstyled QR Code](/docs/react/qr-code).
