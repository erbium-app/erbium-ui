import * as React from "react";
import { preload } from "react-dom";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { blankImage, getImageProps } from "./core";
import type { ImageAttributes, ImageLoader, ImageOptions, ImageStatus } from "./core";

interface ImageDefaults {
  /** Builds every image's URLs. `null` turns loaders off below this provider. */
  loader?: ImageLoader | null;
  /** The widths responsive images generate. */
  widths?: readonly number[];
  /** The output quality passed to the loader. */
  quality?: number;
}

const ImageContext = React.createContext<ImageDefaults>({});

interface ImageProviderProps extends ImageDefaults {
  children?: React.ReactNode;
}

/**
 * Sets the loader, widths and quality for every image inside it, such as a Cloudflare loader at
 * the app's root. Nested providers override only what they set.
 */
const ImageProvider = ({ children, loader, widths, quality }: ImageProviderProps) => {
  const parent = React.use(ImageContext);

  const value = React.useMemo<ImageDefaults>(
    () => ({
      loader: loader === undefined ? parent.loader : loader,
      quality: quality ?? parent.quality,
      widths: widths ?? parent.widths,
    }),
    [loader, parent, quality, widths],
  );

  return <ImageContext value={value}>{children}</ImageContext>;
};

interface ImageRootState extends Record<string, unknown> {
  /** `loading` until the image has painted, then `loaded`, or `error` once it has failed. */
  status: ImageStatus;
  /**
   * Whether the image should fade in as it loads. Only images that mount after hydration without
   * a placeholder set it: they have nothing on screen yet, while an image in the server's HTML
   * may already be painting and a placeholder already fills its box.
   */
  reveal: boolean;
}

type ImageRootProps = Omit<
  useRender.ComponentProps<"img", ImageRootState>,
  "decoding" | "fetchPriority" | "height" | "loading" | "sizes" | "src" | "srcSet" | "width"
> &
  ImageOptions & {
    /** Describes the image, or `""` when it is decorative. Required so the choice is made. */
    alt: string;
    /** Shown when `src` fails, before falling back to an empty box. */
    fallbackSrc?: string;
    /** Called when the image loads or fails. */
    onStatusChange?: (status: ImageStatus) => void;
  };

interface Box {
  width: number;
  height: number;
}

interface LoadState {
  /** The resolved `src` and `srcset` this state describes. A new pair starts over. */
  key: string;
  status: ImageStatus;
  /** Whether `fallbackSrc` replaced the source after it failed. */
  fallback: boolean;
  /** The image's box when it failed, so the empty image keeps its proportions. */
  box: Box | null;
  /** Whether no source has painted yet. Only the first load fades in. */
  firstLoad: boolean;
}

const initialLoad = (sourceKey: string, isFirstLoad: boolean): LoadState => ({
  box: null,
  fallback: false,
  firstLoad: isFirstLoad,
  key: sourceKey,
  status: "loading",
});

/** The state after a failure: the fallback source first, then the empty image. */
const failedLoad = (
  state: LoadState,
  image: HTMLImageElement,
  fallbackSrc: string | undefined,
): LoadState => {
  if (state.status === "error") {
    return state;
  }

  if (fallbackSrc !== undefined && !state.fallback) {
    return { ...state, fallback: true };
  }

  return {
    ...state,
    box: { height: image.offsetHeight, width: image.offsetWidth },
    status: "error",
  };
};

/** Whether the image decodes. A broken image rejects; jsdom has no `decode` and counts as decoded. */
const decodes = async (image: HTMLImageElement) => {
  if (!("decode" in image)) {
    return true;
  }

  try {
    await image.decode();

    return true;
  } catch {
    return false;
  }
};

const subscribeNever = () => () => {
  // Nothing to unsubscribe: whether this render hydrates never changes.
};

/** True for a render on the client, false on the server and while hydrating its HTML. */
const useClientRender = () =>
  React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

/**
 * Tracks one image's load: `loading` until it has loaded and decoded, through `fallbackSrc` on a
 * failure, to `error`. A new `key` (source) starts over during render, so an old status never
 * shows with a new image.
 */
const useImageLoad = (
  key: string,
  fallbackSrc: string | undefined,
  onStatusChange: ((status: ImageStatus) => void) | undefined,
) => {
  const [state, setState] = React.useState(() => initialLoad(key, true));
  let current = state;

  if (state.key !== key) {
    current = initialLoad(key, state.firstLoad && state.status !== "loaded");
    setState(current);
  }

  // Handlers settle after `await`, so they read the latest state rather than their render's.
  const latest = React.useRef(current);

  React.useLayoutEffect(() => {
    latest.current = current;
  });

  const update = (forKey: string, transition: (previous: LoadState) => LoadState) => {
    const previous = latest.current;

    if (previous.key !== forKey) {
      return;
    }

    const nextState = transition(previous);

    if (nextState === previous) {
      return;
    }

    latest.current = nextState;
    setState(nextState);

    if (nextState.status !== previous.status) {
      onStatusChange?.(nextState.status);
    }
  };

  /**
   * Settles a finished image. One that fired `load` counts as loaded even if decoding rejects;
   * one found `complete` without pixels is broken unless it decodes, as an SVG without a size does.
   */
  const settle = async (forKey: string, image: HTMLImageElement, fired: boolean) => {
    const decoded = await decodes(image);

    update(forKey, (previous) => {
      if (previous.status !== "loading") {
        return previous;
      }

      return decoded || fired
        ? { ...previous, status: "loaded" }
        : failedLoad(previous, image, fallbackSrc);
    });
  };

  const fail = (forKey: string, image: HTMLImageElement) => {
    update(forKey, (previous) => failedLoad(previous, image, fallbackSrc));
  };

  return { current, fail, settle };
};

interface Shown {
  src: string;
  srcSet: string | null;
  sizes: string | null;
}

const resolveShown = (
  load: LoadState,
  attributes: ImageAttributes,
  fallbackSrc: string | undefined,
  reserved: Partial<Box>,
): Shown => {
  if (load.status === "error") {
    const width = reserved.width ?? load.box?.width ?? 1;
    const height = reserved.height ?? load.box?.height ?? 1;

    return { sizes: null, src: blankImage(width, height), srcSet: null };
  }

  if (load.fallback && fallbackSrc !== undefined) {
    return { sizes: null, src: fallbackSrc, srcSet: null };
  }

  return {
    sizes: attributes.sizes ?? null,
    src: attributes.src,
    srcSet: attributes.srcSet ?? null,
  };
};

/**
 * An `<img>` that keeps its box while it loads, paints a placeholder behind itself, builds its
 * URLs through a loader, and reports whether it has loaded. It renders the image element itself,
 * with no wrapper, so parents that style or find their direct `<img>` child keep working.
 *
 * - **Space.** With `width` and `height` it sets `aspect-ratio`, so its box exists before any
 *   pixel does. Without them, size it with CSS.
 * - **Placeholder.** Paints as the image's background until the image has loaded and decoded,
 *   then clears, so transparent images show nothing behind them.
 * - **Loader.** Builds `src` and `srcset` from `src`, `width`, `sizes` and the provider's loader.
 * - **Priority.** Loads eagerly at high priority and preloads from the head.
 * - **Errors.** Tries `fallbackSrc`, then shows an empty image of the same proportions in place of
 *   the browser's broken-image icon, keeping the placeholder and the box.
 * - **Hydration.** Reads `complete` when it mounts, so an image that finished before hydration
 *   still settles.
 *
 * State: `data-status` (`loading`, `loaded`, `error`) and `data-reveal`.
 */
const ImageRoot = ({
  render,
  ref,
  src,
  alt,
  width,
  height,
  sizes,
  widths,
  quality,
  loader,
  srcSet,
  placeholder,
  priority = false,
  loading,
  decoding,
  fetchPriority,
  fallbackSrc,
  onStatusChange,
  ...props
}: ImageRootProps) => {
  const defaults = React.use(ImageContext);

  const attributes = getImageProps({
    decoding,
    fetchPriority,
    height,
    loading,
    placeholder,
    priority,
    sizes,
    src,
    srcSet,
    width,
    loader: loader === undefined ? defaults.loader : loader,
    quality: quality ?? defaults.quality,
    widths: widths ?? defaults.widths,
  });

  const key = `${attributes.src}\n${attributes.srcSet ?? ""}`;
  const { current, fail, settle } = useImageLoad(key, fallbackSrc, onStatusChange);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const isClientRender = useClientRender();
  // oxlint-disable-next-line react/hook-use-state -- the first render's answer is kept on purpose and never set: hydrated images flip to client renders right after hydration, and must not start fading then.
  const [mountedOnClient] = React.useState(isClientRender);

  // Hydration runs effects after the browser may have finished the image, so its load or error
  // event can be gone. `complete` says it settled, and `currentSrc` tells a finished request from
  // a lazy image that has not been requested yet.
  const checkComplete = React.useEffectEvent((image: HTMLImageElement, forKey: string) => {
    if (image.complete && image.currentSrc !== "") {
      void settle(forKey, image, image.naturalWidth > 0);
    }
  });

  React.useLayoutEffect(() => {
    if (imageRef.current !== null) {
      checkComplete(imageRef.current, key);
    }
  }, [key]);

  if (priority && current.status === "loading" && !current.fallback) {
    preload(attributes.src, {
      as: "image",
      crossOrigin: props.crossOrigin,
      fetchPriority: "high",
      imageSizes: attributes.sizes,
      imageSrcSet: attributes.srcSet,
      referrerPolicy: props.referrerPolicy,
    });
  }

  const shown = resolveShown(current, attributes, fallbackSrc, { height, width });

  const renderState: ImageRootState = {
    reveal: mountedOnClient && attributes.placeholderStyle === undefined && current.firstLoad,
    status: current.status,
  };

  const style: React.CSSProperties = {
    ...attributes.style,
    ...(current.status === "loaded" ? null : attributes.placeholderStyle),
  };

  const ownProps: React.ComponentProps<"img"> = {
    alt,
    style,
    decoding: attributes.decoding,
    fetchPriority: attributes.fetchPriority,
    height: attributes.height,
    loading: attributes.loading,
    onError: (event) => {
      fail(key, event.currentTarget);
    },
    // The empty image that replaces a failed one loads too, and `settle` ignores it.
    onLoad: (event) => {
      void settle(key, event.currentTarget, true);
    },
    sizes: shown.sizes ?? undefined,
    src: shown.src,
    srcSet: shown.srcSet ?? undefined,
    width: attributes.width,
  };

  return useRender({
    render,
    defaultTagName: "img",
    props: mergeProps<"img">(ownProps, props),
    ref: ref === undefined ? imageRef : [imageRef, ref],
    state: renderState,
  });
};

export { ImageProvider, ImageRoot };

export type { ImageDefaults, ImageProviderProps, ImageRootProps, ImageRootState };
