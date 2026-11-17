import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Badge } from "@erbium/ui/components/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { useSimulatedFetch } from "../../loading";
import { members, sampleMembers } from "../fixtures";
import type { Member } from "../fixtures";

export const SkeletonMemberList = ({ members: value }: { members: Member[] }) => (
  <ItemGroup>
    {value.map((member) => (
      <Item key={member.id} size="sm">
        <ItemMedia>
          <Avatar>
            <AvatarImage src={member.avatar} alt="" />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{member.name}</ItemTitle>
          <ItemDescription>{member.email}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">{member.role}</Badge>
        </ItemActions>
      </Item>
    ))}
  </ItemGroup>
);

/** Avatars are drawn as blocks in their own shape; each image keeps its block until it decodes. */
export const SkeletonAvatar = ({ latency }: { latency?: number }) => {
  const request = useSimulatedFetch(members, { latency });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <Skeleton
        data={request.data}
        sample={sampleMembers}
        loading={request.loading}
        id="skeleton-members"
        label="Loading members"
        className="w-full"
      >
        {(value) => <SkeletonMemberList members={value} />}
      </Skeleton>
    </div>
  );
};
