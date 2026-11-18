import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { createLink, useRouter } from "@tanstack/react-router";
import type { AnyRouter, LinkComponentProps, RegisteredRouter } from "@tanstack/react-router";
import type { ComponentProps, ReactElement, Ref } from "react";
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

/*
 * Components that navigate take Router's own link options and render `Link` themselves, so
 * callers never pass a link element. `to` (with `params`, `search`, `hash`, `activeOptions`)
 * names a route, typed against the app's routes; `href` names a fully built or external URL.
 * Each component declares two signatures: one for its own element or an `href`, and a generic
 * one that restores Router's types for `to`.
 */

/** Router's link options for a component that navigates to a route. */
type LinkTargetProps<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = undefined,
  TMaskFrom extends string = TFrom,
  TMaskTo extends string = "",
> = LinkComponentProps<"a", TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & { render?: never };

/** A fully built or external URL. Router's link types require `to` beside a bare `href`. */
type HrefTargetProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  to?: never;
  render?: never;
};

/** Props for a component's own element, which take no destination. */
interface NoTargetProps {
  to?: never;
  href?: never;
}

/** What an implementation sees for a destination: the options of any link. */
type AnyLinkTargetProps = Omit<LinkComponentProps<"a", RegisteredRouter, string, string>, "render">;

// An `href` target carries no route, so it needs no router.
const isHrefTarget = (props: AnyLinkTargetProps | HrefTargetProps): props is HrefTargetProps =>
  props.to === undefined;

/**
 * The link a navigating component renders. An `href` outside a router, such as in a static page
 * or a story, is a plain anchor; everything else is `Link`.
 */
const TargetLink = (props: AnyLinkTargetProps | HrefTargetProps) => {
  const router = useRouter({ warn: false });

  if (router === undefined && isHrefTarget(props)) {
    const { children, ...anchor } = props;

    return <a {...anchor}>{children}</a>;
  }

  const to: string | undefined = props.to;

  return <Link {...props} to={to} />;
};

/**
 * The element a navigating component renders: a link for a destination, which receives the
 * link options with the component's other props, otherwise the caller's `render`.
 */
const linkTarget = <TRender,>({
  to,
  href,
  render,
}: {
  to?: string;
  href?: string;
  render?: TRender;
}) => (to === undefined && href === undefined ? render : <TargetLink to={to} href={href} />);

/** Whether a component's props carry a destination. */
const hasLinkTarget = (props: {
  to?: unknown;
  href?: unknown;
}): props is AnyLinkTargetProps | HrefTargetProps =>
  props.to !== undefined || props.href !== undefined;

/**
 * The link for a component's link options, for a component whose own element types its props
 * and so cannot take Router's options alongside them.
 */
const linkFromTarget = (props: AnyLinkTargetProps | HrefTargetProps) => <TargetLink {...props} />;

export { hasLinkTarget, Link, linkFromTarget, linkTarget, TargetLink };

export type { AnyLinkTargetProps, HrefTargetProps, LinkTargetProps, NoTargetProps };
