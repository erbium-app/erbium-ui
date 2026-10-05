import { createCodeCopy } from "@/features/code/copy-control.client";

class CodeBlock extends HTMLElement {
  private actions?: HTMLDivElement;

  connectedCallback() {
    if (this.actions) return;
    const code = this.querySelector("pre > code");
    if (!code) return;
    code.id ||= `code-${crypto.randomUUID()}`;
    this.actions = document.createElement("div");
    this.actions.className =
      "code-block-copy flex items-center gap-1 absolute top-2 end-2 z-1 rounded-sm bg-surface-input";
    this.actions.append(createCodeCopy(code.id, this.dataset.copyLabel ?? "Copy code"));
    this.append(this.actions);
  }

  disconnectedCallback() {
    this.actions?.remove();
    this.actions = undefined;
  }
}

if (!customElements.get("docs-code-block")) customElements.define("docs-code-block", CodeBlock);
