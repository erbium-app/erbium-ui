// @ts-nocheck
import { Button } from "../components/button";
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
} from "../components/drawer";
export default function DrawerDemo() {
  return (
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
  );
}
