import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";
import { Pagination } from "./index";
import type { PaginationRootProps } from "./index";

const Pages = (props: Omit<PaginationRootProps, "children">) => (
  <nav aria-label="Pages">
    <Pagination.Root {...props}>
      <Pagination.List>
        <li>
          <Pagination.First />
        </li>
        <li>
          <Pagination.Previous />
        </li>
        <Pagination.Items>
          {(item) =>
            item.type === "page" ? (
              <li key={item.page}>
                <Pagination.Page page={item.page} />
              </li>
            ) : (
              <li key={item.key}>
                <Pagination.Ellipsis />
              </li>
            )
          }
        </Pagination.Items>
        <li>
          <Pagination.Next />
        </li>
        <li>
          <Pagination.Last />
        </li>
      </Pagination.List>
    </Pagination.Root>
  </nav>
);

const ignorePage = (_page: number) => {};

describe("Pagination parts", () => {
  it("renders buttons that change the page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn<NonNullable<PaginationRootProps["onPageChange"]>>();

    render(<Pages defaultPage={1} pageCount={10} onPageChange={onPageChange} />);

    const first = screen.getByRole("button", { name: "1" });

    expect({
      ariaCurrent: first.getAttribute("aria-current"),
      dataCurrent: Object.hasOwn(first.dataset, "current"),
      previousDisabled: screen.getByRole<HTMLButtonElement>("button", {
        name: "Go to previous page",
      }).disabled,
    }).toStrictEqual({ ariaCurrent: "page", dataCurrent: true, previousDisabled: true });

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    const [page, details] = onPageChange.mock.calls[0] ?? [];
    expect({
      page,
      ariaCurrent: screen.getByRole("button", { name: "2" }).getAttribute("aria-current"),
      reason: details?.reason,
    }).toStrictEqual({ ariaCurrent: "page", page: 2, reason: "next-press" });

    await user.click(screen.getByRole("button", { name: "Go to last page" }));
    expect({
      ariaCurrent: screen.getByRole("button", { name: "10" }).getAttribute("aria-current"),
      nextDisabled: screen.getByRole<HTMLButtonElement>("button", { name: "Go to next page" })
        .disabled,
    }).toStrictEqual({ ariaCurrent: "page", nextDisabled: true });
  });

  it("supports uncontrolled button mode and supplies one prefetch destination per control", async () => {
    const user = userEvent.setup();

    render(
      <Pagination.Nav>
        <Pagination.Root mode="button" defaultPage={1} pageCount={3}>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Previous
                render={(props, state) => (
                  <button {...props} type="button" data-intent={state.intentPage} />
                )}
              />
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Page
                page={1}
                className={({ current }) => (current ? "current" : undefined)}
              />
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Next
                render={(props, state) => (
                  <button {...props} type="button" data-intent={state.intentPage} />
                )}
              />
            </Pagination.Item>
          </Pagination.List>
        </Pagination.Root>
      </Pagination.Nav>,
    );

    expect(screen.getByRole("navigation", { name: "pagination" })).toBeDefined();
    const previous = screen.getByRole("button", { name: "Go to previous page" });
    const next = screen.getByRole("button", { name: "Go to next page" });

    expect({
      currentClass: screen.getByRole("button", { name: "1" }).className,
      nextIntent: next.dataset.intent,
      previousHasIntent: Object.hasOwn(previous.dataset, "intent"),
    }).toStrictEqual({ currentClass: "current", nextIntent: "2", previousHasIntent: false });

    await user.click(next);

    expect([previous.dataset.intent, next.dataset.intent]).toStrictEqual(["1", "3"]);
  });

  it("preserves standalone control semantics without a pagination root", () => {
    render(
      <>
        <Pagination.Link current href="?page=1">
          1
        </Pagination.Link>
        <Pagination.Step direction="previous" disabled href="?page=0" />
        <Pagination.Step direction="next" disabled render={<button type="button">Next</button>} />
      </>,
    );

    expect(screen.getByRole("link", { name: "1" }).getAttribute("aria-current")).toBe("page");
    const previous = screen.getByRole("link", { name: "Go to previous page" });
    expect(previous.hasAttribute("href")).toBeFalsy();
    expect(previous.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("button", { name: "Go to next page" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("keeps the page when onPageChange cancels", async () => {
    const user = userEvent.setup();

    render(
      <Pages
        defaultPage={1}
        pageCount={5}
        onPageChange={(_page, details) => {
          details.cancel();
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "3" }));

    expect(screen.getByRole("button", { name: "1" }).getAttribute("aria-current")).toBe("page");
  });

  it("follows a controlled page", () => {
    const { rerender } = render(<Pages page={4} pageCount={9} onPageChange={ignorePage} />);

    expect(screen.getByRole("button", { name: "4" }).getAttribute("aria-current")).toBe("page");
    rerender(<Pages page={9} pageCount={9} onPageChange={ignorePage} />);
    expect(screen.getByRole("button", { name: "9" }).getAttribute("aria-current")).toBe("page");
  });

  it("renders links with getPageHref and disables steps without a page", () => {
    render(<Pages page={1} pageCount={3} getPageHref={(page) => `?page=${page}`} />);

    expect(screen.getByRole("link", { name: "2" }).getAttribute("href")).toBe("?page=2");

    const previous = screen.getByRole("link", { name: "Go to previous page" });

    expect(previous.hasAttribute("href")).toBeFalsy();
    expect(previous.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("link", { name: "Go to next page" }).getAttribute("href")).toBe(
      "?page=2",
    );
  });

  it("passes the target page to render functions for router links", () => {
    render(
      <Pagination.Root page={2} pageCount={3}>
        <Pagination.Next
          render={(props, state) => (
            <a {...props} href={`/items/${state.page}`}>
              {props.children}
            </a>
          )}
        />
      </Pagination.Root>,
    );

    expect(screen.getByRole("link", { name: "Go to next page" }).getAttribute("href")).toBe(
      "/items/3",
    );
  });

  it("hides gaps and names them for screen readers", () => {
    const { container } = render(<Pages page={10} pageCount={20} onPageChange={ignorePage} />);
    const gaps = container.querySelectorAll("span[aria-hidden]");

    expect(gaps).toHaveLength(2);
    expect(gaps[0]?.textContent).toBe("More pages");
  });

  it("exposes the layout through usePagination", async () => {
    const { usePagination } = await import("./index");

    const Summary = () => {
      const { page, pageCount } = usePagination();

      return <output>{`${page} of ${pageCount}`}</output>;
    };

    render(
      <Pagination.Root page={3} pageCount={8}>
        <Summary />
      </Pagination.Root>,
    );

    expect(screen.getByRole("status").textContent).toBe("3 of 8");
  });

  it("renders on the server", () => {
    const html = renderToString(
      <Pages page={2} pageCount={4} getPageHref={(page) => `?p=${page}`} />,
    );

    expect(html).toContain('href="?p=3"');
    expect(html).toContain('aria-current="page"');
  });

  it("throws outside a root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Pagination.Next />)).toThrow("Pagination.Next must be placed within");
    spy.mockRestore();
  });
});
