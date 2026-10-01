// jsdom lacks browser APIs that torph calls unguarded; browsers always have them.
// Import only where torph renders: Base UI changes its exit timing once these exist.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

if (!Element.prototype.animate) {
  // An animation that has already finished, which is all a test can observe.
  Element.prototype.animate = function animate() {
    const animation = {
      cancel: () => {},
      finish: () => {},
      pause: () => {},
      play: () => {},
      reverse: () => {},
      commitStyles: () => {},
      persist: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      onfinish: null as ((event: Event) => void) | null,
      oncancel: null,
      playState: "finished",
      currentTime: 0,
      finished: Promise.resolve(),
    };
    animation.finished = Promise.resolve(animation) as unknown as Promise<void>;
    queueMicrotask(() => animation.onfinish?.(new Event("finish")));
    return animation as unknown as Animation;
  };
}
