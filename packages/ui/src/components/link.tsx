import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { createLink, useRouter } from "@tanstack/react-router";
import type { AnyRouter, LinkComponentProps, RegisteredRouter } from "@tanstack/react-router";
import type { ReactElement, Ref } from "react";
import { usePredictedIntent } from "../hooks/use-predicted-intent";

const RouterLink = createLink("a");

// Router defaults, used when the app leaves an option unset.
const defaultPreloadStaleTime = 30_000;
const defaultPreloadGcTime = 5 * 60 * 1000;

// A URL with a scheme (`https:`, `mailto:`) leaves the router, as it does for Link.
const isExternal = (destination: string | undefined) =>
  destination !== undefined && URL.canParse(destination);

/**
 * TanStack Router's `Link`, with route preloading driven by predicted intent.
 *
 * Router's `intent` preload waits for a hover, focus, or touch. This link also preloads when
 * the cursor is heading for it, when it is a tab stop or two away, or when scrolling brings it
 * under the cursor. Router's own preloading stays in place as the fallback, and the router
 * deduplicates the two.
 *
 * The signature is Router's own, so routes, params, search, and masks stay typed, and every
 * Link prop works unchanged. `preload={false}` turns prediction off along with Router's own
 * preloading; disabled, external, and `reloadDocument` links never predict.
 */
function Link<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(props: LinkComponentProps<"a", TRouter, TFrom, TTo, TMaskFrom, TMaskTo>): ReactElement;

// The implementation sees the options of any link; the overload above restores the generic
// parameters for callers.
function Link({
  ref,
  ...props
}: LinkComponentProps<"a", RegisteredRouter, string, string> & {
  ref?: Ref<HTMLAnchorElement>;
}) {
  const router = useRouter();

  const {
    defaultPreload,
    defaultPreloadGcTime: gcTime,
    defaultPreloadStaleTime: staleTime,
  } = router.options;

  const intentRef = usePredictedIntent(
    // Reads the latest props when prediction fires, so it preloads the link's current
    // destination: path, params, search, hash, and mask. The router catches and logs load
    // failures; anything else surfaces as an unhandled rejection rather than being dropped.
    () => {
      void router.preloadRoute(props);
    },
    {
      // Prediction follows Router's own preload rules.
      enabled:
        (props.preload ?? defaultPreload) !== false &&
        props.disabled !== true &&
        props.reloadDocument !== true &&
        !isExternal(props.to) &&
        !isExternal(props.href),
      name: props.to,
      // Predict again once the router would treat the preloaded match as stale or collect it.
      reactivateAfter: Math.min(
        staleTime ?? defaultPreloadStaleTime,
        gcTime ?? defaultPreloadGcTime,
      ),
    },
  );

  return <RouterLink {...props} ref={useMergedRefs(ref, intentRef)} />;
}

export { Link };
