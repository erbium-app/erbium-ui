import { Kbd } from "@erbium/ui/components/kbd";

const KbdDemo = () => (
  <div className="flex flex-wrap items-center justify-center gap-related">
    <Kbd hotkey="Mod+Shift+K" />
    <Kbd hotkey="Mod+B" />
    <Kbd hotkey="Escape" />
  </div>
);

export default KbdDemo;
