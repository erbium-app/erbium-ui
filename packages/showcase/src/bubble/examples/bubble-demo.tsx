import { Bubble, BubbleContent, BubbleGroup } from "@erbium/ui/components/bubble";

const Demo = () => (
  <BubbleGroup>
    <Bubble>
      <BubbleContent>Hello! How can I help?</BubbleContent>
    </Bubble>
    <Bubble>
      <BubbleContent>Show me the latest update.</BubbleContent>
    </Bubble>
  </BubbleGroup>
);

export default Demo;
