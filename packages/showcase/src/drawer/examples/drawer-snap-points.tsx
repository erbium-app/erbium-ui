import { Button } from "@erbium/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerPanel,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@erbium/ui/components/drawer";

const SNAP_POINTS = ["31rem", 1];

export default function DrawerSnapPointsExample() {
  return (
    <Drawer snapPoints={SNAP_POINTS} showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>Open Snap Drawer</DrawerTrigger>
      <DrawerPanel>
        <DrawerHeader>
          <DrawerTitle>Snap points</DrawerTitle>
          <DrawerDescription>
            Drag the drawer to snap between a compact peek and a near full-height view.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerContent>
          <div className="h-80 w-full rounded-2xl bg-muted" />
        </DrawerContent>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerPanel>
    </Drawer>
  );
}
