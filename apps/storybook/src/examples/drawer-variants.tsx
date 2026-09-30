import * as React from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerTitle,
  DrawerTrigger,
} from "@erbium/ui/components/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";

function DrawerExample({ className, label }: { className?: string; label: string }) {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>{label}</DrawerTrigger>
      <DrawerContent className={className}>
        <DrawerHeader>
          <DrawerTitle>{label}</DrawerTitle>
          <DrawerDescription>Adjust the drawer layout for your content.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>This region scrolls when the content grows.</DrawerPanel>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function CustomSizes() {
  return <DrawerExample className="h-[50vh] max-h-[50vh]" label="Open half-height drawer" />;
}

export function Styling() {
  return (
    <DrawerExample
      className="[--drawer-inset:--spacing(4)] [--drawer-bleed-background:transparent] rounded-2xl"
      label="Open inset drawer"
    />
  );
}

function useIsNarrow() {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

export function Responsive() {
  const narrow = useIsNarrow();
  if (narrow) return <DrawerExample label="Edit profile" />;
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            The dialog is used above 640px; resize to see a drawer.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
