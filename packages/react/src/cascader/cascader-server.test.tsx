// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { Cascader } from "./index";

describe("Cascader on the server", () => {
  it("renders the trigger, value and hidden inputs without a DOM", () => {
    const html = renderToString(
      <Cascader.Root
        items={[
          { children: [{ label: "Berlin", value: "berlin" }], label: "Germany", value: "germany" },
        ]}
        defaultValue="berlin"
        name="city"
      >
        <Cascader.Trigger>
          <Cascader.Value placeholder="Pick a city" />
        </Cascader.Trigger>
      </Cascader.Root>,
    );

    expect(html).toContain("Germany / Berlin");
    expect(html).toContain('name="city"');
    expect(html).not.toContain("data-placeholder");
  });
});
