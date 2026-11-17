import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Bubble, BubbleContent, BubbleGroup } from "@erbium/ui/components/bubble";
import { Message, MessageAvatar, MessageContent } from "@erbium/ui/components/message";

export default function MessageAvatarExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-section py-12">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Alex Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>The build failed during dependency installation.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>Can you share the exact error?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Alex Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>Here&apos;s the error from the logs</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>
                Something went wrong with the build. The libraries are not installed correctly. Try
                running the build again.
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
    </div>
  );
}
