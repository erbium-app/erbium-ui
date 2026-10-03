import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { Canvas } from "../helpers";

const Example = () => (
  <Canvas>
    <div className="grid gap-8">
      {(["ltr", "rtl"] as const).map((direction) => (
        <section key={direction} dir={direction} className="grid justify-items-start gap-4">
          <h2 className="font-medium">{direction.toUpperCase()}</h2>
          {(["xs", "sm", "default", "lg"] as const).map((size) => (
            <ButtonGroup key={size} aria-label={`${direction} ${size} states`}>
              <Button variant="outline" size={size}>
                Rest
              </Button>
              <Button variant="outline" size={size} aria-pressed>
                Selected
              </Button>
              <Button variant="outline" size={size} aria-expanded>
                Open
              </Button>
              <Button variant="outline" size={size} aria-pressed disabled>
                Disabled
              </Button>
            </ButtonGroup>
          ))}
          <div className="flex flex-wrap items-start gap-6">
            <ButtonGroup orientation="vertical" aria-label={`${direction} vertical states`}>
              <Button variant="outline">Rest</Button>
              <Button variant="outline" aria-pressed>
                Selected
              </Button>
              <Button variant="outline" aria-expanded>
                Open
              </Button>
            </ButtonGroup>
            <ToggleGroup
              variant="outline"
              spacing={0}
              defaultValue={["center"]}
              aria-label={`${direction} alignment`}
            >
              <ToggleGroupItem value="start">Start</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="end">End</ToggleGroupItem>
            </ToggleGroup>
            <ButtonGroup aria-label={`${direction} filled states`}>
              <Button>Rest</Button>
              <Button aria-pressed>Selected</Button>
              <Button aria-expanded>Open</Button>
            </ButtonGroup>
          </div>
        </section>
      ))}
    </div>
  </Canvas>
);

export default Example;
