import { createRoot, type Root } from "react-dom/client";
import CopyAction from "./CopyAction";

// Both Markdown and Astro emit this shell; only its copy control needs React.
class CodeBlock extends HTMLElement {
  private root?: Root;
  private actions?: HTMLDivElement;

  connectedCallback() {
    if (this.root) return;
    const code = this.querySelector("pre > code");
    if (!code) return;
    code.id ||= `code-${crypto.randomUUID()}`;
    this.actions = document.createElement("div");
    this.actions.className = "code-block-copy";
    this.append(this.actions);
    this.root = createRoot(this.actions);
    this.root.render(
      <CopyAction iconOnly target={code.id} label={this.dataset.copyLabel ?? "Copy code"} />,
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = undefined;
    this.actions?.remove();
  }
}

if (!customElements.get("docs-code-block")) {
  customElements.define("docs-code-block", CodeBlock);
}
