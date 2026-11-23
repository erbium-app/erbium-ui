import { thumbHashToDataUrl } from "../internal/thumbhash";

/** Where an image is in its life: fetching or decoding, painted, or failed. */
type ImageStatus = "loading" | "loaded" | "error";

type ImageLoading = "eager" | "lazy";

type ImageDecoding = "async" | "auto" | "sync";

type ImageFetchPriority = "auto" | "high" | "low";

/** What a loader receives for each URL it builds. */
interface ImageLoaderInput {
  /** The `src` given to the image, unchanged. */
  src: string;
  /** The width in pixels this URL should deliver. Absent when the image has no width to aim for. */
  width?: number;
  /** The output quality asked for, from 1 to 100. */
  quality?: number;
  /** Whether the URL is for a low-resolution placeholder rather than the image itself. */
  placeholder?: boolean;
}

/**
 * Turns a source and a target width into a URL, the way a Next.js loader does. It must be a pure
 * function: it runs on the server and the client, and the two must agree.
 */
type ImageLoader = (input: ImageLoaderInput) => string;

/**
 * What the image shows until its own pixels arrive. It paints as the image's background, so it
 * takes the image's box exactly and needs no wrapper.
 *
 * - `{ color }`: a flat colour, such as the image's dominant colour.
 * - `{ thumbhash }`: a [ThumbHash](https://evanw.github.io/thumbhash/), as bytes or base64. It is
 *   decoded to a 32-pixel PNG wherever it renders, so the server sends it inline.
 * - `{ src }`: any small image URL, usually a base64 LQIP data URL.
 * - `"blur"`: a tiny version from the loader. It costs one small request, so it paints a moment
 *   after the page.
 */
type ImagePlaceholder =
  | { color: string }
  | { thumbhash: Uint8Array | string }
  | { src: string }
  | "blur";

/** The inline styles `getImageProps` sets. Plain strings, so they work with or without React. */
interface ImageStyle {
  aspectRatio?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
}

interface ImageOptions {
  src: string;
  /**
   * The width the image displays at, in CSS pixels, unless CSS sizes it. With `height`, it
   * reserves the image's box before any pixels arrive, so loading never moves the layout.
   */
  width?: number;
  /** The height the image displays at, in CSS pixels. See `width`. */
  height?: number;
  /**
   * How wide the image displays at each viewport, as in the `sizes` attribute. With a loader, it
   * switches the generated `srcset` from densities (`1x`, `2x`) to widths (`640w`, `1280w`…).
   */
  sizes?: string;
  /** The widths a responsive (`sizes`) image generates. */
  widths?: readonly number[];
  /** The output quality, passed to the loader. */
  quality?: number;
  /** Builds each URL. Without one, `src` and `srcSet` render unchanged. */
  loader?: ImageLoader | null;
  /** A `srcset` of your own. It replaces the generated one. */
  srcSet?: string;
  /** What shows until the image paints. */
  placeholder?: ImagePlaceholder;
  /**
   * Loads the image first: eagerly, at high fetch priority, and preloaded from the document head.
   * Use it for the largest image above the fold, outside `<picture>`.
   */
  priority?: boolean;
  /** @default "lazy" */
  loading?: ImageLoading;
  /** @default "async" */
  decoding?: ImageDecoding;
  fetchPriority?: ImageFetchPriority;
}

/** The attributes `getImageProps` resolves, ready to spread on an `<img>` or a `<source>`. */
interface ImageAttributes {
  src: string;
  srcSet: string | undefined;
  sizes: string | undefined;
  width: number | undefined;
  height: number | undefined;
  loading: ImageLoading;
  decoding: ImageDecoding;
  fetchPriority: ImageFetchPriority;
  /** The space reserved for the image: its `aspect-ratio` when `width` and `height` are known. */
  style: ImageStyle;
  /** The placeholder's paint, kept apart so it can be removed once the image paints. */
  placeholderStyle: ImageStyle | undefined;
}

/**
 * Widths for responsive images. They follow Cloudflare's guidance (640 for phones, 960 for
 * tablets, 1920 for desktops) with steps between and 2× for large screens, and stay few because
 * every distinct width is a separate transformation.
 */
const DEFAULT_IMAGE_WIDTHS: readonly number[] = [320, 480, 640, 960, 1280, 1920, 2560];

/** The width a `"blur"` placeholder asks the loader for. */
const PLACEHOLDER_WIDTH = 32;

/** Removes leading slashes, without a backtracking pattern. */
const trimLeadingSlashes = (value: string) => {
  let start = 0;

  while (value[start] === "/") {
    start += 1;
  }

  return value.slice(start);
};

/** Removes trailing slashes, without a backtracking pattern. */
const trimTrailingSlashes = (value: string) => {
  let end = value.length;

  while (end > 0 && value[end - 1] === "/") {
    end -= 1;
  }

  return value.slice(0, end);
};

/** URLs no loader can transform: inline data, object URLs from local files, and vector images. */
const isUntransformable = (src: string) => {
  const path = src.split(/[?#]/u, 1)[0]?.toLowerCase() ?? "";

  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    path.endsWith(".svg") ||
    path.endsWith(".svgz")
  );
};

const canTransform = (loader: ImageLoader | null | undefined, src: string) =>
  loader !== null && loader !== undefined && !isUntransformable(src);

/** Joins `srcset` candidates, dropping repeated URLs. One candidate is no choice, so it is none. */
const joinCandidates = (candidates: { url: string; descriptor: string }[]) => {
  const seen = new Set<string>();

  const unique = candidates.filter(({ url }) => {
    if (seen.has(url)) {
      return false;
    }

    seen.add(url);

    return true;
  });

  return unique.length > 1
    ? unique.map(({ url, descriptor }) => `${url} ${descriptor}`).join(", ")
    : undefined;
};

const placeholderUrl = (
  placeholder: Exclude<ImagePlaceholder, { color: string }>,
  blurUrl: () => string | undefined,
) => {
  if (placeholder === "blur") {
    return blurUrl();
  }

  return "thumbhash" in placeholder ? thumbHashToDataUrl(placeholder.thumbhash) : placeholder.src;
};

/** Paints a placeholder as a background that covers the image's box. */
const placeholderStyleOf = (
  placeholder: ImagePlaceholder | undefined,
  blurUrl: () => string | undefined,
): ImageStyle | undefined => {
  if (placeholder === undefined) {
    return undefined;
  }

  if (placeholder !== "blur" && "color" in placeholder) {
    return { backgroundColor: placeholder.color };
  }

  const url = placeholderUrl(placeholder, blurUrl);

  // The fit and position follow `--image-placeholder-fit` and `--image-placeholder-position`, so
  // an `object-contain` image can match its placeholder to its own fit.
  return url === undefined
    ? undefined
    : {
        backgroundImage: `url("${url.replaceAll('"', "%22")}")`,
        backgroundPosition: "var(--image-placeholder-position, 50% 50%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "var(--image-placeholder-fit, cover)",
      };
};

/**
 * A lazy image is laid out before it loads, so `auto` lets the browser use its real width, and
 * the given sizes remain the fallback where `sizes="auto"` is unsupported.
 */
const resolveSizes = (sizes: string | undefined, loading: ImageLoading) =>
  sizes === undefined ||
  loading !== "lazy" ||
  sizes.split(",").some((size) => size.trim() === "auto")
    ? sizes
    : `auto, ${sizes}`;

interface SrcSetInput {
  url: (width: number | undefined) => string;
  width: number | undefined;
  sizes: string | undefined;
  widths: readonly number[];
}

/** Densities for a fixed width, as Cloudflare recommends, or widths for a responsive image. */
const generateSrcSet = ({ url, width, sizes, widths }: SrcSetInput) => {
  if (sizes !== undefined) {
    return joinCandidates(
      widths
        .toSorted((first, second) => first - second)
        .map((target) => ({ descriptor: `${target}w`, url: url(target) })),
    );
  }

  return width === undefined
    ? undefined
    : joinCandidates([
        { descriptor: "1x", url: url(width) },
        { descriptor: "2x", url: url(width * 2) },
      ]);
};

/** The box an image keeps before it loads: its aspect ratio, when both dimensions are known. */
const isLength = (value: number | undefined): value is number => value !== undefined && value > 0;

const reservedStyle = (width: number | undefined, height: number | undefined): ImageStyle =>
  isLength(width) && isLength(height) ? { aspectRatio: `${width} / ${height}` } : {};

/** One loader call's input. */
const loaderInput = (
  src: string,
  width: number | undefined,
  quality: number | undefined,
  placeholder = false,
): ImageLoaderInput => ({ placeholder, quality, src, width });

/**
 * Resolves the attributes of an image: the URLs the loader builds, a `srcset` (densities for a
 * fixed width, widths with `sizes`), loading hints, the box to reserve, and the placeholder's
 * paint. Pure, so it runs in route loaders and on the server, and it builds `<source>` elements
 * for art direction.
 */
const getImageProps = ({
  src: source,
  width,
  height,
  sizes: sizesProp,
  widths = DEFAULT_IMAGE_WIDTHS,
  quality,
  loader,
  srcSet: srcSetProp,
  placeholder,
  priority = false,
  loading: loadingProp,
  decoding = "async",
  fetchPriority: fetchPriorityProp,
}: ImageOptions): ImageAttributes => {
  const transforms = canTransform(loader, source);

  const url = (target: number | undefined) =>
    transforms ? (loader?.(loaderInput(source, target, quality)) ?? source) : source;

  const loading = priority ? "eager" : (loadingProp ?? "lazy");
  const fetchPriority = priority ? "high" : (fetchPriorityProp ?? "auto");

  const generated = transforms
    ? generateSrcSet({ sizes: sizesProp, url, width, widths })
    : undefined;

  // A responsive image without a width still needs a `src`: a middle width serves browsers that
  // ignore `srcset`.
  const fallbackWidth =
    sizesProp === undefined || width !== undefined
      ? width
      : widths.at(Math.floor(widths.length / 2));

  const placeholderStyle = placeholderStyleOf(placeholder, () =>
    transforms ? loader?.(loaderInput(source, PLACEHOLDER_WIDTH, quality, true)) : undefined,
  );

  const sizes = resolveSizes(sizesProp, loading);
  const src = url(fallbackWidth);
  const srcSet = srcSetProp ?? generated;
  const style = reservedStyle(width, height);

  return {
    decoding,
    fetchPriority,
    height,
    loading,
    placeholderStyle,
    sizes,
    src,
    srcSet,
    style,
    width,
  };
};

/**
 * A transparent SVG with the given proportions. A failed image shows it instead of the browser's
 * broken-image icon, and its intrinsic ratio matches the box, so the layout stays put.
 */
const blankImage = (width: number, height: number) => {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'/%3E`;
};

/* ---------------------------------------------------------------------------------------------
 * Cloudflare
 * ------------------------------------------------------------------------------------------- */

type CloudflareFit =
  | "aspect-crop"
  | "contain"
  | "cover"
  | "crop"
  | "pad"
  | "scale-down"
  | "scale-up"
  | "squeeze";

type CloudflareFitOption = CloudflareFit | { mode: CloudflareFit; upscale?: CloudflareUpscale };

type CloudflareUpscale = "generate" | "interpolate";

type CloudflareFlip = "h" | "hv" | "v";

type CloudflareFormat = "auto" | "avif" | "baseline-jpeg" | "jpeg" | "json" | "webp";

type CloudflareGravity =
  | "auto"
  | "bottom"
  | "face"
  | "left"
  | "right"
  | "top"
  | { x: number; y: number };

type CloudflareMetadata = "copyright" | "keep" | "none";

type CloudflareQuality = number | "high" | "low" | "medium-high" | "medium-low";

type CloudflareQualityOption =
  | CloudflareQuality
  | { level: CloudflareQuality; slowConnection?: CloudflareQuality };

type CloudflareRotation = 90 | 180 | 270;

/** Trims by border colour, or trims sides and areas in pixels, `"10p"` percentages, or fractions. */
type CloudflareTrim =
  | "color"
  | { mode: "color"; color?: string; tolerance?: number; keep?: number }
  | {
      mode?: "area";
      top?: number | string;
      right?: number | string;
      bottom?: number | string;
      left?: number | string;
      width?: number;
      height?: number;
    };

/**
 * Cloudflare Images optimization parameters, in their URL form. `width` and `quality` come from
 * each image; everything else applies to every URL the loader builds. Grouped settings such as
 * `gravity: { x: 0.5, y: 0.3 }` serialize to `gravity=(x=0.5,y=0.3)`.
 *
 * @see https://developers.cloudflare.com/images/optimization/features/
 */
interface CloudflareImageOptions {
  /** Keeps animation frames. Turn it off for user uploads to skip slow animated GIFs. */
  anim?: boolean;
  /** Fills transparent pixels, for example around `fit: "pad"`. */
  background?: string;
  blur?: number;
  brightness?: number;
  compression?: "fast";
  contrast?: number;
  /** Scales the output for high-density screens. The generated `srcset` already covers 2×. */
  dpr?: number;
  /** How the image fits `width` and `height`. Cloudflare's default is `scale-down`. */
  fit?: CloudflareFitOption;
  flip?: CloudflareFlip;
  /** The output format. `auto` serves AVIF or WebP to browsers that accept them. */
  format?: CloudflareFormat;
  gamma?: number;
  /** What to keep when `fit` crops. */
  gravity?: CloudflareGravity;
  /** A height for every URL, for crops with `fit`. */
  height?: number;
  metadata?: CloudflareMetadata;
  /** Serves the original when the transformation fails. Same zone only, and only for remote images. */
  onerror?: "redirect";
  quality?: CloudflareQualityOption;
  rotate?: CloudflareRotation;
  saturation?: number;
  segment?: "foreground";
  sharpen?: number;
  trim?: CloudflareTrim;
  zoom?: number;
}

type CloudflareUrlOptions = CloudflareImageOptions & { width?: number };

/** Every option, in the order URLs list them. A fixed order gives one image one cache entry. */
const CLOUDFLARE_OPTION_KEYS = [
  "anim",
  "background",
  "blur",
  "brightness",
  "compression",
  "contrast",
  "dpr",
  "fit",
  "flip",
  "format",
  "gamma",
  "gravity",
  "height",
  "metadata",
  "onerror",
  "quality",
  "rotate",
  "saturation",
  "segment",
  "sharpen",
  "trim",
  "width",
  "zoom",
] as const satisfies readonly (keyof CloudflareUrlOptions)[];

interface GroupedValue {
  [key: string]: number | string | undefined;
}

/** `slowConnection` becomes `slow-connection`, as Cloudflare names it. */
const kebab = (key: string) => key.replaceAll(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`);

// `#` would start a URL fragment, so colours spell it `%23`.
const scalar = (value: boolean | number | string) => String(value).replaceAll("#", "%23");

const grouped = (value: GroupedValue) =>
  `(${Object.entries(value)
    .filter((entry): entry is [string, number | string] => entry[1] !== undefined)
    .map(([key, setting]) => `${kebab(key)}=${scalar(setting)}`)
    .join(",")})`;

/** Serializes options to the comma-separated form Cloudflare URLs take, in a fixed order. */
const serializeCloudflareOptions = (options: CloudflareUrlOptions) =>
  CLOUDFLARE_OPTION_KEYS.flatMap((key) => {
    const value = options[key];

    if (value === undefined) {
      return [];
    }

    return `${key}=${value instanceof Object ? grouped(value) : scalar(value)}`;
  }).join(",");

/** The placeholder variant: small, soft and cheap. */
const PLACEHOLDER_OPTIONS: CloudflareImageOptions = { blur: 2, quality: 50 };

/** The options of one URL: the loader's, then the placeholder's or the image's quality, then the width. */
const urlOptions = (
  options: CloudflareImageOptions,
  { width, quality, placeholder }: ImageLoaderInput,
): CloudflareUrlOptions => ({
  format: "auto",
  ...options,
  ...(placeholder === true ? PLACEHOLDER_OPTIONS : quality !== undefined && { quality }),
  width,
});

interface CloudflareLoaderOptions extends CloudflareImageOptions {
  /**
   * The zone that serves `/cdn-cgi/image/`, such as `https://images.example.com`. Omit it to use
   * the page's own origin. The zone needs Image Transformations turned on.
   */
  zone?: string;
  /**
   * Whether to transform at all. Pass `false` where `/cdn-cgi/image/` does not exist, such as the
   * Vite dev server or a `workers.dev` preview, and every `src` renders unchanged.
   * @default true
   */
  enabled?: boolean;
}

/**
 * A loader for Cloudflare Image Transformations. It builds
 * `<zone>/cdn-cgi/image/<options>/<source>` URLs, where the source is a path on the zone or an
 * absolute URL the zone allows. Every URL asks for `format=auto`.
 *
 * @see https://developers.cloudflare.com/images/optimization/transformations/overview/
 */
const cloudflareLoader = ({
  zone = "",
  enabled = true,
  ...options
}: CloudflareLoaderOptions = {}): ImageLoader => {
  const base = trimTrailingSlashes(zone);

  return (input) => {
    if (!enabled) {
      return input.src;
    }

    const isAbsolute = input.src.startsWith("https://") || input.src.startsWith("http://");
    const source = isAbsolute ? input.src : trimLeadingSlashes(input.src);

    return `${base}/cdn-cgi/image/${serializeCloudflareOptions(urlOptions(options, input))}/${source}`;
  };
};

interface CloudflareImagesLoaderOptions extends CloudflareImageOptions {
  /** The account hash from the Images dashboard, under Developer Resources. */
  accountHash: string;
  /**
   * Where images are delivered from: `https://imagedelivery.net` (the default), or your own zone's
   * `https://example.com/cdn-cgi/imagedelivery`.
   */
  origin?: string;
  /**
   * A named variant, such as `public`. A variant has one size, so the image gets no `srcset`. Omit
   * it to resize with flexible variants, which must be turned on for the account.
   */
  variant?: string;
}

/**
 * A loader for images stored in Cloudflare Images, where `src` is the image ID. It builds
 * `<origin>/<account hash>/<image id>/<variant or options>` URLs.
 *
 * @see https://developers.cloudflare.com/images/optimization/hosted-images/
 */
const cloudflareImagesLoader = ({
  accountHash,
  origin = "https://imagedelivery.net",
  variant,
  ...options
}: CloudflareImagesLoaderOptions): ImageLoader => {
  const base = `${trimTrailingSlashes(origin)}/${accountHash}`;

  return (input) => {
    const id = trimLeadingSlashes(input.src);

    return variant === undefined
      ? `${base}/${id}/${serializeCloudflareOptions(urlOptions(options, input))}`
      : `${base}/${id}/${variant}`;
  };
};

export {
  blankImage,
  cloudflareImagesLoader,
  cloudflareLoader,
  DEFAULT_IMAGE_WIDTHS,
  getImageProps,
  serializeCloudflareOptions,
};

export type {
  CloudflareFit,
  CloudflareFitOption,
  CloudflareFlip,
  CloudflareFormat,
  CloudflareGravity,
  CloudflareImageOptions,
  CloudflareImagesLoaderOptions,
  CloudflareLoaderOptions,
  CloudflareMetadata,
  CloudflareQuality,
  CloudflareQualityOption,
  CloudflareRotation,
  CloudflareTrim,
  CloudflareUpscale,
  ImageAttributes,
  ImageDecoding,
  ImageFetchPriority,
  ImageLoader,
  ImageLoaderInput,
  ImageLoading,
  ImageOptions,
  ImagePlaceholder,
  ImageStatus,
  ImageStyle,
};
