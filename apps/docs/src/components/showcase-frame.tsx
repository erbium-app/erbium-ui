import { createContext, use, useCallback, useMemo, useSyncExternalStore, Suspense } from "react";
import type { ReactNode, Ref } from "react";
import { flushSync } from "react-dom";
import { CatchBoundary } from "@tanstack/react-router";
import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { Alert, AlertTitle, AlertDescription } from "@erbium/ui/components/alert";
import { Icon } from "@erbium/ui/components/icon";
import { ThemeToggleIcon } from "@erbium/ui/components/stateful-icon";
import { Toolbar, ToolbarButton } from "@erbium/ui/components/toolbar";
import { codePanelSurface } from "@erbium/ui/blocks/code-panel";
import { changeTheme } from "@erbium/ui/lib/change-theme";
import { cn } from "@erbium/ui/lib/utils";
import { examplesRequest } from "./preview-resources";
import { useTheme } from "./theme";
import type { DocPage } from "@/content/types";

type Args = NonNullable<ShowcaseStory["args"]>;

type Variant = DocPage["variants"][number];

interface ShowcaseState {
  args: Args;
  /** Overrides the site theme for this showcase only. */
  appearance?: "light" | "dark";
  /** Remounts the example and its providers so first-mount behaviour plays again. */
  mount: number;
  /** Resets the controls and the example after the args are restored. */
  revision: number;
}

type ShowcaseUpdate = (update: (state: ShowcaseState) => ShowcaseState) => void;

/*
 * A page's showcases keep their state here rather than in each section, so the inline preview
 * and its full-screen copy show the same args, theme and mount. Each showcase subscribes to its
 * own key, so a control change re-renders only that showcase.
 */
const createShowcaseStore = () => {
  const states = new Map<string, ShowcaseState>();
  const listeners = new Map<string, Set<() => void>>();

  return {
    get: (variant: Variant) => {
      const existing = states.get(variant.anchor);

      if (existing !== undefined) {
        return existing;
      }

      const initial: ShowcaseState = { args: variant.args, mount: 0, revision: 0 };
      states.set(variant.anchor, initial);

      return initial;
    },
    subscribe: (key: string, listener: () => void) => {
      const keyListeners = listeners.get(key) ?? new Set();
      keyListeners.add(listener);
      listeners.set(key, keyListeners);

      return () => {
        keyListeners.delete(listener);
      };
    },
    update: (variant: Variant, update: (state: ShowcaseState) => ShowcaseState) => {
      const current = states.get(variant.anchor) ?? {
        args: variant.args,
        mount: 0,
        revision: 0,
      };

      states.set(variant.anchor, update(current));

      for (const listener of listeners.get(variant.anchor) ?? []) {
        listener();
      }
    },
  };
};

type ShowcaseStore = ReturnType<typeof createShowcaseStore>;

const ShowcaseStoreContext = createContext<ShowcaseStore | null>(null);

const ShowcaseStoreProvider = ({ children }: { children?: ReactNode }) => {
  const store = useMemo(() => createShowcaseStore(), []);

  return <ShowcaseStoreContext value={store}>{children}</ShowcaseStoreContext>;
};

const useShowcaseState = (variant: Variant): [ShowcaseState, ShowcaseUpdate] => {
  const store = use(ShowcaseStoreContext);

  if (store === null) {
    throw new Error("useShowcaseState must be used inside ShowcaseStoreProvider.");
  }

  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(variant.anchor, listener),
    [store, variant.anchor],
  );

  const getState = () => store.get(variant);
  const state = useSyncExternalStore(subscribe, getState, getState);

  const update = useCallback<ShowcaseUpdate>(
    (change) => {
      store.update(variant, change);
    },
    [store, variant],
  );

  return [state, update];
};

const PreviewError = () => (
  <Alert variant="error">
    <AlertTitle>Preview could not load.</AlertTitle>
    <AlertDescription>Refresh the showcase to retry.</AlertDescription>
  </Alert>
);

// Shown only on client navigation before an example chunk arrives. The surface keeps
// its minimum height, so the example replaces this without shifting the page.
const PreviewLoading = () => <output aria-label="Loading preview" className="sr-only" />;

const PreviewContent = ({ path, example, args }: { path: string; example: string; args: Args }) => {
  const examples = use(examplesRequest(path));

  if (!Object.hasOwn(examples, example)) {
    throw new Error(`Missing example: ${example}`);
  }

  const Example = examples[example];

  return (
    <Example
      key={JSON.stringify(Object.entries(args).filter(([key]) => key.startsWith("default")))}
      {...args}
    />
  );
};

/**
 * The preview panel of a showcase with its toolbar: refresh, theme, and the actions passed in
 * (open or exit full screen). The docs page and the full-screen gallery both render it.
 */
const ShowcaseFrame = ({
  path,
  variant,
  actions,
  className,
  ref,
}: {
  path: string;
  variant: Variant;
  /** Toolbar buttons after refresh and theme. */
  actions?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) => {
  const [{ args, appearance, mount, revision }, update] = useShowcaseState(variant);
  const siteDark = useTheme();
  const dark = appearance === undefined ? siteDark : appearance === "dark";

  return (
    <div
      ref={ref}
      className={cn("showcase-content relative", codePanelSurface, appearance, className)}
    >
      <Toolbar aria-label="Showcase controls" className="absolute top-2 end-2 z-1">
        <ToolbarButton
          size="icon-sm"
          aria-label="Refresh this showcase"
          onClick={() => {
            update((state) => ({ ...state, mount: state.mount + 1 }));
          }}
        >
          <Icon name="refresh-cw" />
        </ToolbarButton>
        <ToolbarButton
          size="icon-sm"
          aria-label={
            dark ? "Use light theme for this showcase" : "Use dark theme for this showcase"
          }
          onClick={() => {
            changeTheme(() => {
              flushSync(() => {
                update((state) => ({ ...state, appearance: dark ? "light" : "dark" }));
              });
            });
          }}
        >
          <ThemeToggleIcon theme={dark ? "dark" : "light"} />
        </ToolbarButton>
        {actions}
      </Toolbar>
      <CatchBoundary getResetKey={() => `${revision}:${mount}`} errorComponent={PreviewError}>
        <ShowcaseProviders key={mount}>
          <ShowcaseSurface>
            <Suspense fallback={<PreviewLoading />}>
              <PreviewContent
                key={revision}
                path={path}
                example={`${variant.name}/${variant.slug}`}
                args={args}
              />
            </Suspense>
          </ShowcaseSurface>
        </ShowcaseProviders>
      </CatchBoundary>
    </div>
  );
};

export { ShowcaseFrame, ShowcaseStoreProvider, useShowcaseState };

export type { Args, ShowcaseState, Variant };
