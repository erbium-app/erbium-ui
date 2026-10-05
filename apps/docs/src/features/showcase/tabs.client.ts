class ShowcaseTabs extends HTMLElement {
  private controller?: AbortController;
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const options = { signal: this.controller.signal };
    const tabs = [...this.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const select = (tab: HTMLButtonElement) => {
      for (const button of tabs) {
        button.setAttribute("aria-selected", String(button === tab));
        button.tabIndex = button === tab ? 0 : -1;
      }
      for (const panel of this.querySelectorAll<HTMLElement>("[data-panel]"))
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
    };
    for (const [index, tab] of tabs.entries()) {
      tab.addEventListener("click", () => select(tab), options);
      tab.addEventListener(
        "keydown",
        (event) => {
          const rtl = getComputedStyle(this).direction === "rtl";
          let next = index;
          if (event.key === "ArrowRight")
            next = (index + (rtl ? -1 : 1) + tabs.length) % tabs.length;
          else if (event.key === "ArrowLeft")
            next = (index + (rtl ? 1 : -1) + tabs.length) % tabs.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = tabs.length - 1;
          else return;
          event.preventDefault();
          select(tabs[next]);
          tabs[next].focus();
        },
        options,
      );
    }
  }
  disconnectedCallback() {
    this.controller?.abort();
  }
}
if (!customElements.get("showcase-tabs")) customElements.define("showcase-tabs", ShowcaseTabs);
