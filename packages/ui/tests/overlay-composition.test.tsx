import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";
import { Dialog, DialogContent, DialogPanel } from "@erbium/ui/components/dialog";
import { Drawer, DrawerContent, DrawerIndent, DrawerPanel } from "@erbium/ui/components/drawer";
import { OverlayProvider } from "@erbium/ui/components/overlay-provider";
import { SheetContent } from "@erbium/ui/components/sheet";
import { Command, CommandDialog } from "@erbium/ui/components/command";

test("content sections cannot be used outside their panel", () => {
  expect(() => render(<DialogContent />)).toThrow("DialogContent must be used inside DialogPanel.");
  expect(() => render(<SheetContent />)).toThrow("SheetContent must be used inside SheetPanel.");
  expect(() => render(<DrawerContent />)).toThrow("DrawerContent must be used inside DrawerPanel.");
});

test("command dialog keeps its command inside the required dialog body", () => {
  render(
    <CommandDialog defaultOpen>
      <Command>Search results</Command>
    </CommandDialog>,
  );
  const panel = screen.getByRole("dialog");
  expect(panel.querySelector('[data-slot="dialog-content"] [data-slot="command"]')).toBeTruthy();
});

test("dialog panel can use Base UI rendering to make the popup a form", () => {
  render(
    <Dialog defaultOpen>
      <DialogPanel render={<form />} showCloseButton={false}>
        <DialogContent>Fields</DialogContent>
      </DialogPanel>
    </Dialog>,
  );
  expect(screen.getByRole("dialog").tagName).toBe("FORM");
});

test("drawers and the indent require an OverlayProvider", () => {
  expect(() => render(<Drawer />)).toThrow("Drawer must be used within an OverlayProvider.");
  expect(() => render(<DrawerIndent />)).toThrow(
    "DrawerIndent must be used within an OverlayProvider.",
  );
});

test("the indent activates and follows the open drawer's direction", () => {
  render(
    <OverlayProvider>
      <DrawerIndent data-testid="indent" />
      <Drawer defaultOpen swipeDirection="up">
        <DrawerPanel>
          <DrawerContent>Body</DrawerContent>
        </DrawerPanel>
      </Drawer>
    </OverlayProvider>,
  );
  const indent = screen.getByTestId("indent");
  expect(indent.hasAttribute("data-active")).toBe(true);
  expect(indent.getAttribute("data-swipe-direction")).toBe("up");
});

test("drawer panel can render a close button", () => {
  render(
    <OverlayProvider>
      <Drawer defaultOpen>
        <DrawerPanel showCloseButton>
          <DrawerContent>Body</DrawerContent>
        </DrawerPanel>
      </Drawer>
    </OverlayProvider>,
  );
  expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
});

test("drawer panel omits the close button by default", () => {
  render(
    <OverlayProvider>
      <Drawer defaultOpen>
        <DrawerPanel>
          <DrawerContent>Body</DrawerContent>
        </DrawerPanel>
      </Drawer>
    </OverlayProvider>,
  );
  expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
});
