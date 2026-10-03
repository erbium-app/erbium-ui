import type { ComponentType, ReactNode } from "react";

type StoryArgs<T> = T extends { component: infer C }
  ? StoryArgs<C>
  : T extends ComponentType<infer P>
    ? P
    : T;
export type Meta<T = unknown> = {
  component?: T;
  tags?: string[];
  parameters?: Record<string, unknown>;
};
export type StoryObj<T = Record<string, unknown>> = {
  name?: string;
  args?: Partial<StoryArgs<T>>;
  argTypes?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  render: (args: StoryArgs<T>) => ReactNode;
};
