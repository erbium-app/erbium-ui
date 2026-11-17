import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { SurfaceStage } from "../helpers";

export default function SurfacesControlStatesExample() {
  return (
    <SurfaceStage>
      <div className="grid gap-8">
        {(["ltr", "rtl"] as const).map((direction) => (
          <section key={direction} dir={direction} className="grid justify-items-start gap-group">
            <h2 className="text-subtitle">{direction.toUpperCase()}</h2>
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
            <div className="flex flex-wrap items-start gap-section">
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
    </SurfaceStage>
  );
}
