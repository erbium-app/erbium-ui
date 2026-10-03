import {
  Drawer,
  DrawerTrigger,
  DrawerPanel,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@erbium/ui/components/drawer";
import { Button } from "@erbium/ui/components/button";

const Example = (args: {
  swipeDirection: "up" | "down" | "left" | "right";
  modal: boolean;
  showSwipeHandle: boolean;
  showCloseButton: boolean;
}) => (
  <Drawer
    swipeDirection={args.swipeDirection}
    modal={args.modal}
    showSwipeHandle={args.showSwipeHandle}
  >
    <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
    <DrawerPanel showCloseButton={args.showCloseButton}>
      <DrawerHeader>
        <DrawerTitle>Drawer title</DrawerTitle>
        <DrawerDescription>Drawer description.</DrawerDescription>
      </DrawerHeader>
      <DrawerContent>Drawer content.</DrawerContent>
    </DrawerPanel>
  </Drawer>
);

export default Example;
