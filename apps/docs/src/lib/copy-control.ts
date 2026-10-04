import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import { buttonVariants } from "@erbium/ui/lib/button-variants";

function copyIcon(icon: typeof CopyIcon) {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  for (const [key, value] of Object.entries({
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
  }))
    svg.setAttribute(key, value);
  for (const [tag, attributes] of icon) {
    const child = document.createElementNS(namespace, tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key !== "key")
        child.setAttribute(
          key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
          String(value),
        );
    }
    svg.append(child);
  }
  return svg;
}

export function createCodeCopy(target: string, label: string) {
  const control = document.createElement("docs-copy");
  control.dataset.target = target;
  const button = document.createElement("button");
  button.type = "button";
  button.className = buttonVariants({ variant: "ghost", size: "icon-xs" });
  button.dataset.slot = "button";
  button.dataset.size = "icon-xs";
  button.dataset.variant = "ghost";
  button.setAttribute("aria-label", label);
  button.append(copyIcon(CopyIcon));
  const status = document.createElement("span");
  status.className = "sr-only";
  status.setAttribute("role", "status");
  control.append(button, status);
  return control;
}

class DocsCopy extends HTMLElement {
  private controller?: AbortController;
  private timer?: ReturnType<typeof setTimeout>;
  private pending = false;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const button = this.querySelector("button");
    const status = this.querySelector('[role="status"]');
    const label = this.querySelector("[data-copy-label]");
    const originalLabel = label?.textContent ?? "Copy";
    const reset = () => {
      button?.querySelector("svg")?.replaceWith(copyIcon(CopyIcon));
      if (label) label.textContent = originalLabel;
      if (status) status.textContent = "";
    };
    button?.addEventListener(
      "click",
      async () => {
        if (this.pending) return;
        this.pending = true;
        try {
          let content = this.dataset.target
            ? document.getElementById(this.dataset.target)?.textContent
            : undefined;
          if (this.dataset.url) {
            const response = await fetch(this.dataset.url, { signal: this.controller?.signal });
            if (!response.ok) throw new Error("Markdown could not be loaded");
            content = await response.text();
          }
          if (content == null) throw new Error("Copy target could not be found");
          await navigator.clipboard.writeText(content);
          button.querySelector("svg")?.replaceWith(copyIcon(CheckIcon));
          if (label) label.textContent = "Copied";
          if (status) status.textContent = "Copied to clipboard.";
        } catch {
          if (status) status.textContent = "Unable to copy. Please try again.";
        } finally {
          this.pending = false;
          clearTimeout(this.timer);
          if (this.isConnected) this.timer = setTimeout(reset, 2500);
        }
      },
      { signal: this.controller.signal },
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
    clearTimeout(this.timer);
  }
}

if (!customElements.get("docs-copy")) customElements.define("docs-copy", DocsCopy);
