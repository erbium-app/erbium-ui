import { useLayoutEffect } from "react";
import type { ReactNode, RefObject } from "react";
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
                    className="flex size-full flex-col overflow-auto overscroll-contain *:data-[slot=component-preview]:my-auto"
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

// Hands the preview panel to the trigger as its morph element, so opening grows the panel into
// the slide and closing shrinks it back, instead of morphing from the button.
const MorphFrom = ({
  morphRef,
  target,
}: {
  morphRef: (node: HTMLElement | null) => void;
  target: RefObject<HTMLElement | null>;
}) => {
  useLayoutEffect(() => {
    morphRef(target.current);

    return () => {
      morphRef(null);
    };
  }, [morphRef, target]);

  return null;
};

/** Opens a showcase full screen. Render it in the showcase's toolbar. */
const ShowcaseFullScreenTrigger = ({
  index,
  frame,
}: {
  index: number;
  /** The preview panel the open and close transitions morph from and to. */
  frame: RefObject<HTMLElement | null>;
}) => (
  <LightboxTrigger
    index={index}
    crossfade="both"
    aria-label="Open this showcase full screen"
    render={<ToolbarButton size="icon-sm" />}
  >
    {({ morphRef }) => (
      <>
        <MorphFrom morphRef={morphRef} target={frame} />
        <Icon name="arrow-expand-01" />
      </>
    )}
  </LightboxTrigger>
);

export { ShowcaseFullScreenTrigger, ShowcaseGallery };
