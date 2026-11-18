import { Button } from "@erbium/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerPanel,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@erbium/ui/components/drawer";

export default function DrawerNonModalExample() {
  return (
    <Drawer modal={false} disablePointerDismissal>
      <DrawerTrigger render={<Button variant="outline" />}>Non Modal</DrawerTrigger>
      <DrawerPanel>
        <DrawerHeader>
          <DrawerTitle>Non Modal Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <div className="rounded-2xl bg-muted h-80 w-full" />
        </DrawerContent>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerPanel>
    </Drawer>
  );
}
