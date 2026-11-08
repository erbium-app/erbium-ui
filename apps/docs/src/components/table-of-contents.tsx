import { useEffect, useRef } from "react";

// Callers key this by page, so the links read on mount stay current for its lifetime.
export const TableOfContents = ({
  headings,
}: {
  headings: { id: string; title: string; depth?: number }[];
}) => {
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const links = [...(nav.current?.querySelectorAll<HTMLAnchorElement>("a[href^='#']") ?? [])];

    const entries = links.flatMap((link) => {
      const target = document.querySelector(
        `#${CSS.escape(decodeURIComponent(link.hash.slice(1)))}`,
      );

      return target ? [{ link, target }] : [];
    });

    const update = () => {
      frame = 0;
      let [active] = entries;

      for (const entry of entries) {
        // Computed lengths always resolve to px, e.g. "32px".
        const margin = Number(getComputedStyle(entry.target).scrollMarginBlockStart.slice(0, -2));
        const threshold = (Number.isFinite(margin) ? margin : 0) + 2;

        if (entry.target.getBoundingClientRect().top <= threshold) {
          active = entry;
        }
      }

      if (
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      ) {
        active = entries.at(-1) ?? active;
      }

      for (const entry of entries) {
        if (entry === active) {
          entry.link.setAttribute("aria-current", "location");
        } else {
          entry.link.removeAttribute("aria-current");
        }
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!headings.length) {
    return null;
  }

  return (
    <aside className="docs-toc text-control">
      <nav ref={nav} aria-label="Table of contents">
        <ul className="list-none m-0 p-0">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a href={`#${heading.id}`}>{heading.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
