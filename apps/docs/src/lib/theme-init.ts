// Runs inline in the head before the initial paint. The closure and delegated
// listeners survive Astro swaps; no per-component theme observers are needed.
export const themeInitScript = `(() => {
  const key = "erbium-theme";
  const system = matchMedia("(prefers-color-scheme: dark)");
  let preference = null;
  let transitionFrame = 0;
  const changeTheme = (update) => {
    const root = document.documentElement;
    cancelAnimationFrame(transitionFrame);
    root.setAttribute("data-theme-changing", "");
    update();
    // Commit the new palette with transitions disabled before restoring hover feedback.
    getComputedStyle(root).getPropertyValue("--background");
    transitionFrame = requestAnimationFrame(() => {
      transitionFrame = requestAnimationFrame(() => root.removeAttribute("data-theme-changing"));
    });
  };
  const read = () => {
    try {
      const stored = localStorage.getItem(key);
      preference = stored === "dark" || stored === "light" ? stored : null;
    } catch {
      // Keep this visit's preference when storage is blocked.
    }
  };
  const sync = () => {
    const dark = document.documentElement.classList.contains("dark");
    document.getElementById("site-favicon")?.setAttribute("href",
      dark ? "/brand/erbium-logo-dark.svg" : "/brand/erbium-logo-light.svg");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",
      getComputedStyle(document.documentElement).getPropertyValue("--background").trim());
    for (const button of document.querySelectorAll("[data-theme-toggle]")) {
      button.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
      button.setAttribute("aria-pressed", String(dark));
    }
    for (const button of document.querySelectorAll("[data-showcase-theme-toggle]")) {
      const content = button.closest("showcase-tabs")?.querySelector("[data-showcase-content]");
      const showcaseDark = content?.dataset.theme ? content.dataset.theme === "dark" : dark;
      button.setAttribute("aria-label", showcaseDark ? "Use light theme for this showcase" : "Use dark theme for this showcase");
      button.setAttribute("aria-pressed", String(showcaseDark));
    }
  };
  const apply = () => {
    changeTheme(() => document.documentElement.classList.toggle("dark",
      preference ? preference === "dark" : system.matches));
    sync();
  };
  read();
  apply();
  document.addEventListener("astro:before-swap", (event) => {
    read();
    event.newDocument.documentElement.classList.toggle("dark",
      preference ? preference === "dark" : system.matches);
  });
  document.addEventListener("astro:after-swap", sync);
  document.addEventListener("astro:page-load", sync);
  document.addEventListener("DOMContentLoaded", sync, { once: true });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const showcaseButton = event.target.closest("[data-showcase-theme-toggle]");
    if (showcaseButton) {
      const content = showcaseButton.closest("showcase-tabs")?.querySelector("[data-showcase-content]");
      if (!content) return;
      const dark = content.dataset.theme ? content.dataset.theme === "dark" : document.documentElement.classList.contains("dark");
      changeTheme(() => {
        content.dataset.theme = dark ? "light" : "dark";
        content.classList.toggle("dark", !dark);
        content.classList.toggle("light", dark);
      });
      sync();
      return;
    }
    if (!event.target.closest("[data-theme-toggle]")) return;
    preference = document.documentElement.classList.contains("dark") ? "light" : "dark";
    try { localStorage.setItem(key, preference); } catch { /* In-memory preference still works. */ }
    apply();
  });
  system.addEventListener("change", () => { if (!preference) apply(); });
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) { read(); apply(); }
  });
  let printedDark = false;
  window.addEventListener("beforeprint", () => {
    printedDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");
  });
  window.addEventListener("afterprint", () => {
    document.documentElement.classList.toggle("dark", printedDark);
    sync();
  });
})();`;
