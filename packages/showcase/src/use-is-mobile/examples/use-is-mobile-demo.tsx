import { useIsMobile } from "@erbium/ui/hooks/use-is-mobile";

export default function Demo() {
  const isMobile = useIsMobile();

  return (
    <p aria-live="polite">
      Viewport: {isMobile ? "mobile" : "desktop"}. Resize the window to update.
    </p>
  );
}
