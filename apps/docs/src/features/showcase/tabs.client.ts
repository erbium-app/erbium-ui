class ShowcaseTabs extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const panels = this.querySelectorAll<HTMLElement>(':scope > [role="tabpanel"][data-panel]');
    this.addEventListener(
      "showcase-tab-change",
      (event) => {
        // Toolbar tabs own selection and keyboard handling; previews remain independent.
        if (event.target !== this || !(event instanceof CustomEvent)) return;
        const detail: unknown = event.detail;
        if (!detail || typeof detail !== "object" || !("value" in detail)) return;
        const { value } = detail;
        if (value !== "preview" && value !== "code") return;
        for (const panel of panels) panel.hidden = panel.dataset.panel !== value;
      },
      { signal: this.controller.signal },
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
  }
}

if (!customElements.get("showcase-tabs")) customElements.define("showcase-tabs", ShowcaseTabs);
