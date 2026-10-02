import type * as React from "react";

/*
 * Press ripple. `rippleProps` holds the two handlers a pressable element
 * merges onto itself, the way Base UI hands out `getButtonProps`:
 *
 *   <ButtonPrimitive {...mergeProps(rippleProps, props)} />
 *
 * The handlers write the pointer position to the element and run one WAAPI
 * animation of --ripple-r and --ripple-a while data-rippling is set. Everything
 * the user sees (the wave, its colour, its radius and opacity) lives in
 * styles/ripple.css; the only number here is the wave's length.
 *
 * The wave is the same size and speed on every element, whatever its size.
 */

const DURATION = 500;
const DISABLED = ':disabled, [data-disabled]:not([data-disabled="false"]), [aria-disabled="true"]';

const running = new WeakMap<HTMLElement, Animation>();

function play(element: HTMLElement, x: number | null, y: number | null) {
  // jsdom, server rendering, and old browsers have no Web Animations API.
  if (typeof element.animate !== "function" || element.matches(DISABLED)) {
    return;
  }
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const rect = element.getBoundingClientRect();
  running.get(element)?.cancel();

  element.style.setProperty("--ripple-x", `${x === null ? rect.width / 2 : x - rect.left}px`);
  element.style.setProperty("--ripple-y", `${y === null ? rect.height / 2 : y - rect.top}px`);
  element.setAttribute("data-rippling", "");

  // One ease-out clock drives radius and ink together, like a scaled circle
  // fading out. The radius is read from --ripple-radius when the wave starts.
  const animation = element.animate(
    [
      { "--ripple-r": "0px", "--ripple-a": 1 },
      { "--ripple-r": "var(--ripple-radius)", "--ripple-a": 0 },
    ],
    { duration: DURATION, easing: "ease-out" },
  );
  running.set(element, animation);

  const done = () => {
    // A newer wave owns the element; leave its state alone.
    if (running.get(element) !== animation) {
      return;
    }
    running.delete(element);
    element.removeAttribute("data-rippling");
    element.style.removeProperty("--ripple-x");
    element.style.removeProperty("--ripple-y");
  };
  animation.onfinish = done;
  animation.oncancel = done;
}

function onPointerDown(event: React.PointerEvent<HTMLElement>) {
  if (event.button === 0 && event.isPrimary) {
    play(event.currentTarget, event.clientX, event.clientY);
  }
}

// Keyboard and assistive-technology activation arrives as a click with no
// pointer, so the wave starts from the centre.
function onClick(event: React.MouseEvent<HTMLElement>) {
  if (event.detail === 0) {
    play(event.currentTarget, null, null);
  }
}

export const rippleProps = { onPointerDown, onClick };
