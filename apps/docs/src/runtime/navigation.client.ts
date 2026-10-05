const sidebarContent = () =>
  document.querySelector<HTMLElement>(".docs-sidebar .docs-sidebar-content");
const revealActive = () => {
  const sidebar = sidebarContent();
  const active = sidebar?.querySelector<HTMLElement>('[aria-current="page"]');
  if (!sidebar || !active || sidebar.clientHeight === 0) return;
  const viewport = sidebar.getBoundingClientRect();
  const bounds = active.getBoundingClientRect();
  if (bounds.top < viewport.top) sidebar.scrollTop += bounds.top - viewport.top;
  else if (bounds.bottom > viewport.bottom) sidebar.scrollTop += bounds.bottom - viewport.bottom;
};
let sidebarScrollTop = 0;
let sidebarNavigation = false;
document.addEventListener("astro:before-preparation", (event) => {
  sidebarNavigation =
    event.sourceElement instanceof Element &&
    Boolean(event.sourceElement.closest(".docs-sidebar .docs-sidebar-content"));
});
document.addEventListener("astro:before-swap", () => {
  for (const dialog of document.querySelectorAll<HTMLDialogElement>("dialog[open]")) dialog.close();
  sidebarScrollTop =
    document.querySelector<HTMLElement>(".docs-sidebar .docs-sidebar-content")?.scrollTop ?? 0;
});
// Astro restores focus to persisted links during the swap, which can scroll
// their container. Restore the offset after that focus step, before paint.
document.addEventListener("astro:after-swap", () => {
  const sidebar = document.querySelector<HTMLElement>(".docs-sidebar .docs-sidebar-content");
  if (sidebar) sidebar.scrollTop = sidebarScrollTop;
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  for (const link of document.querySelectorAll<HTMLAnchorElement>(".docs-nav-link")) {
    const active = link.pathname === pathname;
    link.toggleAttribute("data-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  if (!sidebarNavigation) revealActive();
});
revealActive();

document.addEventListener("astro:page-load", () => {
  if (!window.location.hash && document.activeElement === document.body) {
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }
});
