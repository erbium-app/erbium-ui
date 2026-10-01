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

test("panel sections can be wrapped in app-level components", () => {
  render(
    <Dialog defaultOpen>
      <DialogPanel showCloseButton={false}>
        <form>
          <DialogContent>Details</DialogContent>
        </form>
      </DialogPanel>
    </Dialog>,
  );
  expect(screen.getByRole("dialog").querySelector("form [data-slot=dialog-content]")).toBeTruthy();
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
  const viewport = panel.querySelector('[data-slot="dialog-content"]');
  expect(viewport?.textContent).toBe("Profile fields");
  expect(viewport?.className).toContain("data-has-overflow-y:scroll-fade-y");
  expect(panel.querySelector('[data-slot="scroll-area"]')?.className).toContain("overflow-hidden");
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
  expect(sheetPanel.querySelector('[data-slot="sheet-content"]')?.className).toContain(
    "data-has-overflow-y:scroll-fade-y",
  );

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
  expect(
    drawerPanel?.querySelector('[data-slot="drawer-content"] [data-slot="scroll-area-viewport"]')
      ?.className,
  ).toContain("data-has-overflow-y:scroll-fade-y");
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
