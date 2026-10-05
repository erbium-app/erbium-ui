class MobileNavigation extends HTMLElement {
  private controller?: AbortController;
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const options = { signal: this.controller.signal };
    const dialog = this.querySelector<HTMLDialogElement>("dialog")!;
    const trigger = this.querySelector<HTMLButtonElement>("[data-navigation-open]")!;
    const syncState = () => {
      trigger.setAttribute("aria-expanded", String(dialog.open));
      for (const icon of this.querySelectorAll('[data-slot="sidebar-toggle-icon"]')) {
        icon.setAttribute("data-state", dialog.open ? "open" : "closed");
      }
    };
    syncState();
    this.querySelector("[data-navigation-search]")?.addEventListener(
      "click",
      () => {
        dialog.close();
        window.dispatchEvent(new Event("erbium-search-open"));
      },
      options,
    );
    const toggleSidebar = () => {
      if (dialog.open) {
        dialog.close();
        return;
      }
      dialog.showModal();
      syncState();
    };
    trigger.addEventListener("click", toggleSidebar, options);
    window.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "b" &&
          (event.metaKey || event.ctrlKey) &&
          window.matchMedia("(max-width: 959px)").matches
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      },
      options,
    );
    dialog.addEventListener("close", syncState, options);
    dialog.addEventListener(
      "click",
      (event) => {
        const bounds = dialog.getBoundingClientRect();
        if (
          event.target === dialog &&
          (event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom)
        )
          dialog.close();
        if (event.target instanceof Element && event.target.closest("a")) dialog.close();
      },
      options,
    );
    window.matchMedia("(min-width: 960px)").addEventListener(
      "change",
      (event) => {
        if (event.matches) dialog.close();
      },
      { signal: this.controller.signal },
    );
  }
  disconnectedCallback() {
    this.controller?.abort();
  }
}
if (!customElements.get("mobile-navigation"))
  customElements.define("mobile-navigation", MobileNavigation);
