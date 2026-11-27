import { QRCode as QRCodePrimitive } from "@erbium-ui/react/qr-code";
import type { QRCodeDownloadProps as QRCodeDownloadPrimitiveProps } from "@erbium-ui/react/qr-code";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { Button } from "./button";

/*
 * Erbium's QR code on the @erbium-ui/react qr-code primitive, which owns the encoding, geometry,
 * logo space and export. The code is `foreground` ink with no surface of its own, so it sits on
 * whatever holds it. Saved files are painted on `card`, which keeps them scannable.
 */

type PrimitiveProps<Part extends React.ElementType> = Omit<
  React.ComponentProps<Part>,
  "className"
> & {
  className?: string;
};

/** Clear on screen. A saved file has no surface behind it, so there it is `card`. */
const QRCodeBackground = ({
  className,
  ...props
}: PrimitiveProps<typeof QRCodePrimitive.Background>) => (
  <QRCodePrimitive.Background
    data-slot="qr-code-background"
    className={cn("fill-transparent in-data-exporting:fill-card", className)}
    {...props}
  />
);

const QRCodeModules = ({ className, ...props }: PrimitiveProps<typeof QRCodePrimitive.Modules>) => (
  <QRCodePrimitive.Modules
    data-slot="qr-code-modules"
    className={cn("fill-foreground", className)}
    {...props}
  />
);

const QRCodeEyeFrames = ({
  className,
  ...props
}: PrimitiveProps<typeof QRCodePrimitive.EyeFrames>) => (
  <QRCodePrimitive.EyeFrames
    data-slot="qr-code-eye-frames"
    className={cn("fill-foreground group-data-[tone=accent]/qr-code:fill-link", className)}
    {...props}
  />
);

const QRCodeEyeCenters = ({
  className,
  ...props
}: PrimitiveProps<typeof QRCodePrimitive.EyeCenters>) => (
  <QRCodePrimitive.EyeCenters
    data-slot="qr-code-eye-centers"
    className={cn("fill-foreground group-data-[tone=accent]/qr-code:fill-link", className)}
    {...props}
  />
);

/**
 * An icon, mark or `<image>` in the middle of the code. Set `logoSize` on `QRCode` to keep its
 * space clear. It is 16 units wide and tall, so an `Icon` fills it as is; give other content
 * `width="100%"` and `height="100%"`.
 */
const QRCodeLogo = ({ className, ...props }: PrimitiveProps<typeof QRCodePrimitive.Logo>) => (
  <QRCodePrimitive.Logo
    data-slot="qr-code-logo"
    viewBox="0 0 16 16"
    className={cn("text-foreground", className)}
    {...props}
  />
);

const qrCodeSvgVariants = cva("block aspect-square h-auto max-w-full shrink-0", {
  defaultVariants: { size: "default" },
  variants: {
    size: {
      default: "w-40 rounded-xl",
      lg: "w-56 rounded-xl",
      sm: "w-28 rounded-lg",
    },
  },
});

type QRCodeSvgProps = PrimitiveProps<typeof QRCodePrimitive.Svg> &
  VariantProps<typeof qrCodeSvgVariants>;

/** The `<svg>` to compose the drawing in. `QRCodeImage` draws the whole code for you. */
const QRCodeSvg = ({ className, size, ...props }: QRCodeSvgProps) => (
  <QRCodePrimitive.Svg
    data-slot="qr-code-svg"
    data-size={size ?? "default"}
    {...skeletonBlock}
    className={cn(qrCodeSvgVariants({ size }), className)}
    {...props}
  />
);

/**
 * The drawn code: modules and eyes. Pass a `QRCodeLogo` as a child. Say what scanning does
 * in `aria-label`.
 */
const QRCodeImage = ({ children, ...props }: QRCodeSvgProps) => (
  <QRCodeSvg {...props}>
    <QRCodeBackground />
    <QRCodeModules />
    <QRCodeEyeFrames />
    <QRCodeEyeCenters />
    {children}
  </QRCodeSvg>
);

type QRCodeProps = PrimitiveProps<typeof QRCodePrimitive.Root> & {
  /** `accent` colors the eyes with the link color. @default "default" */
  tone?: "default" | "accent";
};

/**
 * A scannable code for a link or text. Without children it draws a `QRCodeImage`; compose one to
 * label it, size it or add a logo and a download button.
 */
const QRCode = ({ className, tone = "default", children, ...props }: QRCodeProps) => (
  <QRCodePrimitive.Root
    data-slot="qr-code"
    data-tone={tone}
    className={cn("group/qr-code flex w-fit max-w-full flex-col items-center gap-3", className)}
    {...props}
  >
    {children ?? <QRCodeImage />}
  </QRCodePrimitive.Root>
);

type QRCodeDownloadProps = Omit<QRCodeDownloadPrimitiveProps, "className" | "size"> &
  Pick<React.ComponentProps<typeof Button>, "variant"> & {
    className?: string;
    /** The button's size. */
    buttonSize?: React.ComponentProps<typeof Button>["size"];
    /** The file's width and height in pixels. @default 1024 */
    fileSize?: number;
  };

/**
 * A button that saves the code as a PNG or SVG, in the theme's colors on a solid background.
 * `render` swaps the button, such as for an `InputGroupButton` at the end of a field.
 */
const QRCodeDownload = ({
  buttonSize,
  className,
  fileSize,
  render,
  variant = "outline",
  ...props
}: QRCodeDownloadProps) => (
  <QRCodePrimitive.Download
    data-slot="qr-code-download"
    className={className}
    size={fileSize}
    render={
      render ??
      ((downloadProps, { pending }) => (
        <Button {...downloadProps} size={buttonSize} variant={variant} loading={pending} />
      ))
    }
    {...props}
  />
);

/** Holds a `QRCodeImage` and what lies over it. The code fades and blurs under an overlay. */
const QRCodeFrame = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="qr-code-frame"
    className={cn(
      "relative w-fit max-w-full has-[>[data-slot=qr-code-overlay]]:*:data-[slot=qr-code-svg]:opacity-15 has-[>[data-slot=qr-code-overlay]]:*:data-[slot=qr-code-svg]:blur-sm",
      className,
    )}
    {...props}
  />
);

/**
 * Lies over the code while it should not be scanned, such as when it has expired or is
 * being replaced. Say why, and give the way back. Place it in a `QRCodeFrame`.
 */
const QRCodeOverlay = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="qr-code-overlay"
    className={cn(
      "absolute inset-0 flex flex-col items-center justify-center gap-related p-panel-sm text-center text-control",
      className,
    )}
    {...props}
  />
);

/** A line under the code: what it opens, or how long it lasts. */
const QRCodeCaption = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p
    data-slot="qr-code-caption"
    className={cn(
      "max-w-56 text-center text-caption text-balance text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export {
  QRCode,
  QRCodeBackground,
  QRCodeCaption,
  QRCodeDownload,
  QRCodeEyeCenters,
  QRCodeEyeFrames,
  QRCodeFrame,
  QRCodeImage,
  QRCodeLogo,
  QRCodeModules,
  QRCodeOverlay,
  QRCodeSvg,
};

export type { QRCodeDownloadProps, QRCodeProps, QRCodeSvgProps };
