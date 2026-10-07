import { prefetch } from "@/runtime/prefetch.client";
const normalize = (value: string) => value.toLowerCase().replace(/[-_]/g, " ").trim();

class DocsSearch extends HTMLElement {
  private controller?: AbortController;
  private timer?: ReturnType<typeof setTimeout>;
  private resizeObserver?: ResizeObserver;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const { signal } = this.controller;
    const options = { signal };
    const dialog = this.querySelector<HTMLDialogElement>("dialog")!;
    const input = this.querySelector<HTMLInputElement>('input[type="search"]')!;
    const clear = this.querySelector<HTMLButtonElement>("[data-search-clear]")!;
    const results = this.querySelector<HTMLElement>(".docs-search-results")!;
    const empty = this.querySelector<HTMLElement>("[data-search-empty]")!;
    const status = this.querySelector<HTMLElement>("[data-search-status]")!;
    const visibleLinks = () => [
      ...results.querySelectorAll<HTMLAnchorElement>("[data-search-item]:not([hidden]) a"),
    ];
    const updateOverflow = () => {
      results.toggleAttribute("data-has-overflow-y", results.scrollHeight > results.clientHeight);
    };
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(updateOverflow);
    this.resizeObserver.observe(results);
    const filter = () => {
      clear.hidden = input.value.length === 0;
      const query = normalize(input.value);
      for (const item of results.querySelectorAll<HTMLElement>("[data-search-item]")) {
        item.hidden = !item.dataset.keywords?.includes(query);
      }
      for (const group of results.querySelectorAll<HTMLElement>("[data-search-group]")) {
        group.hidden = !group.querySelector("[data-search-item]:not([hidden])");
      }
      const count = visibleLinks().length;
      empty.textContent = "No results found.";
      empty.hidden = count > 0;
      updateOverflow();
      status.textContent = `${count} ${count === 1 ? "result" : "results"} found.`;
    };
    const open = () => {
      document.querySelector<HTMLDialogElement>(".mobile-navigation-panel[open]")?.close();
      if (dialog.open) return;
      input.value = "";
      clear.hidden = true;
      dialog.showModal();
      filter();
      input.focus();
    };
    document.addEventListener(
      "click",
      (event) => {
        if (event.target instanceof Element && event.target.closest("[data-search-open]")) open();
      },
      options,
    );
    window.addEventListener(
      "erbium-search-open",
      () => {
        open();
      },
      options,
    );
    this.querySelector("[data-search-close]")?.addEventListener(
      "click",
      () => dialog.close(),
      options,
    );
    clear.addEventListener(
      "click",
      () => {
        input.value = "";
        clearTimeout(this.timer);
        filter();
        input.focus();
      },
      options,
    );
    window.addEventListener(
      "keydown",
      (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          if (dialog.open) dialog.close();
          else open();
        }
      },
      options,
    );
    const warmResult = (event: Event) => {
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a") : null;
      if (link && results.contains(link)) void prefetch(link.href);
    };
    results.addEventListener("pointerover", warmResult, options);
    results.addEventListener("focusin", warmResult, options);
    input.addEventListener(
      "input",
      () => {
        filter();
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const first = visibleLinks()[0];
          if (dialog.open && input.value.trim() && first) void prefetch(first.href);
        }, 150);
      },
      options,
    );
    dialog.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dialog.close();
          return;
        }
        const links = visibleLinks();
        if (!links.length) return;
        const active = links.indexOf(document.activeElement as HTMLAnchorElement);
        let next: number;
        if (event.key === "ArrowDown") next = (active + 1) % links.length;
        else if (event.key === "ArrowUp") next = active <= 0 ? links.length - 1 : active - 1;
        else if (active >= 0 && event.key === "Home") next = 0;
        else if (active >= 0 && event.key === "End") next = links.length - 1;
        else if (event.target === input && event.key === "Enter") {
          event.preventDefault();
          links[0].click();
          return;
        } else return;
        event.preventDefault();
        links[next].focus();
      },
      options,
    );
    dialog.addEventListener(
      "click",
      (event) => {
        if (event.target instanceof Element && event.target.closest("a")) dialog.close();
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dialog.close();
      },
      options,
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.resizeObserver?.disconnect();
    clearTimeout(this.timer);
  }
}
if (!customElements.get("docs-search")) customElements.define("docs-search", DocsSearch);
