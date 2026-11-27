import {
  QRCodeBackground,
  QRCodeDownload,
  QRCodeEyeCenters,
  QRCodeEyeFrames,
  QRCodeLogo,
  QRCodeModules,
  QRCodeRoot,
  QRCodeSvg,
} from "./parts";

/**
 * A QR code drawn from parts: `Root` encodes the value, `Svg` holds the drawing (`Background`,
 * `Modules`, `EyeFrames`, `EyeCenters` and `Logo`), and `Download` saves it as a PNG or SVG with
 * the colors it has on screen.
 */
const QRCode = {
  Background: QRCodeBackground,
  Download: QRCodeDownload,
  EyeCenters: QRCodeEyeCenters,
  EyeFrames: QRCodeEyeFrames,
  Logo: QRCodeLogo,
  Modules: QRCodeModules,
  Root: QRCodeRoot,
  Svg: QRCodeSvg,
};

export { QRCode };

export { useQRCode } from "./parts";

export type {
  QRCodeActions,
  QRCodeBackgroundProps,
  QRCodeContextValue,
  QRCodeDownloadOptions,
  QRCodeDownloadProps,
  QRCodeDownloadState,
  QRCodeExportOptions,
  QRCodeFormat,
  QRCodeLogoProps,
  QRCodePathProps,
  QRCodeRootProps,
  QRCodeRootState,
  QRCodeSvgProps,
} from "./parts";

export * from "./core";
