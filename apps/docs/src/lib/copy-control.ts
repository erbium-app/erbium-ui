import { createCopyToClipboard } from "@erbium/ui/lib/copy-to-clipboard";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import { buttonVariants } from "@erbium/ui/lib/button-variants";
import { createStatefulIcon, setIconState } from "./stateful-icon";

export function createCodeCopy(target: string, label: string) {
  const control = document.createElement("docs-copy");
  control.dataset.target = target;
  const button = document.createElement("button");
  button.type = "button";
  button.className = buttonVariants({ variant: "ghost", size: "icon" });
  button.dataset.slot = "button";
  button.dataset.size = "icon";
  button.dataset.variant = "ghost";
  button.setAttribute("aria-label", label);
  button.append(createStatefulIcon("idle", { idle: CopyIcon, copied: CheckIcon }));
  const status = document.createElement("span");
  status.className = "sr-only";
  status.setAttribute("role", "status");
  control.append(button, status);
  return control;
}

class DocsCopy extends HTMLElement {
  private controller?: AbortController;
  private clipboard = createCopyToClipboard();
  private unsubscribe?: () => void;

  connectedCallback() {
    this.controller?.abort();
    this.unsubscribe?.();
    this.controller = new AbortController();
    const button = this.querySelector("button");
    const icon = button?.querySelector<HTMLElement>('[data-slot="stateful-icon"]');
    const status = this.querySelector('[role="status"]');
    const label = this.querySelector("[data-copy-label]");
    const originalLabel = label?.textContent ?? "Copy";
    const render = () => {
      const { isCopied, isPending, error } = this.clipboard.getSnapshot();
      if (icon) setIconState(icon, isCopied ? "copied" : "idle");
      if (button) button.setAttribute("aria-busy", String(isPending));
      if (label) label.textContent = isCopied ? "Copied" : originalLabel;
      if (status)
        status.textContent = error
          ? "Unable to copy. Please try again."
          : isCopied
            ? "Copied to clipboard."
            : "";
    };
    this.unsubscribe = this.clipboard.subscribe(render);
    render();
    button?.addEventListener(
      "click",
      (event) => {
        if (event.defaultPrevented || button.disabled) return;
        const signal = this.controller?.signal;
        void this.clipboard.copyToClipboard(async () => {
          if (this.dataset.url) {
            const response = await fetch(this.dataset.url, { signal });
            if (!response.ok) throw new Error("Markdown could not be loaded");
            return response.text();
          }
          const content = this.dataset.target
            ? document.getElementById(this.dataset.target)?.textContent
            : undefined;
          if (content == null) throw new Error("Copy target could not be found");
          return content;
        });
      },
      { signal: this.controller.signal },
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.unsubscribe?.();
    this.clipboard.dispose();
  }
}

if (!customElements.get("docs-copy")) customElements.define("docs-copy", DocsCopy);
