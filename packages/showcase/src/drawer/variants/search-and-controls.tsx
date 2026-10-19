import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerPanel,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@erbium/ui/components/drawer";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@erbium/ui/components/command";
import { Slider } from "@erbium/ui/components/slider";
import { Field, FieldLabel } from "@erbium/ui/components/field";

const projects = [
  "Design system",
  "Documentation",
  "Website",
  "Mobile app",
  "Research",
  "Product analytics",
  "Release planning",
  "Customer feedback",
  "Engineering tools",
  "Team workspace",
];

export default function SearchAndControlsExample() {
  const [selected, setSelected] = useState("Design system");
  const [zoom, setZoom] = useState(50);

  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>Choose workspace project</DrawerTrigger>
      <DrawerPanel>
        <DrawerHeader>
          <DrawerTitle>Workspace projects</DrawerTitle>
          <DrawerDescription>Find a project and adjust its preview scale.</DrawerDescription>
        </DrawerHeader>
        <Command items={projects}>
          <CommandInput aria-label="Search projects" placeholder="Search projects…" />
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandList>
            {(project) => (
              <CommandItem
                key={project}
                value={project}
                onClick={() => {
                  setSelected(project);
                }}
              >
                {project}
              </CommandItem>
            )}
          </CommandList>
        </Command>
        <DrawerContent className="grid gap-group">
          <Field>
            <FieldLabel>Preview scale</FieldLabel>
            <Slider
              data-base-ui-swipe-ignore="x"
              value={zoom}
              onValueChange={(value) => {
                setZoom(typeof value === "number" ? value : value[0]);
              }}
              aria-label="Preview scale"
            />
          </Field>
          <p role="status" className="text-caption text-muted-foreground">
            {selected} · Preview scale {zoom}%
          </p>
        </DrawerContent>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Done</DrawerClose>
        </DrawerFooter>
      </DrawerPanel>
    </Drawer>
  );
}
