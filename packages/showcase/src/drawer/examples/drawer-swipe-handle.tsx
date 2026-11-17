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

export default function DrawerSwipeHandleExample() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>Open Drawer</DrawerTrigger>
      <DrawerPanel>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>
        </DrawerHeader>
        <DrawerContent>
          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </DrawerContent>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerPanel>
    </Drawer>
  );
}
