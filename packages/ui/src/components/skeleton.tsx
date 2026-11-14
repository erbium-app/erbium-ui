import * as React from "react";
import {
  Skeleton as MeasuredSkeleton,
  SkeletonSuspense as MeasuredSkeletonSuspense,
  SkulletProvider,
} from "skullet/react";
import type { SkeletonProps as MeasuredSkeletonProps, SkeletonSuspenseProps } from "skullet/react";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { shimmer } from "skullet/internal";
import { cn } from "../lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./alert";

/*
 * Erbium's loading layer. Skeletons come in two modes:
 *
 * - Measured: wrap the content you render once data arrives. While it loads, the content is laid
 *   out unseen from `sample` (or the data last shown under the same `id`) and drawn as one bar per
 *   line of text and one block per image or control, so the reveal does not move anything.
 * - Box: `<Skeleton className="h-4 w-48" />` for content with no renderable sample.
 *
 * Both share one shimmer stream across the page. The engine is skullet; nothing else in Erbium
 * imports it, apart from the hints in `lib/skeleton-hints.ts`.
 */

interface SkeletonErrorProps {
  /**
   * Shown instead of the content. An `Error` renders Erbium's error alert with its message; any
   * other node renders as given.
   */
  error?: React.ReactNode | Error;
}

// Omits from each member of the union, so the data and children forms stay distinct.
type DistributiveOmit<Type, Key extends PropertyKey> = Type extends unknown
  ? Omit<Type, Key>
  : never;

type MeasuredProps<T> = DistributiveOmit<MeasuredSkeletonProps<T>, "error"> & SkeletonErrorProps;

type SkeletonBoxProps = Omit<React.ComponentProps<"div">, "children"> & {
  children?: never;
  data?: never;
  loading?: never;
};

type SkeletonProps<T = unknown> = SkeletonBoxProps | MeasuredProps<T>;

const isMeasured = <T,>(props: SkeletonProps<T>): props is MeasuredProps<T> =>
  props.children !== undefined || "data" in props || props.loading !== undefined;

const SkeletonError = ({ error, label }: { error: Error; label?: string }) => (
  <Alert variant="error">
    <AlertTitle>
      {label === undefined ? "This could not load." : `${label.replace(/[.…]+$/u, "")} failed.`}
    </AlertTitle>
    {error.message === "" ? null : <AlertDescription>{error.message}</AlertDescription>}
  </Alert>
);

// Joins the page-wide shimmer, so skeletons that mount at different times stay in phase.
const joinShimmer = (node: HTMLDivElement | null) => {
  if (node) {
    shimmer(node);
  }
};

const SkeletonBox = ({ className, ref, ...props }: SkeletonBoxProps) => {
  const mergedRef = useMergedRefs(ref, joinShimmer);

  return (
    <div
      aria-hidden
      data-slot="skeleton"
      ref={mergedRef}
      className={cn("rounded-md bg-skeleton bg-no-repeat", className)}
      {...props}
    />
  );
};

declare global {
  interface Window {
    /** Set once the corner watcher runs, so the inline script and the client install it once. */
    erbiumSkeletonCorners?: boolean;
  }
}

/**
 * Gives skeleton bones Erbium's corner shape.
 *
 * Erbium draws every corner as a squircle except `rounded-full`, which stays round (`base.css`).
 * The engine draws its bones in shadow roots that page styles do not reach, so without this a
 * squircle badge turns into a pill and text bars come out rounder than the controls around them.
 *
 * It watches the document once per page. Server-rendered skeletons are drawn before React
 * hydrates, so `SkeletonProvider` also inlines this function as a script; it must stay
 * self-contained, referencing nothing outside its own body.
 */
const installSkeletonCorners = () => {
  if (typeof window === "undefined" || window.erbiumSkeletonCorners === true) {
    return;
  }

  window.erbiumSkeletonCorners = true;

  // `rounded-full` resolves to `calc(infinity * 1px)`; no other radius in the system comes close.
  const fullRadius = 10_000;

  const fitBone = (bone: Node) => {
    if (!(bone instanceof HTMLElement) || !bone.hasAttribute("skullet-rect")) {
      return;
    }

    const corners =
      Number(bone.style.borderRadius.replace(/px.*$/u, "")) >= fullRadius ? "round" : "squircle";

    if (bone.style.getPropertyValue("corner-shape") !== corners) {
      bone.style.setProperty("corner-shape", corners);
    }
  };

  const bones = new MutationObserver((records) => {
    for (const record of records) {
      fitBone(record.target);

      for (const node of record.addedNodes) {
        fitBone(node);
      }
    }
  });

  const watched = new WeakSet<ShadowRoot>();

  const watch = (layer: Element) => {
    // The engine reuses an open shadow root it finds, so attaching it first is safe.
    const root = layer.shadowRoot ?? layer.attachShadow({ mode: "open" });

    if (watched.has(root)) {
      return;
    }

    watched.add(root);
    bones.observe(root, { attributeFilter: ["style"], childList: true, subtree: true });

    for (const bone of root.children) {
      fitBone(bone);
    }
  };

  // Layers hold the bones; stand-ins for images still decoding at the reveal are bones in the
  // light DOM.
  const visit = (node: Node) => {
    if (!(node instanceof Element)) {
      return;
    }

    for (const element of [node, ...node.querySelectorAll("[skullet-layer], [skullet-rect]")]) {
      if (element.hasAttribute("skullet-layer")) {
        watch(element);
      } else {
        fitBone(element);
      }
    }
  };

  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        visit(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  visit(document.documentElement);
};

// Bones take Erbium's corner shapes; `SkeletonProvider` below installs this before hydration too.
const useSkeletonCorners = () => {
  React.useLayoutEffect(installSkeletonCorners, []);
};

const MeasuredSkeletonRoot = <T,>(props: MeasuredProps<T>) => {
  useSkeletonCorners();
  const { error, label, className } = props;

  return (
    <MeasuredSkeleton
      {...props}
      className={cn("min-w-0", className)}
      error={error instanceof Error ? <SkeletonError error={error} label={label} /> : error}
    />
  );
};

const Skeleton = <T,>(props: SkeletonProps<T>) => {
  if (!isMeasured(props)) {
    return <SkeletonBox {...props} />;
  }

  return <MeasuredSkeletonRoot {...props} />;
};

/** A Suspense boundary whose fallback is the measured `skeleton`, crossfading into the content. */
const SkeletonSuspense = ({ className, ...props }: SkeletonSuspenseProps) => {
  useSkeletonCorners();

  return <MeasuredSkeletonSuspense className={cn("min-w-0", className)} {...props} />;
};

type SkeletonReveal = "smart" | "together" | "sequence" | "sweep";

interface SkeletonProviderProps {
  children?: React.ReactNode;
  /** Set on the inline measuring scripts and stylesheet, for a Content Security Policy. */
  nonce?: string;
  /**
   * How content replaces its skeleton. `smart` reveals fast loads at once, crossfades refetches and
   * brings larger content in row by row.
   */
  reveal?: SkeletonReveal;
  /** Outlines every skeleton with where its shape came from and whether the reveal moved anything. */
  debug?: boolean;
}

const cornersScript = `(${installSkeletonCorners.toString()})()`;

const subscribeNever = () => () => {
  // Nothing to unsubscribe: whether this render is server-rendered never changes.
};

// True while rendering on the server and hydrating its HTML, false for client renders.
const useServerRendered = () =>
  React.useSyncExternalStore(
    subscribeNever,
    () => false,
    () => true,
  );

/**
 * Configures every `Skeleton` inside. Mount once at the app root, per request when rendering on
 * the server, so the measuring scripts are sent once a page and carry the request's nonce.
 */
const SkeletonProvider = ({ children, nonce, reveal = "smart", debug }: SkeletonProviderProps) => {
  const serverRendered = useServerRendered();

  React.useEffect(installSkeletonCorners, []);

  return (
    <SkulletProvider nonce={nonce} reveal={reveal} debug={debug}>
      {/* Server-rendered skeletons are drawn before hydration, so their corners are set up first. */}
      {serverRendered ? (
        <script
          nonce={nonce}
          suppressHydrationWarning
          // oxlint-disable-next-line react/no-danger -- a constant built from this package's own function, never user input; React escapes script text children, so an inline script needs this prop (the engine's measuring script is sent the same way).
          dangerouslySetInnerHTML={{ __html: cornersScript }}
        />
      ) : null}
      {children}
    </SkulletProvider>
  );
};

export { Skeleton, SkeletonProvider, SkeletonSuspense };

export type { SkeletonProps, SkeletonProviderProps, SkeletonReveal, SkeletonSuspenseProps };
