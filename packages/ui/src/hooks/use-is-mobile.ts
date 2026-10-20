import { useMediaQuery } from "@base-ui/react/unstable-use-media-query";

/** Below Tailwind's `md:`, the shadcn mobile breakpoint, so a viewport is never both mobile and `md`. */
const MOBILE_QUERY = "(width < 48rem)";

/**
 * Whether the viewport is mobile-sized. Built on Base UI's media query hook, so it follows
 * viewport changes through the `matchMedia` change event and never renders an unresolved value.
 * It is `false` on the server; pass `{ defaultMatches: true }` to change that, or
 * `{ noSsr: true }` in client-only apps to resolve on the first render.
 */
const useIsMobile = (options: useMediaQuery.Options = {}) => useMediaQuery(MOBILE_QUERY, options);

export { MOBILE_QUERY, useIsMobile };
