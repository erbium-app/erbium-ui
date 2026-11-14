/*
 * Eases an element's height when its content changes it, as the skeleton engine eases a container
 * when content replaces its skeleton: read the height the content had, let the change land, then
 * animate from the old height to the new one while clipping what has not been revealed yet. An
 * interrupted change starts from wherever the running one has got to, so nothing jumps.
 *
 * It is a ref callback, so it needs no hook: `ref={animateHeight}`, or merge it with other refs.
 * Only DOM changes inside the element animate; a resize of the viewport or a font loading does not.
 */

const duration = 200;
const easing = "cubic-bezier(0.2, 0, 0, 1)";

// Clip vertically only, so a shaking control is not cut at the sides, with room for the invalid
// halo and focus ring above and below the control.
const clip = {
  boxSizing: "border-box",
  overflowClipMargin: "4px",
  overflowX: "visible",
  overflowY: "clip",
};

const watchHeight = (element: HTMLElement) => {
  const height = () => element.getBoundingClientRect().height;
  let settled = height();
  let running: Animation | null = null;

  // Remembers the height content settles at, so the next change knows where it started.
  const resize = new ResizeObserver(() => {
    if (!running) {
      settled = height();
    }
  });

  // DOM changes are delivered after the change lands but before it is painted.
  const mutations = new MutationObserver(() => {
    const from = running ? height() : settled;
    running?.cancel();
    running = null;

    const to = height();
    settled = to;

    // A field shown or hidden as a whole appears at once, like any other element.
    if (
      Math.abs(to - from) < 0.5 ||
      from === 0 ||
      to === 0 ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animation = element.animate(
      [
        { ...clip, height: `${from}px` },
        { ...clip, height: `${to}px` },
      ],
      { duration, easing },
    );

    running = animation;
    animation.addEventListener("finish", () => {
      if (running === animation) {
        running = null;
        settled = height();
      }
    });
  });

  resize.observe(element);
  mutations.observe(element, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });

  return () => {
    resize.disconnect();
    mutations.disconnect();
    running?.cancel();
  };
};

interface Watcher {
  stop: () => void;
  users: number;
}

const watchers = new WeakMap<HTMLElement, Watcher>();

const attach = (element: HTMLElement) => {
  let watcher = watchers.get(element);

  if (!watcher) {
    watcher = { stop: watchHeight(element), users: 0 };
    watchers.set(element, watcher);
  }

  const current = watcher;
  current.users += 1;

  return () => {
    current.users -= 1;

    // Components that merge refs can detach and attach this again in the commit that changed the
    // content. Stopping after that commit's changes are delivered keeps one watcher, which still
    // knows the height from before them, so the change animates.
    queueMicrotask(() => {
      if (current.users === 0 && watchers.get(element) === current) {
        current.stop();
        watchers.delete(element);
      }
    });
  };
};

const animateHeight = (element: HTMLElement | null) => (element ? attach(element) : undefined);

export { animateHeight };
