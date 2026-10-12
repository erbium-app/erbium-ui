let transitionFrame = 0;

/** Apply a synchronous theme update without interpolating component colors or shadows. */
export function changeTheme(update: () => void) {
  const root = document.documentElement;
  cancelAnimationFrame(transitionFrame);
  root.setAttribute("data-theme-changing", "");
  try {
    update();
  } finally {
    // Commit the new palette while transitions are disabled, including portal content.
    getComputedStyle(root).getPropertyValue("--background");
    transitionFrame = requestAnimationFrame(() => {
      transitionFrame = requestAnimationFrame(() => {
        root.removeAttribute("data-theme-changing");
      });
    });
  }
}
