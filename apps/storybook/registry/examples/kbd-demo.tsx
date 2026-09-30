// @ts-nocheck
import { Kbd } from "../components/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Kbd hotkey="Mod+Shift+K" />
      <Kbd hotkey="Mod+B" />
      <Kbd hotkey="Escape" />
    </div>
  );
}
