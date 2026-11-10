import {
  Card,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@erbium/ui/components/card";

// Inline artwork keeps the installed example self-contained: the registry can't
// copy image files into the installer's `public/`.
const ProjectArtwork = () => (
  <svg
    aria-hidden="true"
    className="size-full"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 640 320"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="640" height="320" className="fill-muted" />
    <circle cx="509" cy="63" r="145" className="fill-chart-1/25" />
    <circle cx="92" cy="283" r="169" className="fill-chart-2/20" />
    <rect
      x="125"
      y="72"
      width="390"
      height="190"
      rx="16"
      className="fill-card stroke-border"
      strokeWidth="2"
    />
    <rect x="149" y="96" width="144" height="14" rx="7" className="fill-muted-foreground/60" />
    <rect x="149" y="127" width="210" height="9" rx="4.5" className="fill-muted-foreground/30" />
    <rect x="149" y="146" width="167" height="9" rx="4.5" className="fill-muted-foreground/30" />
    <path
      d="M155 227L220 189L277 207L352 164L412 185L488 132"
      className="stroke-chart-2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="10"
    />
    <circle cx="488" cy="132" r="11" className="fill-chart-2" />
  </svg>
);

const Example = () => (
  <Card className="w-80">
    <CardMedia className="h-40">
      <ProjectArtwork />
    </CardMedia>
    <CardHeader>
      <CardTitle>Featured project</CardTitle>
      <CardDescription>A card with media above its header.</CardDescription>
    </CardHeader>
  </Card>
);

export default Example;
