import { ImageProvider, ImageRoot } from "./parts";

/**
 * An image that keeps its box while it loads: `Root` renders the `<img>` with its placeholder,
 * generated `srcset` and load status, and `Provider` sets the loader for every image inside it.
 */
const Image = {
  Provider: ImageProvider,
  Root: ImageRoot,
};

export { Image };

export type { ImageDefaults, ImageProviderProps, ImageRootProps, ImageRootState } from "./parts";

export * from "./core";
