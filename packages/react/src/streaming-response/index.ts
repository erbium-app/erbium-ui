/*
 * A response that arrives as a stream: `useTextStream` collects it into the text and status a
 * view renders. Rendering the Markdown is the view's job.
 */
export { useTextStream } from "./use-text-stream";

export type {
  TextStream,
  TextStreamInput,
  TextStreamState,
  UseTextStreamOptions,
} from "./use-text-stream";

export * from "./core";
