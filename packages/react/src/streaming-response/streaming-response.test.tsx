import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import { useTextStream } from "./index";
import type { UseTextStreamOptions } from "./index";

// A controllable source: the test decides when each chunk arrives.
const createSource = () => {
  let controller: ReadableStreamDefaultController<string> | undefined;

  const stream = new ReadableStream<string>({
    start(next) {
      controller = next;
    },
  });

  return {
    close: () => controller?.close(),
    fail: (error: Error) => controller?.error(error),
    push: (chunk: string) => controller?.enqueue(chunk),
    stream,
  };
};

const setup = (options?: UseTextStreamOptions) => renderHook(() => useTextStream(options));

describe(useTextStream, () => {
  it("collects a stream from pending to complete", async () => {
    const onFinish = vi.fn<NonNullable<UseTextStreamOptions["onFinish"]>>();
    const source = createSource();
    const { result } = setup({ onFinish });

    expect(result.current.status).toBe("idle");

    let done: Promise<void> | undefined;

    act(() => {
      done = result.current.start(source.stream);
    });

    expect(result.current.status).toBe("pending");

    act(() => {
      source.push("Hello ");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("streaming");
    });

    await act(async () => {
      source.push("world");
      source.close();
      await done;
    });

    expect(result.current).toMatchObject({ status: "complete", text: "Hello world" });
    expect(onFinish).toHaveBeenCalledWith("Hello world", { stopped: false });
  });

  it("keeps the text and aborts the request when stopped", async () => {
    const onFinish = vi.fn<NonNullable<UseTextStreamOptions["onFinish"]>>();
    const source = createSource();
    const { result } = setup({ onFinish });
    let signal: AbortSignal | undefined;
    let done: Promise<void> | undefined;

    act(() => {
      done = result.current.start((next) => {
        signal = next;

        return source.stream;
      });
    });

    act(() => {
      source.push("Partial");
    });

    await waitFor(() => {
      expect(result.current.text).toBe("Partial");
    });

    await act(async () => {
      result.current.stop();
      await done;
    });

    expect(signal?.aborted).toBeTruthy();
    expect(result.current).toMatchObject({ status: "complete", text: "Partial" });
    expect(onFinish).toHaveBeenCalledWith("Partial", { stopped: true });
  });

  it("reports a failure and keeps what arrived", async () => {
    const onError = vi.fn<NonNullable<UseTextStreamOptions["onError"]>>();
    const source = createSource();
    const { result } = setup({ onError });
    let done: Promise<void> | undefined;

    act(() => {
      done = result.current.start(source.stream);
    });

    act(() => {
      source.push("Half");
    });

    await waitFor(() => {
      expect(result.current.text).toBe("Half");
    });

    await act(async () => {
      source.fail(new Error("offline"));
      await done;
    });

    expect(result.current).toMatchObject({ status: "error", text: "Half" });
    expect(result.current.error?.message).toBe("offline");
    expect(onError).toHaveBeenCalledOnce();
  });

  it("ignores a stream that a newer one replaced", async () => {
    const onFinish = vi.fn<NonNullable<UseTextStreamOptions["onFinish"]>>();
    const old = createSource();
    const next = createSource();
    const { result } = setup({ onFinish });
    let first: Promise<void> | undefined;
    let second: Promise<void> | undefined;

    act(() => {
      first = result.current.start(old.stream);
    });

    act(() => {
      second = result.current.start(next.stream);
    });

    await act(async () => {
      next.push("new");
      next.close();
      await Promise.all([first, second]);
    });

    expect(result.current.text).toBe("new");
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it("aborts on unmount and resets to idle", () => {
    const source = createSource();
    const { result, unmount } = setup();
    let signal: AbortSignal | undefined;

    act(() => {
      void result.current.start((next) => {
        signal = next;

        return source.stream;
      });
    });

    act(() => {
      result.current.reset();
    });

    expect(signal?.aborted).toBeTruthy();
    expect(result.current).toMatchObject({ status: "idle", text: "" });

    act(() => {
      void result.current.start((next) => {
        signal = next;

        return createSource().stream;
      });
    });

    unmount();

    expect(signal?.aborted).toBeTruthy();
  });
});
