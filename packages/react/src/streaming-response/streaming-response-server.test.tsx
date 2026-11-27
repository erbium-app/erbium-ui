// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { useTextStream } from "./index";

const Status = () => <output>{useTextStream().status}</output>;

describe("useTextStream on the server", () => {
  it("renders idle without a DOM", () => {
    expect(renderToString(<Status />)).toContain("<output>idle</output>");
  });
});
