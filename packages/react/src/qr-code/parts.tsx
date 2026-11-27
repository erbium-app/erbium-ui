import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { missingContext } from "../internal/dom";
import { resolveStateProp } from "../internal/resolve";
import type { StateProp } from "../internal/resolve";
import { rasterizeSvg, saveBlob, serializeSvg } from "../internal/svg-export";
import {
  encodeQRCode,
  getQRCodeEyeCentersPath,
  getQRCodeEyeFramesPath,
  getQRCodeModulesPath,
  QR_CODE_MARGIN,
} from "./core";
import type { QRCodeData, QRCodeLevel, QRCodeOptions } from "./core";

type QRCodeFormat = "png" | "svg";

interface QRCodeExportOptions {
  /** @default "png" */
  format?: QRCodeFormat | undefined;
  /** The file's width and height in pixels, margin included. @default 1024 */
  size?: number | undefined;
}

interface QRCodeDownloadOptions extends QRCodeExportOptions {
  /** The file name, without its extension. @default "qr-code" */
  fileName?: string | undefined;
}

/** What `actionsRef` and `useQRCode` can do with the code on screen. */
interface QRCodeActions {
  /** The code as a file, with the colors CSS gives it. */
  toBlob: (options?: QRCodeExportOptions) => Promise<Blob>;
  /** Saves the file. */
  download: (options?: QRCodeDownloadOptions) => Promise<void>;
}

interface QRCodeContextValue extends QRCodeData, QRCodeActions {
  value: string;
  /** Empty modules around the code. */
  margin: number;
}

interface QRCodeInternalContextValue {
  code: QRCodeContextValue;
  state: QRCodeRootState;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const QRCodeContext = React.createContext<QRCodeInternalContextValue | null>(null);

const useQRCodeContext = (part: string) =>
  React.use(QRCodeContext) ?? missingContext(part, "<QRCode.Root>");

/** The encoded data and export actions of the surrounding `QRCode.Root`. */
const useQRCode = (): QRCodeContextValue => useQRCodeContext("useQRCode").code;

/** `render`, plus `className` and `style` as values or functions of the part's state. */
type QRCodePartProps<Tag extends React.ElementType, State> = Omit<
  useRender.ComponentProps<Tag, State>,
  "className" | "style"
> & {
  className?: StateProp<string | undefined, State>;
  style?: StateProp<React.CSSProperties | undefined, State>;
};

const resolveStyling = <State,>(
  className: StateProp<string | undefined, State> | undefined,
  style: StateProp<React.CSSProperties | undefined, State> | undefined,
  state: State,
) => ({
  className: resolveStateProp(className, state),
  style: resolveStateProp(style, state),
});

// Root

interface QRCodeRootState extends Record<string, unknown> {
  /** The error correction level. */
  level: QRCodeLevel;
  /** The QR version, 1 to 40. */
  version: number;
  /** A logo area is kept clear. */
  logo: boolean;
}

type QRCodeRootProps = QRCodePartProps<"div", QRCodeRootState> &
  QRCodeOptions & {
    /** Empty modules around the code, which scanners need. @default 4 */
    margin?: number | undefined;
    /** Receives the export actions. */
    actionsRef?: React.Ref<QRCodeActions> | undefined;
  };

/**
 * Encodes `value` and shares it with the parts. It renders a `<div>` around the code and any
 * controls, and encodes during render, so the code is in the server's HTML.
 *
 * State: `data-level`, `data-version` and `data-logo`.
 */
const QRCodeRoot = ({
  render,
  className,
  style,
  value,
  level,
  minVersion,
  logoSize,
  margin: marginProp = QR_CODE_MARGIN,
  actionsRef,
  ...props
}: QRCodeRootProps) => {
  const data = React.useMemo(
    () => encodeQRCode({ level, logoSize, minVersion, value }),
    [level, logoSize, minVersion, value],
  );

  const margin = Math.max(0, Math.floor(marginProp));
  const svgRef = React.useRef<SVGSVGElement>(null);

  const actions = React.useMemo<QRCodeActions>(() => {
    const toBlob = async ({ format = "png", size = 1024 }: QRCodeExportOptions = {}) => {
      if (svgRef.current === null) {
        throw new Error("Exporting a QR code needs a mounted <QRCode.Svg>.");
      }

      const markup = await serializeSvg(svgRef.current, size);

      return format === "svg"
        ? new Blob([markup], { type: "image/svg+xml;charset=utf-8" })
        : await rasterizeSvg(markup, size);
    };

    return {
      download: async ({ fileName = "qr-code", ...options }: QRCodeDownloadOptions = {}) => {
        saveBlob(await toBlob(options), `${fileName}.${options.format ?? "png"}`);
      },
      toBlob,
    };
  }, []);

  React.useImperativeHandle(actionsRef, () => actions, [actions]);

  const state = React.useMemo<QRCodeRootState>(
    () => ({ level: data.level, logo: data.cutout !== null, version: data.version }),
    [data],
  );

  const context = React.useMemo<QRCodeInternalContextValue>(
    () => ({ code: { ...data, ...actions, margin, value }, state, svgRef }),
    [actions, data, margin, state, value],
  );

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(resolveStyling(className, style, state), props),
    render,
    state,
  });

  return <QRCodeContext value={context}>{element}</QRCodeContext>;
};

// Drawing

type QRCodeSvgProps = QRCodePartProps<"svg", QRCodeRootState>;

/**
 * The `<svg>` the code is drawn in, in module units. This is what exports save, so draw
 * everything the file should hold inside it. Name it with `aria-label`: say what scanning does.
 *
 * While a file is made it has `data-exporting`, so CSS can paint the file differently.
 */
const QRCodeSvg = ({ render, ref, className, style, ...props }: QRCodeSvgProps) => {
  const { code, state, svgRef } = useQRCodeContext("QRCode.Svg");
  const total = code.size + code.margin * 2;

  return useRender({
    defaultTagName: "svg",
    props: mergeProps<"svg">(
      {
        "aria-label": "QR code",
        role: "img",
        viewBox: `0 0 ${total} ${total}`,
        ...resolveStyling(className, style, state),
      },
      props,
    ),
    ref: ref === undefined ? svgRef : [svgRef, ref],
    render,
    state,
  });
};

type QRCodeBackgroundProps = QRCodePartProps<"rect", QRCodeRootState>;

/** The light square behind the code, margin included. White unless CSS fills it. */
const QRCodeBackground = ({ render, className, style, ...props }: QRCodeBackgroundProps) => {
  const { code, state } = useQRCodeContext("QRCode.Background");
  const total = code.size + code.margin * 2;

  return useRender({
    defaultTagName: "rect",
    props: mergeProps<"rect">(
      { fill: "#fff", height: total, width: total, ...resolveStyling(className, style, state) },
      props,
    ),
    state,
    render,
  });
};

type QRCodePathProps = QRCodePartProps<"path", QRCodeRootState>;

/** The data modules, as one path. Black unless CSS fills it. */
const QRCodeModules = ({ render, className, style, ...props }: QRCodePathProps) => {
  const { code, state } = useQRCodeContext("QRCode.Modules");
  const d = React.useMemo(() => getQRCodeModulesPath(code, { margin: code.margin }), [code]);

  return useRender({
    defaultTagName: "path",
    props: mergeProps<"path">(
      { d, fill: "#000", ...resolveStyling(className, style, state) },
      props,
    ),
    state,
    render,
  });
};

/** The rings of the three eyes, as one path. Black unless CSS fills it. */
const QRCodeEyeFrames = ({ render, className, style, ...props }: QRCodePathProps) => {
  const { code, state } = useQRCodeContext("QRCode.EyeFrames");
  const d = getQRCodeEyeFramesPath(code.size, { margin: code.margin });

  return useRender({
    defaultTagName: "path",
    props: mergeProps<"path">(
      { d, fill: "#000", fillRule: "evenodd", ...resolveStyling(className, style, state) },
      props,
    ),
    state,
    render,
  });
};

/** The centres of the three eyes, as one path. Black unless CSS fills it. */
const QRCodeEyeCenters = ({ render, className, style, ...props }: QRCodePathProps) => {
  const { code, state } = useQRCodeContext("QRCode.EyeCenters");
  const d = getQRCodeEyeCentersPath(code.size, { margin: code.margin });

  return useRender({
    defaultTagName: "path",
    props: mergeProps<"path">(
      { d, fill: "#000", ...resolveStyling(className, style, state) },
      props,
    ),
    state,
    render,
  });
};

type QRCodeLogoProps = QRCodePartProps<"svg", QRCodeRootState>;

/** Empty modules between the logo and the data around it. */
const LOGO_PADDING = 0.5;

/**
 * A nested `<svg>` over the area `logoSize` keeps clear. Give its content `width="100%"` and
 * `height="100%"`: an `<image>`, an icon's `<svg>`, or shapes with percentages.
 */
const QRCodeLogo = ({ render, className, style, ...props }: QRCodeLogoProps) => {
  const { code, state } = useQRCodeContext("QRCode.Logo");

  if (code.cutout === null) {
    throw new Error(
      "<QRCode.Logo> needs `logoSize` on <QRCode.Root>, which keeps its space clear.",
    );
  }

  const side = Math.max(code.cutout.size - LOGO_PADDING * 2, code.cutout.size / 2);
  const start = code.margin + code.cutout.x + (code.cutout.size - side) / 2;

  return useRender({
    defaultTagName: "svg",
    props: mergeProps<"svg">(
      {
        height: side,
        width: side,
        x: start,
        y: start,
        ...resolveStyling(className, style, state),
      },
      props,
    ),
    render,
    state,
  });
};

// Controls

const toError = (cause: unknown) =>
  cause instanceof Error ? cause : new Error("Could not export the QR code.", { cause });

interface QRCodeDownloadState extends QRCodeRootState {
  /** The file is being prepared. */
  pending: boolean;
}

type QRCodeDownloadProps = QRCodePartProps<"button", QRCodeDownloadState> &
  QRCodeDownloadOptions & {
    /** Called when the file cannot be made. Without it, the error is reported to the window. */
    onExportError?: ((error: Error) => void) | undefined;
  };

/**
 * A button that saves the code as a file. Presses while a file is being prepared do nothing.
 *
 * State: `data-pending`.
 */
const QRCodeDownload = ({
  render,
  className,
  style,
  format,
  size,
  fileName,
  onExportError,
  ...props
}: QRCodeDownloadProps) => {
  const { code, state } = useQRCodeContext("QRCode.Download");
  const [pending, setPending] = React.useState(false);
  const partState: QRCodeDownloadState = { ...state, pending };

  const save = async () => {
    if (pending) {
      return;
    }

    setPending(true);

    let failure: Error | null = null;

    try {
      await code.download({ fileName, format, size });
    } catch (error) {
      failure = toError(error);
    }

    setPending(false);

    if (failure !== null) {
      (onExportError ?? globalThis.reportError)(failure);
    }
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-busy": pending || undefined,
        onClick: () => {
          void save();
        },
        type: "button",
        ...resolveStyling(className, style, partState),
      },
      props,
    ),
    state: partState,
    render,
  });
};

export {
  QRCodeBackground,
  QRCodeDownload,
  QRCodeEyeCenters,
  QRCodeEyeFrames,
  QRCodeLogo,
  QRCodeModules,
  QRCodeRoot,
  QRCodeSvg,
  useQRCode,
};

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
};
