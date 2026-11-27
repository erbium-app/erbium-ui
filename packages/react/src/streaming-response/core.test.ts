// @vitest-environment node
import { describe, expect, it } from "vite-plus/test";
import { isRemoteUrl, isResponsePending, readTextStream } from "./core";
import type { TextStreamSource } from "./core";

const collect = async (source: TextStreamSource, signal?: AbortSignal) => {
  const chunks: string[] = [];

  await readTextStream(source, {
    signal,
    onChunk: (chunk) => {
      chunks.push(chunk);
    },
  });

  return chunks;
};

const bytes = (...parts: number[][]) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      for (const part of parts) {
        controller.enqueue(new Uint8Array(part));
      }

      controller.close();
    },
  });

describe(isResponsePending, () => {
  it("waits until there is something to read", () => {
    expect(isResponsePending("pending", "")).toBeTruthy();
    expect(isResponsePending("streaming", " \n")).toBeTruthy();
    expect(isResponsePending("streaming", "Hi")).toBeFalsy();
    expect(isResponsePending("complete", "")).toBeFalsy();
  });
});

// oxlint-disable-next-line require-await -- an async generator is the source under test.
const words = async function* words() {
  yield "Hel";
  yield "";
  yield "lo";
};

describe(readTextStream, () => {
  it("reads an async iterable of text", async () => {
    await expect(collect(words())).resolves.toStrictEqual(["Hel", "lo"]);
  });

  it("decodes a character split between byte chunks", async () => {
    // "é" is 0xC3 0xA9 in UTF-8.
    const chunks = await collect(bytes([99, 97, 102, 0xc3], [0xa9]));

    expect(chunks.join("")).toBe("café");
  });

  it("stops and cancels the source when the signal aborts", async () => {
    const controller = new AbortController();
    let cancelled = false;

    const source = new ReadableStream<string>({
      cancel() {
        cancelled = true;
      },
      start(stream) {
        stream.enqueue("first");
      },
    });

    const chunks: string[] = [];

    await readTextStream(source, {
      signal: controller.signal,
      onChunk: (chunk) => {
        chunks.push(chunk);
        controller.abort();
      },
    });

    expect(chunks).toStrictEqual(["first"]);
    expect(cancelled).toBeTruthy();
  });

  it("does not wait for a source that never answers", async () => {
    const controller = new AbortController();
    const source = new ReadableStream<string>();
    const reading = collect(source, controller.signal);

    controller.abort();

    await expect(reading).resolves.toStrictEqual([]);
  });

  it("rejects when the source fails", async () => {
    const source = new ReadableStream<string>({
      start(controller) {
        controller.error(new Error("offline"));
      },
    });

    await expect(collect(source)).rejects.toThrow("offline");
  });
});

describe(isRemoteUrl, () => {
  it.each([
    "https://example.com/a.png",
    "HTTP://example.com/a.png",
    "//example.com/a.png",
    "/\\example.com/a.png",
    "\\\\example.com/a.png",
    " https://example.com/a.png",
    "ht\ntps://example.com/a.png",
  ])("is true for %j", (url) => {
    expect(isRemoteUrl(url)).toBeTruthy();
  });

  it.each(["/a.png", "a.png", "../a.png", "?a=1", "#a", "mailto:a@example.com"])(
    "is false for %j",
    (url) => {
      expect(isRemoteUrl(url)).toBeFalsy();
    },
  );
});
