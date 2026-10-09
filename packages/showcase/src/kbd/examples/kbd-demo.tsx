import { Kbd } from "@erbium/ui/components/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-related">
      <Kbd hotkey="Mod+Shift+K" />
      <Kbd hotkey="Mod+B" />
      <Kbd hotkey="Escape" />
    </div>
  );
}
