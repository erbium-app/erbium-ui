export const statefulIconRootStyles = "inline-grid shrink-0 align-middle";
export const statefulIconLayerStyles =
  "col-start-1 row-start-1 grid place-items-center rotate-90 scale-0 transition-transform duration-150 ease-in-out data-[active=true]:rotate-0 data-[active=true]:scale-100 data-[active=true]:delay-150 motion-reduce:transition-none";

export type IconDefinition = readonly (readonly [string, Record<string, string | number>])[];

// Client-created controls use the same layered markup as StatefulIcon.astro.
export function createStatefulIcon(state: string, icons: Readonly<Record<string, IconDefinition>>) {
  const root = document.createElement("span");
  root.dataset.slot = "stateful-icon";
  root.dataset.state = state;
  root.dataset.astroIcon = "";
  root.className = `${statefulIconRootStyles} size-4`;
  root.setAttribute("aria-hidden", "true");
  const namespace = "http://www.w3.org/2000/svg";
  for (const [key, icon] of Object.entries(icons)) {
    const layer = document.createElement("span");
    layer.className = statefulIconLayerStyles;
    layer.dataset.state = key;
    layer.dataset.active = String(key === state);
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("class", "size-full");
    for (const [tag, attributes] of icon) {
      const child = document.createElementNS(namespace, tag);
      for (const [name, value] of Object.entries(attributes)) {
        if (name !== "key") {
          child.setAttribute(
            name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
            String(name === "strokeWidth" ? 1.5 : value),
          );
        }
      }
      svg.append(child);
    }
    layer.append(svg);
    root.append(layer);
  }
  return root;
}

export function setIconState(icon: HTMLElement, state: string) {
  icon.dataset.state = state;
  for (const layer of icon.querySelectorAll<HTMLElement>(":scope > [data-state]")) {
    layer.dataset.active = String(layer.dataset.state === state);
  }
}
