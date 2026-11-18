import type { ReactNode } from "react";
import {
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxItem,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxTrigger,
} from "@erbium/ui/blocks/lightbox";
import { Icon } from "@erbium/ui/components/icon";
import { ToolbarButton } from "@erbium/ui/components/toolbar";
import { ShowcaseFrame, ShowcaseStoreProvider } from "./showcase-frame";
import type { Variant } from "./showcase-frame";

/*
 * Full screen for a page's showcases. The page is the lightbox root, so every showcase on it is a
 * slide: the arrows, arrow keys and swipes move between them without leaving full screen, and
 * Escape returns to the page scrolled to the showcase that was open.
 */
const ShowcaseGallery = ({
  path,
  variants,
  children,
}: {
  path: string;
  /** The page's showcases in page order; a showcase's position is its trigger's `index`. */
  variants: Variant[];
  children?: ReactNode;
}) => (
  <ShowcaseStoreProvider>
    <Lightbox
      count={variants.length}
      // The page sits behind the overlay, so keep the active showcase in view for the close
      // morph, and land there without a visible jump.
      scrollTriggerIntoView={[
        { type: "onChange", behavior: "instant", block: "center" },
        { type: "onOpenComplete", behavior: "instant", block: "center" },
      ]}
    >
      {children}
      <LightboxContent
        aria-label="Showcases"
        // Examples scroll and drag, so a pull must not close the viewer.
        pullToClose={false}
        // No header: the frame carries its own toolbar, so the slide starts near the top edge.
        className="[--lb-inset-top:calc(1rem+var(--lb-safe-top))] md:[--lb-inset-top:calc(1.5rem+var(--lb-safe-top))]"
      >
        <LightboxSlides aria-label="Showcases" aria-roledescription="carousel">
          {variants.map((variant, index) => (
            <LightboxSlide key={variant.anchor}>
              <LightboxItem
                aria-label={`${index + 1} of ${variants.length}`}
                aria-roledescription="slide"
                caption={variant.title}
                index={index}
                className="size-full"
              >
                {({ morphRef }) => (
                  <ShowcaseFrame
                    ref={morphRef}
                    path={path}
                    variant={variant}
                    fill
                    actions={
                      <LightboxClose
                        aria-label="Exit full screen"
                        render={<ToolbarButton size="icon-sm" />}
                      >
                        <Icon name="arrow-shrink-01" />
                      </LightboxClose>
                    }
                  />
                )}
              </LightboxItem>
            </LightboxSlide>
          ))}
        </LightboxSlides>

        <LightboxPrevious aria-label="Previous showcase" />
        <LightboxNext aria-label="Next showcase" />

        <LightboxFooter>
          <LightboxCaption />
          <LightboxCounter />
        </LightboxFooter>
      </LightboxContent>
    </Lightbox>
  </ShowcaseStoreProvider>
);

/**
 * Opens a showcase full screen. Render it in the showcase's toolbar: the frame around it is the
 * element the open and close transitions morph from and to, so the panel grows into the slide and
 * shrinks back into the section instead of morphing from the button.
 */
const ShowcaseFullScreenTrigger = ({ index }: { index: number }) => (
  <LightboxTrigger
    index={index}
    crossfade="both"
    aria-label="Open this showcase full screen"
    render={<ToolbarButton size="icon-sm" />}
  >
    {({ morphRef }) => (
      <Icon
        name="arrow-expand-01"
        // DOM nodes are in the document before refs attach, so the enclosing frame is
        // already there for the lookup, whatever order React attaches its own ref in.
        ref={(icon) => {
          morphRef(icon?.closest<HTMLElement>("[data-slot=showcase-frame]") ?? null);

          return () => {
            morphRef(null);
          };
        }}
      />
    )}
  </LightboxTrigger>
);

export { ShowcaseFullScreenTrigger, ShowcaseGallery };
