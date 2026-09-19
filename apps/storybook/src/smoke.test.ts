describe("storybook workspace", () => {
  it("is configured for component stories", () => {
    expect("@erbium/ui/components/button").toContain("components/button");
  });
});
