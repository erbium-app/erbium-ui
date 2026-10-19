import { useMediaQuery } from "@erbium/ui/hooks/use-media-query";

export default function Demo() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", {});

  return (
    <p aria-live="polite">
      Reduced motion: {reducedMotion ? "enabled" : "disabled"}. Change your system preference to
      update.
    </p>
  );
}
