import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@erbium/ui/components/button";
import { Toggle } from "@erbium/ui/components/toggle";

interface FakeAnimation {
  cancel: () => void;
  onfinish: (() => void) | null;
  oncancel: (() => void) | null;
}

// jsdom has no Web Animations API. Stub it here only: a global stub changes
// Base UI's exit timing for every other test.
const animate = vi.fn();
const animations: FakeAnimation[] = [];

beforeEach(() => {
  animations.length = 0;
  animate.mockReset();
  animate.mockImplementation(() => {
    const animation: FakeAnimation = {
      cancel: () => animation.oncancel?.(),
      onfinish: null,
      oncancel: null,
    };
    animations.push(animation);
    return animation;
  });
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });
});

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
  vi.restoreAllMocks();
});

function press(element: Element, init: PointerEventInit = {}) {
  fireEvent.pointerDown(element, { button: 0, isPrimary: true, clientX: 30, clientY: 10, ...init });
}

function sizeOf(element: Element, width: number, height: number) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({}),
  });
}

test("starts a wave at the pointer and clears it when the wave ends", () => {
  render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });
  sizeOf(button, 80, 32);

  press(button);

  expect(button.hasAttribute("data-rippling")).toBe(true);
  expect(button.style.getPropertyValue("--ripple-x")).toBe("30px");
  expect(button.style.getPropertyValue("--ripple-y")).toBe("10px");
  expect(animate).toHaveBeenCalledTimes(1);

  animations[0]!.onfinish?.();
  expect(button.hasAttribute("data-rippling")).toBe(false);
  expect(button.style.getPropertyValue("--ripple-x")).toBe("");
});

test("plays the same wave on every element size", () => {
  const { rerender } = render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });

  sizeOf(button, 24, 24);
  press(button);
  sizeOf(button, 960, 480);
  press(button);

  const [small, large] = animate.mock.calls;
  expect(large).toEqual(small);
  rerender(<Button>Save</Button>);
});

test("reads the radius from --ripple-radius so it stays tweakable in CSS", () => {
  render(<Button>Save</Button>);
  press(screen.getByRole("button", { name: "Save" }));

  const [keyframes, options] = animate.mock.calls[0]!;
  expect(keyframes).toEqual([
    { "--ripple-r": "0px", "--ripple-a": 1 },
    { "--ripple-r": "var(--ripple-radius)", "--ripple-a": 0 },
  ]);
  expect(options).toEqual({ duration: 500, easing: "ease-out" });
});

test("does not ripple a disabled or loading button", () => {
  const { rerender } = render(<Button disabled>Save</Button>);
  press(screen.getByRole("button", { name: "Save" }));
  rerender(<Button loading>Save</Button>);
  press(screen.getByRole("button", { name: "Save" }));

  expect(animate).not.toHaveBeenCalled();
});

test("ignores secondary buttons and non-primary pointers", () => {
  render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });

  press(button, { button: 2 });
  press(button, { isPrimary: false });

  expect(animate).not.toHaveBeenCalled();
});

test("ripples from the centre on keyboard activation", () => {
  render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });
  sizeOf(button, 100, 40);

  fireEvent.click(button, { detail: 0 });
  expect(button.style.getPropertyValue("--ripple-x")).toBe("50px");
  expect(button.style.getPropertyValue("--ripple-y")).toBe("20px");

  animate.mockClear();
  fireEvent.click(button, { detail: 1 });
  expect(animate).not.toHaveBeenCalled();
});

test("respects prefers-reduced-motion", () => {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
  render(<Button>Save</Button>);
  press(screen.getByRole("button", { name: "Save" }));

  expect(animate).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
});

test("restarts on a second press without the first wave clearing the second", () => {
  render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });

  press(button, { clientX: 10 });
  press(button, { clientX: 60 });

  expect(animations).toHaveLength(2);
  // Cancelling the first wave ran its cleanup, which must not touch the second.
  expect(button.hasAttribute("data-rippling")).toBe(true);
  expect(button.style.getPropertyValue("--ripple-x")).toBe("60px");

  animations[1]!.onfinish?.();
  expect(button.hasAttribute("data-rippling")).toBe(false);
});

test("keeps the caller's own handlers", () => {
  const onPointerDown = vi.fn();
  const onClick = vi.fn();
  render(
    <Button onClick={onClick} onPointerDown={onPointerDown}>
      Save
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Save" });

  press(button);
  fireEvent.click(button, { detail: 1 });

  expect(onPointerDown).toHaveBeenCalledTimes(1);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(animate).toHaveBeenCalledTimes(1);
});

test("ripples a toggle", () => {
  render(<Toggle>Bold</Toggle>);
  press(screen.getByRole("button", { name: "Bold" }));

  expect(animate).toHaveBeenCalledTimes(1);
});

test("does nothing where the Web Animations API is missing", () => {
  Reflect.deleteProperty(Element.prototype, "animate");
  render(<Button>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });

  expect(() => press(button)).not.toThrow();
  expect(button.hasAttribute("data-rippling")).toBe(false);
});
