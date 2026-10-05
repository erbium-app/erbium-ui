import type { ControlsElement } from "@/features/showcase/controls";

class ShowcaseControls extends HTMLElement implements ControlsElement {
  values: Record<string, unknown> = {};
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.values = JSON.parse(this.dataset.defaults ?? "{}");
    const options = { signal: this.controller.signal };
    this.addEventListener("submit", (event) => event.preventDefault(), options);
    this.addEventListener("input", this.update, options);
    this.addEventListener("change", this.update, options);
    this.addEventListener(
      "reset",
      () => {
        this.values = JSON.parse(this.dataset.defaults ?? "{}");
        for (const control of this.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          "[data-control]",
        )) {
          control.removeAttribute("aria-invalid");
          const error = control.parentElement?.querySelector(".preview-control-error");
          if (error) error.textContent = "";
          if (control instanceof HTMLInputElement && control.type === "checkbox") {
            const output = control.closest(".preview-boolean")?.querySelector("output");
            if (output) output.textContent = String(control.defaultChecked);
          }
        }
        this.publish();
      },
      options,
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
  }

  private publish() {
    this.dispatchEvent(
      new CustomEvent("showcase-args-change", { detail: { ...this.values }, bubbles: true }),
    );
  }

  private update = (event: Event) => {
    const control = event.target;
    if (
      !(
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement
      ) ||
      !control.dataset.control
    )
      return;
    let value: unknown = control.value;
    if (control instanceof HTMLInputElement && control.type === "checkbox") {
      value = control.checked;
      const output = control.closest(".preview-boolean")?.querySelector("output");
      if (output) output.textContent = String(value);
    } else if (control.dataset.control === "select") {
      const options: unknown[] = JSON.parse(control.dataset.options ?? "[]");
      value = control.value === "" ? undefined : options[Number(control.value)];
    } else if (control.dataset.control === "object") {
      const error = control.parentElement?.querySelector(".preview-control-error");
      try {
        value = control.value.trim() === "" ? undefined : JSON.parse(control.value);
        const initial: unknown = JSON.parse(this.dataset.defaults ?? "{}")[control.name];
        if (
          Array.isArray(initial) &&
          (!Array.isArray(value) ||
            value.some((item: unknown) => typeof item !== "number" || !Number.isFinite(item)))
        )
          throw new Error("Enter an array of numbers.");
        control.removeAttribute("aria-invalid");
        if (error) error.textContent = "";
      } catch {
        control.setAttribute("aria-invalid", "true");
        if (error) error.textContent = "Enter valid JSON matching this property's type.";
        return;
      }
    } else if (control instanceof HTMLInputElement && ["number", "range"].includes(control.type)) {
      if (!control.validity.valid) return;
      value = control.value === "" ? undefined : control.valueAsNumber;
    }
    this.values = { ...this.values, [control.name]: value };
    this.publish();
  };
}

if (!customElements.get("showcase-controls"))
  customElements.define("showcase-controls", ShowcaseControls);
