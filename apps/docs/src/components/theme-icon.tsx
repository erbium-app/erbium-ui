import { Icon } from "@erbium/ui/components/icon";

const glyph = "transition-transform duration-ui-slow ease-ui-out motion-reduce:transition-none";

/**
 * Sun in light, moon in dark. The `dark:` variant picks the glyph, so the server render is already
 * right and a showcase frame's own appearance applies.
 */
export const ThemeIcon = () => (
  <span aria-hidden="true" className="inline-grid *:col-start-1 *:row-start-1" data-theme-motion="">
    <Icon name="sun-03" className={`${glyph} dark:scale-0 dark:-rotate-90`} />
    <Icon name="moon-02" className={`${glyph} scale-0 rotate-90 dark:scale-100 dark:rotate-0`} />
  </span>
);
