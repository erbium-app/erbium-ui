import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

type OverlaySwipeDirection = NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>;

type OverlayContextProps = {
  indentDirection: OverlaySwipeDirection | null;
  setIndentDirection: React.Dispatch<React.SetStateAction<OverlaySwipeDirection | null>>;
};

const OverlayContext = React.createContext<OverlayContextProps | null>(null);

function useOverlay(consumer = "useOverlay") {
  const context = React.useContext(OverlayContext);

  if (!context) {
    throw new Error(
      `${consumer} must be used within an OverlayProvider. Mount OverlayProvider once at the app root.`,
    );
  }

  return context;
}

/**
 * Coordinates every drawer in the tree so `DrawerIndent` can inset the page. Mount once at the
 * app root. Drawers throw when it is missing.
 */
function OverlayProvider({ children }: DrawerPrimitive.Provider.Props) {
  const [indentDirection, setIndentDirection] = React.useState<OverlaySwipeDirection | null>(null);
  const contextValue = React.useMemo(
    () => ({ indentDirection, setIndentDirection }),
    [indentDirection],
  );

  return (
    <OverlayContext.Provider value={contextValue}>
      <DrawerPrimitive.Provider>{children}</DrawerPrimitive.Provider>
    </OverlayContext.Provider>
  );
}

export { OverlayProvider, useOverlay };
export type { OverlaySwipeDirection };
