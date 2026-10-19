import { OverlayProvider } from "@erbium/ui/components/overlay-provider";
import { Button } from "@erbium/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerPanel,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@erbium/ui/components/drawer";

export default function DrawerDemo() {
  return (
    <OverlayProvider>
      <Drawer showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
        <DrawerPanel>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes and close when finished.</DrawerDescription>
          </DrawerHeader>
          <DrawerContent>Review your profile details here.</DrawerContent>
          <DrawerFooter>
            <DrawerClose render={<Button>Done</Button>} />
          </DrawerFooter>
        </DrawerPanel>
      </Drawer>
    </OverlayProvider>
  );
}
