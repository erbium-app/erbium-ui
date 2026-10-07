class PageTableOfContents extends HTMLElement {
  #frame = 0;
  #entries: { link: HTMLAnchorElement; target: HTMLElement }[] = [];

  connectedCallback() {
    this.#entries = [...this.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].flatMap(
      (link) => {
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        return target ? [{ link, target }] : [];
      },
    );
    window.addEventListener("scroll", this.#schedule, { passive: true });
    window.addEventListener("resize", this.#schedule);
    window.addEventListener("hashchange", this.#schedule);
    this.#schedule();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.#schedule);
    window.removeEventListener("resize", this.#schedule);
    window.removeEventListener("hashchange", this.#schedule);
    cancelAnimationFrame(this.#frame);
  }

  #schedule = () => {
    if (this.#frame) return;
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      this.#update();
    });
  };

  #update() {
    let active = this.#entries[0];
    for (const entry of this.#entries) {
      const anchorOffset =
        Number.parseFloat(getComputedStyle(entry.target).scrollMarginBlockStart) || 0;
      const threshold = anchorOffset + 2;
      if (entry.target.getBoundingClientRect().top <= threshold) active = entry;
    }
    if (
      window.scrollY > 0 &&
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    ) {
      active = this.#entries.at(-1) ?? active;
    }
    const destination = this.#entries.find((entry) => entry.link.hash === window.location.hash);
    if (destination) {
      const top = destination.target.getBoundingClientRect().top;
      const anchorOffset =
        Number.parseFloat(getComputedStyle(destination.target).scrollMarginBlockStart) || 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (Math.abs(top - anchorOffset) <= 2 || (atBottom && top >= 0 && top < window.innerHeight)) {
        active = destination;
      }
    }
    for (const entry of this.#entries) {
      if (entry === active) entry.link.setAttribute("aria-current", "location");
      else entry.link.removeAttribute("aria-current");
    }
  }
}

if (!customElements.get("page-table-of-contents")) {
  customElements.define("page-table-of-contents", PageTableOfContents);
}
