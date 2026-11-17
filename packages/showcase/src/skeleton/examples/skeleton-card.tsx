import { Badge } from "@erbium/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { useSimulatedFetch } from "../../loading";
import { article, sampleArticle } from "../fixtures";
import type { Article } from "../fixtures";

const ArticleCard = ({ article: value }: { article: Article }) => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <div className="flex flex-wrap gap-1.5">
        {value.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <CardTitle>{value.title}</CardTitle>
      <CardDescription>{value.excerpt}</CardDescription>
    </CardHeader>
    <CardContent />
    <CardFooter className="justify-between text-caption text-muted-foreground">
      <span>{value.author}</span>
      <span>
        {value.date} · {value.readingTime}
      </span>
    </CardFooter>
  </Card>
);

/** Badges are drawn as pills, text as bars, and the card keeps its surface while it loads. */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonCardExample({ latency }: { latency?: number } = defaultProps) {
  const request = useSimulatedFetch(article, { latency });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <Skeleton
        data={request.data}
        sample={sampleArticle}
        loading={request.loading}
        id="skeleton-article"
        label="Loading article"
        className="w-full"
      >
        {(value) => <ArticleCard article={value} />}
      </Skeleton>
    </div>
  );
}
