/*!
 * Decoder adapted from ThumbHash 0.1.1, https://github.com/evanw/thumbhash
 *
 * MIT License
 *
 * Copyright (c) 2023 Evan Wallace
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* oxlint-disable no-bitwise -- ThumbHash is a bit-packed format and PNG needs CRC32 and Adler-32; the bit operations are the algorithm. */

/** The byte at `index`, or 0 past the end, so a truncated hash decodes to a flat colour. */
const byteAt = (hash: Uint8Array, index: number) => hash[index] ?? 0;

const valueAt = (values: readonly number[], index: number) => values[index] ?? 0;

/** The number of luminance terms along each axis, before the minimum of 3 is applied. */
const luminanceCounts = (header: number, hasAlpha: boolean, isLandscape: boolean) => {
  const longSide = hasAlpha ? 5 : 7;
  const shortSide = header & 7;

  return isLandscape ? { lx: longSide, ly: shortSide } : { lx: shortSide, ly: longSide };
};

/** The approximate aspect ratio (width / height) of the image a ThumbHash was made from. */
const thumbHashAspectRatio = (hash: Uint8Array) => {
  const { lx, ly } = luminanceCounts(
    byteAt(hash, 3),
    (byteAt(hash, 2) & 0x80) !== 0,
    (byteAt(hash, 4) & 0x80) !== 0,
  );

  return ly === 0 ? 1 : lx / ly;
};

/** Reads the 4-bit AC terms of one channel, starting at the cursor's nibble. */
const decodeChannel = (
  hash: Uint8Array,
  cursor: { start: number; index: number },
  [nx, ny, scale]: readonly [number, number, number],
) => {
  const ac: number[] = [];

  for (let cy = 0; cy < ny; cy += 1) {
    for (let cx = cy === 0 ? 1 : 0; cx * ny < nx * (ny - cy); cx += 1) {
      const byte = byteAt(hash, cursor.start + (cursor.index >> 1));
      const nibble = (byte >> ((cursor.index & 1) << 2)) & 15;

      cursor.index += 1;
      ac.push((nibble / 7.5 - 1) * scale);
    }
  }

  return ac;
};

/** The DCT sum of one channel's AC terms at a pixel, from that pixel's cosine factors. */
const sumTerms = (
  ac: readonly number[],
  [nx, ny]: readonly [number, number],
  fx: readonly number[],
  fy: readonly number[],
) => {
  let sum = 0;

  for (let cy = 0, term = 0; cy < ny; cy += 1) {
    const fy2 = valueAt(fy, cy) * 2;

    for (let cx = cy === 0 ? 1 : 0; cx * ny < nx * (ny - cy); cx += 1, term += 1) {
      sum += valueAt(ac, term) * valueAt(fx, cx) * fy2;
    }
  }

  return sum;
};

const cosines = (count: number, size: number, position: number) =>
  Array.from({ length: count }, (_, term) => Math.cos((Math.PI / size) * (position + 0.5) * term));

const toByte = (value: number) => Math.max(0, 255 * Math.min(1, value));

/** Reads a ThumbHash's header and AC terms. */
const readThumbHash = (hash: Uint8Array) => {
  const header24 = byteAt(hash, 0) | (byteAt(hash, 1) << 8) | (byteAt(hash, 2) << 16);
  const header16 = byteAt(hash, 3) | (byteAt(hash, 4) << 8);
  const hasAlpha = header24 >> 23 !== 0;
  const counts = luminanceCounts(header16, hasAlpha, header16 >> 15 !== 0);
  const lx = Math.max(3, counts.lx);
  const ly = Math.max(3, counts.ly);

  // The varying factors. Saturation is boosted by 1.25× to make up for quantization.
  const cursor = { index: 0, start: hasAlpha ? 6 : 5 };
  const lAc = decodeChannel(hash, cursor, [lx, ly, ((header24 >> 18) & 31) / 31]);
  const pAc = decodeChannel(hash, cursor, [3, 3, (((header16 >> 3) & 63) / 63) * 1.25]);
  const qAc = decodeChannel(hash, cursor, [3, 3, (((header16 >> 9) & 63) / 63) * 1.25]);
  const aAc = hasAlpha ? decodeChannel(hash, cursor, [5, 5, (byteAt(hash, 5) >> 4) / 15]) : [];

  const aDc = hasAlpha ? (byteAt(hash, 5) & 15) / 15 : 1;
  const lDc = (header24 & 63) / 63;
  const pDc = ((header24 >> 6) & 63) / 31.5 - 1;
  const qDc = ((header24 >> 12) & 63) / 31.5 - 1;

  return { aAc, aDc, hasAlpha, lAc, lDc, lx, ly, pAc, pDc, qAc, qDc };
};

/** Decodes a ThumbHash to an image of at most 32 × 32 pixels. RGB is not premultiplied by A. */
const thumbHashToRgba = (hash: Uint8Array) => {
  const terms = readThumbHash(hash);
  const ratio = thumbHashAspectRatio(hash);
  const width = Math.round(ratio > 1 ? 32 : 32 * ratio);
  const height = Math.round(ratio > 1 ? 32 / ratio : 32);
  const rgba = new Uint8Array(width * height * 4);
  const minimumTerms = terms.hasAlpha ? 5 : 3;

  for (let y = 0; y < height; y += 1) {
    const fy = cosines(Math.max(terms.ly, minimumTerms), height, y);

    for (let x = 0; x < width; x += 1) {
      const fx = cosines(Math.max(terms.lx, minimumTerms), width, x);
      const l = terms.lDc + sumTerms(terms.lAc, [terms.lx, terms.ly], fx, fy);
      const p = terms.pDc + sumTerms(terms.pAc, [3, 3], fx, fy);
      const q = terms.qDc + sumTerms(terms.qAc, [3, 3], fx, fy);
      const a = terms.hasAlpha ? terms.aDc + sumTerms(terms.aAc, [5, 5], fx, fy) : terms.aDc;
      const b = l - (2 / 3) * p;
      const r = (3 * l - b + q) / 2;
      const index = (y * width + x) * 4;

      rgba.set([toByte(r), toByte(r - q), toByte(b), toByte(a)], index);
    }
  }

  return { height, rgba, width };
};

/** CRC32's nibble table (polynomial 0xEDB88320). */
const CRC_TABLE = Array.from({ length: 16 }, (_, nibble) => {
  let crc = nibble;

  for (let bit = 0; bit < 4; bit += 1) {
    crc = (crc & 1) === 0 ? crc >>> 1 : 0xed_b8_83_20 ^ (crc >>> 1);
  }

  return crc;
});

/**
 * Encodes a small RGBA image (at most 100 × 100) as an uncompressed PNG data URL. Plain
 * arithmetic and `btoa`, so it runs in browsers, Node and Workers alike.
 */
const rgbaToDataUrl = (width: number, height: number, rgba: Uint8Array) => {
  const row = width * 4 + 1;
  const idat = 6 + height * (5 + row);

  const bytes = [
    137,
    80,
    78,
    71,
    13,
    10,
    26,
    10,
    0,
    0,
    0,
    13,
    73,
    72,
    68,
    82,
    0,
    0,
    width >> 8,
    width & 255,
    0,
    0,
    height >> 8,
    height & 255,
    8,
    6,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    idat >>> 24,
    (idat >> 16) & 255,
    (idat >> 8) & 255,
    idat & 255,
    73,
    68,
    65,
    84,
    120,
    1,
  ];

  let a = 1;
  let b = 0;

  // One stored deflate block per row: the block header, then the row's filter byte (0) and pixels.
  for (let y = 0; y < height; y += 1) {
    bytes.push(y + 1 < height ? 0 : 1, row & 255, row >> 8, ~row & 255, (row >> 8) ^ 255, 0);
    b = (b + a) % 65_521;

    for (const value of rgba.subarray(y * (row - 1), (y + 1) * (row - 1))) {
      bytes.push(value);
      a = (a + value) % 65_521;
      b = (b + a) % 65_521;
    }
  }

  bytes.push(
    b >> 8,
    b & 255,
    a >> 8,
    a & 255,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    73,
    69,
    78,
    68,
    174,
    66,
    96,
    130,
  );

  for (const [start, stop] of [
    [12, 29],
    [37, 41 + idat],
  ] as const) {
    let crc = ~0;

    for (let index = start; index < stop; index += 1) {
      crc ^= bytes[index] ?? 0;
      crc = (crc >>> 4) ^ (CRC_TABLE[crc & 15] ?? 0);
      crc = (crc >>> 4) ^ (CRC_TABLE[crc & 15] ?? 0);
    }

    crc = ~crc;
    bytes[stop] = crc >>> 24;
    bytes[stop + 1] = (crc >> 16) & 255;
    bytes[stop + 2] = (crc >> 8) & 255;
    bytes[stop + 3] = crc & 255;
  }

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }

  return `data:image/png;base64,${btoa(binary)}`;
};

/** Reads a base64 (or base64url) ThumbHash. */
const decodeBase64 = (value: string) => {
  const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));

  return Uint8Array.from(binary, (character) => character.codePointAt(0) ?? 0);
};

/** Recently rendered base64 hashes. Images render on every state change, and decoding is not free. */
const cache = new Map<string, string>();
const CACHE_SIZE = 128;

/** Renders a ThumbHash, as bytes or base64, to a PNG data URL. */
const thumbHashToDataUrl = (hash: Uint8Array | string) => {
  if (hash instanceof Uint8Array) {
    const image = thumbHashToRgba(hash);

    return rgbaToDataUrl(image.width, image.height, image.rgba);
  }

  const cached = cache.get(hash);

  if (cached !== undefined) {
    return cached;
  }

  const image = thumbHashToRgba(decodeBase64(hash));
  const url = rgbaToDataUrl(image.width, image.height, image.rgba);

  if (cache.size >= CACHE_SIZE) {
    cache.delete(cache.keys().next().value ?? "");
  }

  cache.set(hash, url);

  return url;
};

export { thumbHashAspectRatio, thumbHashToDataUrl, thumbHashToRgba };
