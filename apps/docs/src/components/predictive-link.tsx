import { ForesightManager, useForesight } from "@foresightjs/react";
import { Link, useRouter } from "@tanstack/react-router";
import type { AnyRouter, LinkComponentProps, RegisteredRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import type { ReactElement, Ref } from "react";

// Router defaults, used when the app leaves an option unset.
const defaultPreloadStaleTime = 30_000;
const defaultPreloadGcTime = 5 * 60 * 1000;

// Foresight mirrors its state onto `data-active` by default, which collides with the
// sidebar's `data-active` styling. The manager is a client singleton; registration
// happens in effects, so the server never creates it.
if (typeof window !== "undefined") {
  ForesightManager.instance.alterGlobalSettings({ setDataAttributes: false });
}

// A URL with a scheme (`https:`, `mailto:`) leaves the router, as it does for Link.
const isExternal = (destination: string | undefined) =>
  destination !== undefined && URL.canParse(destination);

const assignRef = <T,>(ref: Ref<T> | undefined, node: T | null) => {
  if (ref === null || ref === undefined) {
    return;
  }

  if ("current" in ref) {
    ref.current = node;

    return;
  }

  return ref(node);
};

/**
 * Router's `Link`, with route preloading driven by Foresight's intent prediction.
 *
 * Router's `intent` preload waits for a hover, focus, or touch. Foresight fires earlier,
 * from the cursor's trajectory, scroll direction, and upcoming tab stops, and skips slow
 * connections. Link's own preloading stays in place as the fallback, and the router
 * deduplicates the two. The signature is Link's own, so routes, params, search, and
 * masks stay fully typed; `preload={false}` turns prediction off along with Link's
 * own preloading.
 */
export function PredictiveLink<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(props: LinkComponentProps<"a", TRouter, TFrom, TTo, TMaskFrom, TMaskTo>): ReactElement;

// The implementation sees the options of any link; the overload above restores the
// generic parameters for callers.
export function PredictiveLink({
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

  // Prediction follows Link's own preload rules: an opted-out, disabled, external,
  // or full-reload link never preloads.
  const enabled =
    (props.preload ?? defaultPreload) !== false &&
    props.disabled !== true &&
    props.reloadDocument !== true &&
    !isExternal(props.to) &&
    !isExternal(props.href);

  const { elementRef } = useForesight<HTMLAnchorElement>({
    // Foresight reads the latest options on every call, so this always preloads the
    // link's current destination: typed path, params, search, hash, and mask. The
    // router catches and logs load failures itself; anything else surfaces as an
    // unhandled rejection rather than being dropped.
    callback: () => {
      void router.preloadRoute(props);
    },
    enabled,
    name: props.to,
    // Predict again once the router would treat the preloaded match as stale or
    // collect it, so a long-lived link keeps its route warm.
    reactivateAfter: Math.min(staleTime ?? defaultPreloadStaleTime, gcTime ?? defaultPreloadGcTime),
  });

  const mergedRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      elementRef(node);
      const cleanup = assignRef(ref, node);

      return () => {
        elementRef(null);

        if (cleanup === undefined) {
          assignRef(ref, null);
        } else {
          cleanup();
        }
      };
    },
    [elementRef, ref],
  );

  return <Link {...props} ref={mergedRef} />;
}
