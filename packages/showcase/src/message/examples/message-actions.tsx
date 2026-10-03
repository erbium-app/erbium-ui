import { HugeiconsIcon } from "@hugeicons/react";
import CopyIcon from "@hugeicons/core-free-icons/CopyIcon";
import RefreshCcwIcon from "@hugeicons/core-free-icons/RefreshCcwIcon";
import ThumbsDownIcon from "@hugeicons/core-free-icons/ThumbsDownIcon";
import ThumbsUpIcon from "@hugeicons/core-free-icons/ThumbsUpIcon";

import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";
import { Button } from "@erbium/ui/components/button";
import { Message, MessageContent, MessageFooter } from "@erbium/ui/components/message";

export function MessageActionsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>The install failure is coming from the workspace package.</BubbleContent>
          </Bubble>
          <MessageFooter>
            <Button variant="ghost" size="icon" aria-label="Copy" title="Copy">
              <HugeiconsIcon icon={CopyIcon} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Like" title="Like">
              <HugeiconsIcon icon={ThumbsUpIcon} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Dislike" title="Dislike">
              <HugeiconsIcon icon={ThumbsDownIcon} />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>
          </Bubble>
          <MessageFooter className="gap-2">
            <span className="font-normal text-error">Failed to send</span>
            <Button variant="ghost" size="icon-xs" title="Retry" aria-label="Retry">
              <HugeiconsIcon icon={RefreshCcwIcon} />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}
