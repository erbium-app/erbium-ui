import { LogoLoader } from "@erbium/ui/components/logo-loader";
import type { LogoLoaderHandle } from "@erbium/ui/components/logo-loader";
import { useRef } from "react";

export default function LogoLoaderReplayExample() {
  const logo = useRef<LogoLoaderHandle>(null);

  return (
    <a
      href="#replay"
      className="inline-flex items-center gap-related text-subtitle font-semibold text-foreground"
      onPointerEnter={() => logo.current?.replay()}
    >
      <LogoLoader ref={logo} />
      Erbium
    </a>
  );
}
