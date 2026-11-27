import { encode } from "uqr";

/** How much of a damaged or covered code can be recovered: about 7, 15, 25 and 30%. */
type QRCodeLevel = "L" | "M" | "Q" | "H";

/** A square of modules, measured from the code's top left corner, without the margin. */
interface QRCodeArea {
  x: number;
  y: number;
  size: number;
}

/** An encoded QR code. Plain data, so it can be computed anywhere and passed around. */
interface QRCodeData {
  /** Modules along each side, without the margin. */
  size: number;
  /** The QR version, 1 to 40. Longer values need higher versions with smaller modules. */
  version: number;
  /** The requested error correction level, after defaults. */
  level: QRCodeLevel;
  /** `modules[y][x]` is true for a dark module. */
  modules: readonly (readonly boolean[])[];
  /** The centre square left clear for a logo, or `null`. */
  cutout: QRCodeArea | null;
}

interface QRCodeOptions {
  /** The text or URL to encode. */
  value: string;
  /** @default "M", or "H" with a logo */
  level?: QRCodeLevel | undefined;
  /** The lowest version to use, to keep codes of different values the same density. @default 1 */
  minVersion?: number | undefined;
  /**
   * The width of the logo area as a fraction of the code's width, up to `QR_CODE_MAX_LOGO_SIZE`.
   * Modules inside it are left out, and error correction recovers them. @default 0
   */
  logoSize?: number | undefined;
}

/** The empty modules around a code that scanners expect. */
const QR_CODE_MARGIN = 4;

/** The widest logo area that error correction still recovers reliably. */
const QR_CODE_MAX_LOGO_SIZE = 0.3;

/** Modules along each side of a finder pattern. */
const EYE_SIZE = 7;

/** An odd number of modules, so the square centres on the code's odd grid. */
const getCutout = (size: number, logoSize: number): QRCodeArea | null => {
  if (Number.isNaN(logoSize) || logoSize <= 0) {
    return null;
  }

  const wanted = Math.floor(size * Math.min(logoSize, QR_CODE_MAX_LOGO_SIZE));
  const side = Math.max(1, wanted % 2 === 0 ? wanted - 1 : wanted);
  const start = (size - side) / 2;

  return { size: side, x: start, y: start };
};

/**
 * Encodes a value. The error correction level is raised when that fits in the same version.
 * Throws when the value is too long for a QR code, which holds up to 2,953 bytes.
 */
const encodeQRCode = ({
  value,
  level,
  minVersion = 1,
  logoSize = 0,
}: QRCodeOptions): QRCodeData => {
  const resolved = level ?? (logoSize > 0 ? "H" : "M");

  const { data, size, version } = encode(value, {
    boostEcc: true,
    border: 0,
    ecc: resolved,
    minVersion,
  });

  return { cutout: getCutout(size, logoSize), level: resolved, modules: data, size, version };
};

/** The top left corner of each finder pattern. */
const getEyeOrigins = (size: number): readonly (readonly [number, number])[] => [
  [0, 0],
  [size - EYE_SIZE, 0],
  [0, size - EYE_SIZE],
];

const isInEye = (size: number, x: number, y: number) =>
  getEyeOrigins(size).some(
    ([left, top]) => x >= left && x < left + EYE_SIZE && y >= top && y < top + EYE_SIZE,
  );

const isWithin = (position: number, start: number, length: number) =>
  position >= start && position < start + length;

const isInArea = (area: QRCodeArea | null, x: number, y: number) =>
  area !== null && isWithin(x, area.x, area.size) && isWithin(y, area.y, area.size);

/** Whether a data module is drawn: dark, not part of an eye, and not under the logo. */
const isQRCodeDataModule = (data: QRCodeData, x: number, y: number) =>
  data.modules[y]?.[x] === true && !isInEye(data.size, x, y) && !isInArea(data.cutout, x, y);

/** The radius of each corner: top left, top right, bottom right, bottom left. */
type Corners = readonly [number, number, number, number];

const evenly = (radius: number): Corners => [radius, radius, radius, radius];

/** A corner's curve to the next edge, or nothing for a sharp corner. */
const arc = (radius: number, toX: number, toY: number) =>
  radius === 0 ? "" : `A${radius} ${radius} 0 0 1 ${toX} ${toY}`;

/** A clockwise rectangle with its own radius at each corner. */
const roundedRect = (x: number, y: number, side: number, corners: Corners) => {
  const [topLeft, topRight, bottomRight, bottomLeft] = corners;

  return [
    `M${x + topLeft} ${y}`,
    `H${x + side - topRight}`,
    arc(topRight, x + side, y + topRight),
    `V${y + side - bottomRight}`,
    arc(bottomRight, x + side - bottomRight, y + side),
    `H${x + bottomLeft}`,
    arc(bottomLeft, x, y + side - bottomLeft),
    `V${y + topLeft}`,
    arc(topLeft, x + topLeft, y),
    "Z",
  ].join("");
};

type IsDark = (x: number, y: number) => boolean;

/** Half a module where neither side beside a corner has a neighbour. */
const cornerRadius = (first: boolean, second: boolean) => (first || second ? 0 : 0.5);

/** A module whose corners are round where neither adjacent side has a neighbour. */
const roundedModule = (x: number, y: number, margin: number, isDark: IsDark) => {
  const top = isDark(x, y - 1);
  const right = isDark(x + 1, y);
  const bottom = isDark(x, y + 1);
  const left = isDark(x - 1, y);

  return roundedRect(x + margin, y + margin, 1, [
    cornerRadius(top, left),
    cornerRadius(top, right),
    cornerRadius(bottom, right),
    cornerRadius(bottom, left),
  ]);
};

interface QRCodePathOptions {
  /** Empty modules around the code. @default 4 */
  margin?: number | undefined;
}

/**
 * The SVG path of the data modules, in module units. Neighbours join, and their outer corners
 * are round.
 */
const getQRCodeModulesPath = (
  data: QRCodeData,
  { margin = QR_CODE_MARGIN }: QRCodePathOptions = {},
) => {
  const isDark: IsDark = (x, y) => isQRCodeDataModule(data, x, y);
  let path = "";

  for (let y = 0; y < data.size; y += 1) {
    for (let x = 0; x < data.size; x += 1) {
      if (isDark(x, y)) {
        path += roundedModule(x, y, margin, isDark);
      }
    }
  }

  return path;
};

/* Corner radii of an eye, in modules. The frame's inner radius is the outer one less its width,
   so the two curves stay parallel. */
const eyeRadii = { center: evenly(1), inner: evenly(1), outer: evenly(2) };

/** The SVG path of the eyes' rings. Fill it with `fill-rule="evenodd"`. */
const getQRCodeEyeFramesPath = (
  size: number,
  { margin = QR_CODE_MARGIN }: QRCodePathOptions = {},
) =>
  getEyeOrigins(size)
    .map(
      ([x, y]) =>
        roundedRect(x + margin, y + margin, EYE_SIZE, eyeRadii.outer) +
        roundedRect(x + margin + 1, y + margin + 1, EYE_SIZE - 2, eyeRadii.inner),
    )
    .join("");

/** The SVG path of the eyes' centres. */
const getQRCodeEyeCentersPath = (
  size: number,
  { margin = QR_CODE_MARGIN }: QRCodePathOptions = {},
) =>
  getEyeOrigins(size)
    .map(([x, y]) => roundedRect(x + margin + 2, y + margin + 2, 3, eyeRadii.center))
    .join("");

export {
  encodeQRCode,
  getQRCodeEyeCentersPath,
  getQRCodeEyeFramesPath,
  getQRCodeModulesPath,
  isQRCodeDataModule,
  QR_CODE_MARGIN,
  QR_CODE_MAX_LOGO_SIZE,
};

export type { QRCodeArea, QRCodeData, QRCodeLevel, QRCodeOptions, QRCodePathOptions };
