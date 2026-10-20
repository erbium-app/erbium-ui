let transitionFrame = 0;

/** Apply a synchronous theme update without interpolating component colors or shadows. */
export const changeTheme = (update: () => void) => {
  const root = document.documentElement;
  cancelAnimationFrame(transitionFrame);
  root.dataset.themeChanging = "";

  try {
    update();
  } finally {
    // Commit the new palette while transitions are disabled, including portal content.
    getComputedStyle(root).getPropertyValue("--background");
    transitionFrame = requestAnimationFrame(() => {
      transitionFrame = requestAnimationFrame(() => {
        delete root.dataset.themeChanging;
      });
    });
  }
};
