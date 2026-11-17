import { PlaygroundTable } from "../helpers";
import type { PlaygroundArgs } from "../helpers";

export const defaultProps = { caption: "Example data", rows: 3 } satisfies PlaygroundArgs;

export default function TablePlaygroundExample(args: PlaygroundArgs = defaultProps) {
  return <PlaygroundTable {...args} />;
}
