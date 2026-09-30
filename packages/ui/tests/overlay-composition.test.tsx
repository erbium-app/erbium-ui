import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from "@erbium/ui/components/dialog";
import { Drawer, DrawerContent, DrawerPanel } from "@erbium/ui/components/drawer";
import { Sheet, SheetContent, SheetPanel } from "@erbium/ui/components/sheet";
import { Command, CommandDialog } from "@erbium/ui/components/command";

test("dialog panels require a direct content section", () => {
  expect(() =>
    render(
      <Dialog>
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
        </DialogPanel>
      </Dialog>,
    ),
  ).toThrow("DialogPanel requires a direct <DialogContent> child.");

  expect(() =>
    render(
      <Dialog>
        <DialogPanel>
          <form>
            <DialogContent>Details</DialogContent>
          </form>
        </DialogPanel>
      </Dialog>,
    ),
  ).toThrow("DialogPanel accepts only direct");
});

test("sheet and drawer panels require their own content section", () => {
  expect(() =>
    render(
      <Sheet>
        <SheetPanel />
      </Sheet>,
    ),
  ).toThrow("SheetPanel requires a direct <SheetContent> child.");
  expect(() =>
    render(
      <Drawer>
        <DrawerPanel />
      </Drawer>,
    ),
  ).toThrow("DrawerPanel requires a direct <DrawerContent> child.");
});

test("content sections cannot be used outside their panel", () => {
  expect(() => render(<DialogContent />)).toThrow("DialogContent must be used inside DialogPanel.");
  expect(() => render(<SheetContent />)).toThrow("SheetContent must be used inside SheetPanel.");
  expect(() => render(<DrawerContent />)).toThrow("DrawerContent must be used inside DrawerPanel.");
});

test("dialog panel renders the popup and its body as separate sections", () => {
  render(
    <Dialog defaultOpen>
      <DialogPanel showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <DialogContent>Profile fields</DialogContent>
      </DialogPanel>
    </Dialog>,
  );

  const panel = screen.getByRole("dialog");
  expect(panel.getAttribute("data-slot")).toBe("dialog-panel");
  expect(panel.querySelector('[data-slot="dialog-content"]')?.textContent).toBe("Profile fields");
});

test("sheet and drawer bodies render inside their panels", () => {
  render(
    <Sheet defaultOpen>
      <SheetPanel showCloseButton={false}>
        <SheetContent>Sheet body</SheetContent>
      </SheetPanel>
    </Sheet>,
  );
  const sheetPanel = screen.getByRole("dialog");
  expect(sheetPanel.getAttribute("data-slot")).toBe("sheet-panel");
  expect(sheetPanel.querySelector('[data-slot="sheet-content"]')?.textContent).toBe("Sheet body");

  render(
    <Drawer defaultOpen>
      <DrawerPanel>
        <DrawerContent>Drawer body</DrawerContent>
      </DrawerPanel>
    </Drawer>,
  );
  const drawerPanel = document.querySelector('[data-slot="drawer-panel"]');
  expect(drawerPanel?.querySelector('[data-slot="drawer-content"]')?.textContent).toBe(
    "Drawer body",
  );
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
