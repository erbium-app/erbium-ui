import { prefetch } from "@/runtime/prefetch.client";
import type { searchGroups } from "@/content/search-index";

type SearchGroups = typeof searchGroups;
let index: Promise<SearchGroups> | undefined;
function loadIndex() {
  index ??= fetch("/search-index.json")
    .then(async (response) => {
      if (!response.ok) throw new Error("Search index could not load");
      return response.json() as Promise<SearchGroups>;
    })
    .catch((error: unknown) => {
      index = undefined;
      throw error;
    });
  return index;
}
const normalize = (value: string) => value.toLowerCase().replace(/[-_]/g, " ").trim();

class DocsSearch extends HTMLElement {
  private controller?: AbortController;
  private timer?: ReturnType<typeof setTimeout>;
  private loaded = false;
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
      if (!this.loaded) return;
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
    const render = (groups: SearchGroups) => {
      for (const group of groups) {
        const section = document.createElement("section");
        section.dataset.searchGroup = "";
        section.setAttribute("aria-label", group.title);
        const heading = document.createElement("h3");
        heading.textContent = group.title;
        const list = document.createElement("ul");
        for (const item of group.items) {
          const row = document.createElement("li");
          row.dataset.searchItem = "";
          row.dataset.keywords = normalize(`${item.title} ${item.name} ${item.description}`);
          const link = document.createElement("a");
          link.href = item.href;
          const title = document.createElement("span");
          title.textContent = item.title;
          const path = document.createElement("span");
          path.className =
            "ms-auto font-mono text-[0.65rem] text-muted-foreground max-[560px]:hidden";
          path.textContent = item.href.replace("/docs/", "");
          link.append(title, path);
          row.append(link);
          list.append(row);
        }
        section.append(heading, list);
        results.insertBefore(section, empty);
      }
      this.loaded = true;
      filter();
    };
    const open = async () => {
      document.querySelector<HTMLDialogElement>(".mobile-navigation-panel[open]")?.close();
      if (dialog.open) return;
      input.value = "";
      clear.hidden = true;
      dialog.showModal();
      input.focus();
      if (this.loaded) {
        filter();
        return;
      }
      empty.hidden = false;
      empty.textContent = "Loading documentation…";
      results.setAttribute("aria-busy", "true");
      try {
        const groups = await loadIndex();
        if (!signal.aborted && !this.loaded) render(groups);
      } catch {
        if (!signal.aborted) {
          empty.textContent = "Search could not load. Close and reopen to try again.";
          status.textContent = empty.textContent;
        }
      } finally {
        results.removeAttribute("aria-busy");
      }
    };
    document.addEventListener(
      "click",
      (event) => {
        if (event.target instanceof Element && event.target.closest("[data-search-open]"))
          void open();
      },
      options,
    );
    window.addEventListener(
      "erbium-search-open",
      () => {
        void open();
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
          else void open();
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
