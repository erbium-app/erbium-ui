import { Skeleton } from "@erbium/ui/components/skeleton";
import { LoadingControls, useSimulatedFetch } from "../../loading";
import { paragraphs, sampleParagraphs } from "../fixtures";

/** Each line of text gets a bar from the font's ascender to its descender, wrapped as it will be. */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonTextExample({ latency }: { latency?: number } = defaultProps) {
  const request = useSimulatedFetch(paragraphs, { latency });

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-group">
      <Skeleton
        data={request.data}
        sample={sampleParagraphs}
        loading={request.loading}
        label="Loading article"
        className="w-full"
      >
        {(value) => (
          <article className="flex flex-col gap-related">
            <h3 className="text-title font-semibold">Measured, not guessed</h3>
            {value.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </article>
        )}
      </Skeleton>
      <LoadingControls {...request} />
    </div>
  );
}
