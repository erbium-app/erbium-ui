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

export default function DrawerNestedExample() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>Open Drawer</DrawerTrigger>
      <DrawerPanel>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Open another drawer on top of this one.</DrawerDescription>
        </DrawerHeader>
        <DrawerContent>
          <div className="aspect-video w-full rounded-2xl bg-muted" />
        </DrawerContent>
        <DrawerFooter>
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button variant="outline" />}>Open Nested Drawer</DrawerTrigger>
            <DrawerPanel>
              <DrawerHeader>
                <DrawerTitle>Nested Drawer</DrawerTitle>
                <DrawerDescription>
                  The parent drawer stays mounted behind this one.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerContent>
                <div className="aspect-video w-full rounded-2xl bg-muted" />
              </DrawerContent>
              <DrawerFooter>
                <Drawer showSwipeHandle>
                  <DrawerTrigger render={<Button variant="outline" />}>
                    Open Third Drawer
                  </DrawerTrigger>
                  <DrawerPanel>
                    <DrawerHeader>
                      <DrawerTitle>Third Drawer</DrawerTitle>
                      <DrawerDescription>
                        Two drawers are stacked behind this one.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerContent>
                      <div className="aspect-video w-full rounded-2xl bg-muted" />
                    </DrawerContent>
                    <DrawerFooter>
                      <Drawer showSwipeHandle>
                        <DrawerTrigger render={<Button variant="outline" />}>
                          Open Fourth Drawer
                        </DrawerTrigger>
                        <DrawerPanel>
                          <DrawerHeader>
                            <DrawerTitle>Fourth Drawer</DrawerTitle>
                            <DrawerDescription>
                              This is the frontmost drawer in the stack.
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerContent>
                            <div className="aspect-video w-full rounded-2xl bg-muted" />
                          </DrawerContent>
                          <DrawerFooter>
                            <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
                          </DrawerFooter>
                        </DrawerPanel>
                      </Drawer>
                      <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
                    </DrawerFooter>
                  </DrawerPanel>
                </Drawer>
                <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
              </DrawerFooter>
            </DrawerPanel>
          </Drawer>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerPanel>
    </Drawer>
  );
}
