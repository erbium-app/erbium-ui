import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { QRCode, useQRCode } from "./index";
import type { QRCodeActions, QRCodeRootProps } from "./index";

const url = "https://ui.erbium.app";

const Code = ({ children, ...props }: Omit<QRCodeRootProps, "value">) => (
  <QRCode.Root value={url} data-testid="root" {...props}>
    <QRCode.Svg aria-label="Scan to open Erbium">
      <QRCode.Background data-testid="background" />
      <QRCode.Modules data-testid="modules" />
      <QRCode.EyeFrames data-testid="frames" />
      <QRCode.EyeCenters data-testid="centers" />
    </QRCode.Svg>
    {children}
  </QRCode.Root>
);

const Version = () => <span>version {useQRCode().version}</span>;

describe("QR code parts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("draws a named image in module units with a quiet zone", () => {
    render(<Code />);

    const image = screen.getByRole("img", { name: "Scan to open Erbium" });
    const { dataset } = screen.getByTestId("root");

    expect({
      background: screen.getByTestId("background").getAttribute("width"),
      level: dataset.level,
      logo: Object.hasOwn(dataset, "logo"),
      version: dataset.version,
      viewBox: image.getAttribute("viewBox"),
    }).toStrictEqual({
      background: "33",
      level: "M",
      logo: false,
      version: "2",
      viewBox: "0 0 33 33",
    });
  });

  it("takes className from the part's state, and a replaced element", () => {
    render(
      <QRCode.Root value={url} render={<figure data-testid="figure" />}>
        <QRCode.Svg>
          <QRCode.Modules
            data-testid="modules"
            className={(state) => `${state.level} v${state.version}`}
          />
        </QRCode.Svg>
      </QRCode.Root>,
    );

    const modules = screen.getByTestId("modules");

    expect({
      className: modules.getAttribute("class"),
      root: screen.getByTestId("figure").tagName,
      version: modules.dataset.version,
    }).toStrictEqual({ className: "M v2", root: "FIGURE", version: "2" });
  });

  it("shares the encoded code with its children", () => {
    render(
      <Code>
        <Version />
      </Code>,
    );

    expect(screen.getByText("version 2")).toBeDefined();
  });

  it("places a logo in the space logoSize keeps clear", () => {
    render(
      <QRCode.Root value={url} logoSize={0.25}>
        <QRCode.Svg>
          <QRCode.Logo data-testid="logo" />
        </QRCode.Svg>
      </QRCode.Root>,
    );

    const logo = screen.getByTestId("logo");
    const centre = Number(logo.getAttribute("x")) + Number(logo.getAttribute("width")) / 2;
    const viewBox = screen.getByRole("img").getAttribute("viewBox")?.split(" ") ?? [];

    expect(centre).toBe(Number(viewBox[2]) / 2);
  });

  it("requires logoSize before it draws a logo", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <QRCode.Root value={url}>
          <QRCode.Svg>
            <QRCode.Logo />
          </QRCode.Svg>
        </QRCode.Root>,
      ),
    ).toThrow(/logoSize/u);
  });

  it("exports the colors on screen as a standalone SVG", async () => {
    const actions = React.createRef<QRCodeActions>();

    // A stylesheet rule, as a class or a CSS variable would paint the code in a page.
    const stylesheet = document.createElement("style");

    stylesheet.textContent = '[data-testid="ink"] { fill: rgb(10, 20, 30) }';
    document.head.append(stylesheet);

    render(
      <>
        <svg aria-hidden="true">
          <symbol id="mark">
            <circle r="1" />
          </symbol>
        </svg>
        <QRCode.Root value={url} actionsRef={actions} logoSize={0.2}>
          <QRCode.Svg>
            <QRCode.Modules data-testid="ink" />
            <QRCode.Logo>
              <use href="#mark" />
            </QRCode.Logo>
          </QRCode.Svg>
        </QRCode.Root>
      </>,
    );

    const blob = await actions.current?.toBlob({ format: "svg", size: 512 });
    const markup = blob === undefined ? "" : await blob.text();
    const file = new DOMParser().parseFromString(markup, "image/svg+xml");

    expect({
      classes: file.querySelectorAll("[class]").length,
      fill: file.querySelector("path")?.getAttribute("fill"),
      symbol: file.querySelector("defs #mark circle") !== null,
      width: file.documentElement.getAttribute("width"),
    }).toStrictEqual({ classes: 0, fill: "rgb(10, 20, 30)", symbol: true, width: "512" });

    stylesheet.remove();
  });

  it("marks the drawing while it reads the colors for a file", async () => {
    const actions = React.createRef<QRCodeActions>();
    const stylesheet = document.createElement("style");

    stylesheet.textContent = "svg[data-exporting] rect { fill: rgb(1, 2, 3) }";
    document.head.append(stylesheet);

    render(<Code actionsRef={actions} />);

    const blob = await actions.current?.toBlob({ format: "svg" });
    const markup = blob === undefined ? "" : await blob.text();
    const file = new DOMParser().parseFromString(markup, "image/svg+xml");

    expect({
      fill: file.querySelector("rect")?.getAttribute("fill"),
      marked: Object.hasOwn(screen.getByRole("img").dataset, "exporting"),
    }).toStrictEqual({ fill: "rgb(1, 2, 3)", marked: false });

    stylesheet.remove();
  });

  it("downloads the file, and stays pending until it is saved", async () => {
    const user = userEvent.setup();
    const names: string[] = [];

    Object.assign(URL, {
      createObjectURL: vi.fn<typeof URL.createObjectURL>(() => "blob:qr"),
      revokeObjectURL: vi.fn<typeof URL.revokeObjectURL>(),
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function click(
      this: HTMLAnchorElement,
    ) {
      names.push(this.download);
    });

    render(
      <Code>
        <QRCode.Download format="svg" fileName="pairing">
          Save
        </QRCode.Download>
      </Code>,
    );

    const button = screen.getByRole("button", { name: "Save" });

    await user.click(button);
    await waitFor(() => {
      expect(names).toStrictEqual(["pairing.svg"]);
    });
    expect(Object.hasOwn(button.dataset, "pending")).toBeFalsy();
  });

  it("reports a file it cannot make", async () => {
    const user = userEvent.setup();
    const onExportError = vi.fn<(error: Error) => void>();

    render(
      <QRCode.Root value={url}>
        <QRCode.Download onExportError={onExportError}>Save</QRCode.Download>
      </QRCode.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(onExportError).toHaveBeenCalledOnce();
    });
  });

  it("does nothing while disabled", async () => {
    const user = userEvent.setup();
    const onExportError = vi.fn<(error: Error) => void>();

    render(
      <QRCode.Root value={url}>
        <QRCode.Download disabled onExportError={onExportError}>
          Save
        </QRCode.Download>
      </QRCode.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onExportError).not.toHaveBeenCalled();
  });
});
