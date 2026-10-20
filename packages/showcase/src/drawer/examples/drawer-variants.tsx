import { useIsMobile } from "@erbium/ui/hooks/use-is-mobile";
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

import {
  Dialog,
  DialogPanel,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";

const DrawerExample = ({ className, label }: { className?: string; label: string }) => (
  <Drawer showSwipeHandle>
    <DrawerTrigger render={<Button variant="outline" />}>{label}</DrawerTrigger>
    <DrawerPanel className={className}>
      <DrawerHeader>
        <DrawerTitle>{label}</DrawerTitle>
        <DrawerDescription>Adjust the drawer layout for your content.</DrawerDescription>
      </DrawerHeader>
      <DrawerContent>This region scrolls when the content grows.</DrawerContent>
      <DrawerFooter>
        <DrawerClose render={<Button />}>Done</DrawerClose>
      </DrawerFooter>
    </DrawerPanel>
  </Drawer>
);

export const CustomSizes = () => (
  <DrawerExample className="h-[50vh] max-h-[50vh]" label="Open half-height drawer" />
);

export const Styling = () => (
  <DrawerExample
    className="[--drawer-inset:--spacing(4)] [--drawer-bleed-background:transparent] rounded-2xl"
    label="Open inset drawer"
  />
);

export const Responsive = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerExample label="Edit profile" />;
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>
      <DialogPanel>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            The dialog is used from 768px up; resize to see a drawer.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>Update your profile details here.</DialogContent>
      </DialogPanel>
    </Dialog>
  );
};
