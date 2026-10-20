import { spriteSheet } from "@erbium/icons/sprite";

const IconSprite = () => (
  <div
    data-slot="icon-sprite"
    aria-hidden="true"
    className="pointer-events-none absolute size-0 overflow-hidden"
    // This markup is generated from the package's authored SVG assets.
    dangerouslySetInnerHTML={{ __html: spriteSheet }}
  />
);

export { IconSprite };
