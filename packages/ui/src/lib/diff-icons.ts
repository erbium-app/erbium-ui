import { iconDefinitions } from "@erbium/icons";
import type { IconName } from "@erbium/icons";
import { spriteSheets } from "@erbium/icons/sprite";

// Pierre draws its controls from a sprite inside the shadow root. Point the
// icons Erbium renders at the shared set so a diff matches the rest of the UI.
const replacements: Record<string, IconName> = {
  "diffs-icon-expand": "chevron-down",
  "diffs-icon-expand-all": "unfold-more",
  "diffs-icon-plus": "plus",
};
const markup = `<svg data-icon-sprite data-erbium-icons aria-hidden="true" width="0" height="0">${Object.values(
  replacements,
)
  .map((name) => {
    const match = new RegExp(
      `<symbol[^>]*\\sid="${iconDefinitions[name].id}"[\\s\\S]*?</symbol>`,
    ).exec(spriteSheets.ui);
    return match?.[0] ?? "";
  })
  .join("")}</svg>`;

function applyDiffIcons(host: HTMLElement) {
  const root = host.shadowRoot;
  if (!root) return;
  if (!root.querySelector("[data-erbium-icons]")) {
    const template = document.createElement("template");
    template.innerHTML = markup;
    root.prepend(template.content);
  }
  for (const use of root.querySelectorAll("use")) {
    const name = replacements[use.getAttribute("href")?.replace(/^#/, "") ?? ""];
    if (name) use.setAttribute("href", `#${iconDefinitions[name].id}`);
  }
}

export { applyDiffIcons };
