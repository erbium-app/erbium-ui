import { exampleResource } from "@/features/showcase/preview-resources";

const maxPages = 8;
const maxBytes = 8 * 1024 * 1024;
const lifetime = 3 * 60 * 1000;
type Page = { document: Document; bytes: number };
type Entry = { started: number; page: Promise<Page | undefined>; bytes: number };
const pages = new Map<string, Entry>();
const warmedModules = new Set<string>();
const queued = new Set<string>();
const adjacentRoutes = new Set<string>();
let intendedRoute: string | undefined;
let active = 0;

function allowsSpeculation() {
  const connection = Reflect.get(navigator, "connection") as
    | { saveData?: boolean; effectiveType?: string }
    | undefined;
  return navigator.onLine && !connection?.saveData && !/2g/.test(connection?.effectiveType ?? "");
}

function route(href: string) {
  const url = new URL(href, location.href);
  if (
    url.origin !== location.origin ||
    url.search ||
    (url.pathname !== "/" && !url.pathname.startsWith("/docs/")) ||
    /\.[^/]+$/.test(url.pathname)
  )
    return;
  url.hash = "";
  return url.href;
}

function trimPages() {
  let bytes = [...pages.values()].reduce((total, entry) => total + entry.bytes, 0);
  // Keep adjacent pages and the latest intent ahead of incidental viewport
  // destinations when scrolling changes the warm set.
  const importance = (key: string) => Number(adjacentRoutes.has(key) || key === intendedRoute);
  const entries = [...pages].sort(([left], [right]) => importance(left) - importance(right));
  for (const [key, entry] of entries) {
    if (pages.size <= maxPages && bytes <= maxBytes && Date.now() - entry.started < lifetime)
      continue;
    bytes -= entry.bytes;
    pages.delete(key);
  }
}

function preloadModule(href: string, destination: string) {
  const url = new URL(href, destination).href;
  if (warmedModules.has(url)) return;
  warmedModules.add(url);
  const link = document.createElement("link");
  link.rel = "modulepreload";
  link.href = url;
  link.addEventListener("load", () => link.remove(), { once: true });
  link.addEventListener(
    "error",
    () => {
      warmedModules.delete(url);
      link.remove();
    },
    { once: true },
  );
  document.head.append(link);
}

function warmPreview(next: Document, destination: string) {
  const preview = next.querySelector<HTMLElement>("[data-preview-name][data-preview-slug]");
  const name = preview?.dataset.previewName;
  const slug = preview?.dataset.previewSlug;
  if (!name || !slug) return;
  const island = preview.querySelector("astro-island");
  for (const attribute of ["component-url", "renderer-url"]) {
    const href = island?.getAttribute(attribute);
    if (href) preloadModule(href, destination);
  }
  void exampleResource(name, slug).catch(() => {});
}

async function fetchPage(href: string): Promise<Page | undefined> {
  try {
    const response = await fetch(href, { signal: AbortSignal.timeout(10_000) });
    if (
      !response.ok ||
      response.redirected ||
      !response.headers.get("content-type")?.includes("text/html")
    )
      return;
    const html = await response.text();
    if (html.length * 2 > maxBytes) return;
    const next = new DOMParser().parseFromString(html, "text/html");
    if (!next.querySelector('[name="astro-view-transitions-enabled"]')) return;
    next.querySelectorAll("noscript").forEach((element) => element.remove());
    return { document: next, bytes: html.length * 2 };
  } catch {
    // Navigation retains Astro's normal loader when speculative fetches fail.
    return;
  }
}

export function prefetch(href: string, preview = true) {
  const key = route(href);
  if (!key || !allowsSpeculation() || key === route(location.href)) return;
  if (preview) intendedRoute = key;
  const existing = pages.get(key);
  if (existing && Date.now() - existing.started < lifetime) {
    if (preview) {
      pages.delete(key);
      pages.set(key, existing);
    }
    if (preview)
      void existing.page.then((page) => {
        if (page) warmPreview(page.document, key);
      });
    return;
  }
  const entry: Entry = { started: Date.now(), page: fetchPage(key), bytes: 0 };
  pages.set(key, entry);
  trimPages();
  void entry.page.then((page) => {
    if (pages.get(key) !== entry) return;
    if (!page) pages.delete(key);
    else {
      entry.bytes = page.bytes;
      if (preview && allowsSpeculation()) warmPreview(page.document, key);
    }
    trimPages();
  });
  return entry.page;
}

async function preloadStyles(next: Document, destination: string, signal: AbortSignal) {
  const current = new Set(
    [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(
      (link) => link.href,
    ),
  );
  await Promise.all(
    [...next.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((stylesheet) => {
      const href = new URL(stylesheet.getAttribute("href") ?? "", destination).href;
      if (current.has(href)) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "style";
        link.href = href;
        if (stylesheet.crossOrigin) link.crossOrigin = stylesheet.crossOrigin;
        const finish = () => {
          clearTimeout(timeout);
          signal.removeEventListener("abort", finish);
          link.remove();
          resolve();
        };
        const timeout = setTimeout(finish, 5000);
        signal.addEventListener("abort", finish, { once: true });
        link.addEventListener("load", finish, { once: true });
        link.addEventListener("error", finish, { once: true });
        document.head.append(link);
      });
    }),
  );
}

// Cache only speculative GET documents; keep Astro's swap, history, focus,
// announcements, scripts, redirects, and fallback handling intact.
document.addEventListener("astro:before-preparation", (event) => {
  const key = route(event.to.href);
  const entry = key ? pages.get(key) : undefined;
  if (event.formData || !entry || Date.now() - entry.started >= lifetime) return;
  const original = event.loader;
  event.loader = async () => {
    const page = await entry.page;
    if (event.signal.aborted) return;
    if (!page) return original();
    const next = page.document.cloneNode(true);
    if (!(next instanceof Document)) return original();
    await preloadStyles(next, event.to.href, event.signal);
    if (!event.signal.aborted) event.newDocument = next;
  };
});

function drain() {
  if (!allowsSpeculation()) {
    queued.clear();
    return;
  }
  while (active < 2 && queued.size) {
    const href = queued.values().next().value;
    if (!href) return;
    queued.delete(href);
    const pending = prefetch(href, false);
    if (!pending) continue;
    active++;
    void pending.finally(() => {
      active--;
      drain();
    });
  }
}

const visibleLinks = new Set<HTMLAnchorElement>();
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!(entry.target instanceof HTMLAnchorElement)) continue;
    if (entry.isIntersecting) visibleLinks.add(entry.target);
    else visibleLinks.delete(entry.target);
  }
  // Desktop and mobile copies share URLs. A hidden copy must not cancel
  // warming for a visible link in the other navigation surface.
  queued.clear();
  for (const link of visibleLinks) {
    const key = route(link.href);
    if (key && queued.size < maxPages) queued.add(key);
  }
  scheduleWarming();
});

let warmingScheduled = false;
function scheduleWarming() {
  if (warmingScheduled) return;
  warmingScheduled = true;
  const run = () => {
    warmingScheduled = false;
    drain();
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 1200 });
  else setTimeout(run, 200);
}

function observeLinks() {
  observer.disconnect();
  visibleLinks.clear();
  queued.clear();
  adjacentRoutes.clear();
  intendedRoute = undefined;
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    'a[data-astro-prefetch="viewport"]',
  )) {
    const key = route(link.href);
    if (key) adjacentRoutes.add(key);
  }
  // Register adjacent pages first so they take priority over the sidebar.
  for (const selector of ['a[data-astro-prefetch="viewport"]', "a.docs-nav-link"]) {
    for (const link of document.querySelectorAll(selector)) observer.observe(link);
  }
  if (allowsSpeculation()) warmPreview(document, location.href);
}

document.addEventListener("astro:page-load", observeLinks);
observeLinks();

for (const type of ["pointerover", "focusin", "touchstart"]) {
  document.addEventListener(
    type,
    (event) => {
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (link && link.dataset.astroPrefetch !== "false") void prefetch(link.href);
    },
    { passive: true },
  );
}
