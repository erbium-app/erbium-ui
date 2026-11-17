import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { useSimulatedFetch } from "../../loading";
import { profile, sampleProfile } from "../fixtures";
import type { Profile } from "../fixtures";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("");

export const ProfileCard = ({ profile: value }: { profile: Profile }) => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <div className="flex items-center gap-group">
        <Avatar size="lg">
          <AvatarImage src={value.avatar} alt="" />
          <AvatarFallback>{initials(value.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <CardTitle>{value.name}</CardTitle>
          <CardDescription>
            {value.role} · {value.handle}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-body text-muted-foreground">{value.bio}</p>
    </CardContent>
  </Card>
);

/**
 * Render what you would show once the data arrives. Until then the card is drawn from
 * `sampleProfile`: a bar for each line of text and a block for the avatar, at their real size.
 */
const SkeletonDemo = ({ latency }: { latency?: number }) => {
  const request = useSimulatedFetch(profile, { latency });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <Skeleton
        data={request.data}
        sample={sampleProfile}
        loading={request.loading}
        id="skeleton-profile"
        label="Loading profile"
        className="w-full"
      >
        {(value) => <ProfileCard profile={value} />}
      </Skeleton>
    </div>
  );
};

export default SkeletonDemo;
