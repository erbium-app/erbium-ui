/*
 * Turns an SVG that is on screen into a standalone file. A saved SVG, or one drawn on a canvas,
 * has no access to the page: CSS variables, classes, `currentColor`, sprite symbols and linked
 * images all resolve to nothing there. Each is written into the copy first.
 *
 * `data-exporting` is on the source while its paint is read, so CSS can paint the file
 * differently from the screen, such as a solid background behind a see-through drawing.
 */

/** The properties a stylesheet can paint an SVG with. */
const paintProperties = [
  "color",
  "display",
  "fill",
  "fill-opacity",
  "fill-rule",
  "opacity",
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "visibility",
];

/** Elements whose size can come from CSS. */
const sizedElements = new Set(["image", "svg", "use"]);

/** Writes the computed paint of an element on screen onto its copy, as attributes. */
const inlinePaint = (source: Element, copy: Element, isRoot: boolean) => {
  const computed = getComputedStyle(source);

  const properties =
    !isRoot && sizedElements.has(source.localName)
      ? [...paintProperties, "width", "height"]
      : paintProperties;

  for (const property of properties) {
    const value = computed.getPropertyValue(property);

    if (value !== "" && value !== "auto") {
      copy.setAttribute(property, value);

      // An inline style would override the attribute with the unresolved value.
      if (copy instanceof SVGElement) {
        copy.style.removeProperty(property);
      }
    }
  }

  copy.removeAttribute("class");
};

/** Where older SVG files keep their links. */
const xlink = "http://www.w3.org/1999/xlink";

const getHref = (element: Element) =>
  element.getAttribute("href") ?? element.getAttributeNS(xlink, "href");

/** Points an element at a new target, dropping the older form of the link. */
const setHref = (element: Element, href: string) => {
  element.removeAttributeNS(xlink, "href");
  element.setAttribute("href", href);
};

const findById = (root: ParentNode, id: string) => root.querySelector(`[id="${id}"]`);

const fetchResource = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load ${url}: ${response.status}.`);
  }

  return response;
};

/** Finds a symbol in the page, or in the sprite file its URL names. */
const findReference = async (url: string, id: string) => {
  if (url === "") {
    return findById(document, id);
  }

  const response = await fetchResource(url);
  const sprite = new DOMParser().parseFromString(await response.text(), "image/svg+xml");

  return findById(sprite, id);
};

/**
 * Copies what each `<use>` points at into `defs`, one at a time: a copy can hold references of
 * its own, and a later one may already be satisfied by it.
 */
const copyReferences = async (
  svg: Element,
  defs: Element,
  [use, ...rest]: readonly Element[],
): Promise<void> => {
  if (use === undefined) {
    return;
  }

  const [url = "", id = ""] = (getHref(use) ?? "").split("#");
  const nested: Element[] = [];

  if (id !== "") {
    if (findById(svg, id) === null && findById(defs, id) === null) {
      const found = await findReference(url, id);

      if (found === null) {
        throw new Error(`Could not find the symbol "${id}" to export.`);
      }

      const copy = document.importNode(found, true);

      defs.append(copy);
      nested.push(...copy.querySelectorAll("use"));
    }

    setHref(use, `#${id}`);
  }

  await copyReferences(svg, defs, [...rest, ...nested]);
};

const inlineReferences = async (svg: Element) => {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  await copyReferences(svg, defs, [...svg.querySelectorAll("use")]);

  if (defs.hasChildNodes()) {
    svg.prepend(defs);
  }
};

const toDataURL = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }

  return `data:${blob.type};base64,${btoa(binary)}`;
};

/** Embeds linked images. One that cannot be fetched fails the export, not silently vanishes. */
const inlineImages = async (svg: Element) => {
  await Promise.all(
    [...svg.querySelectorAll("image")].map(async (image) => {
      const href = getHref(image);

      if (href !== null && !href.startsWith("data:")) {
        const response = await fetchResource(href);

        setHref(image, await toDataURL(await response.blob()));
      }
    }),
  );
};

/** The SVG as standalone markup, `size` pixels wide and tall by its view box's proportions. */
const serializeSvg = async (svg: SVGSVGElement, size: number) => {
  // SAFETY: `cloneNode` returns a node of its source's type.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the DOM types lose it.
  const copy = svg.cloneNode(true) as SVGSVGElement;
  const sources = [svg, ...svg.querySelectorAll("*")];
  const copies = [copy, ...copy.querySelectorAll("*")];

  // Set and removed in one task, so the screen never paints it.
  svg.toggleAttribute("data-exporting", true);

  try {
    for (const [index, source] of sources.entries()) {
      const target = copies[index];

      if (target !== undefined) {
        inlinePaint(source, target, index === 0);
      }
    }
  } finally {
    svg.toggleAttribute("data-exporting", false);
  }

  // The root's own visibility and fade belong to the page, not the file.
  for (const property of ["display", "opacity", "visibility", "style"]) {
    copy.removeAttribute(property);
  }

  await inlineReferences(copy);
  await inlineImages(copy);

  copy.setAttribute("width", String(size));
  copy.setAttribute("height", String(size));

  // The serializer declares the SVG namespace itself.
  return new XMLSerializer().serializeToString(copy);
};

const loadImage = async (source: string) => {
  const image = new Image();

  image.src = source;
  await image.decode();

  return image;
};

/** Draws SVG markup on a square canvas and encodes it as a PNG. */
const rasterizeSvg = async (markup: string, size: number) => {
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));

  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    if (context === null) {
      throw new Error("A 2D canvas is not available.");
    }

    context.drawImage(image, 0, 0, size, size);

    // oxlint-disable-next-line promise/avoid-new -- `toBlob` only takes a callback.
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob === null) {
          reject(new Error("Could not encode the image."));
        } else {
          resolve(blob);
        }
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
};

/** Saves a blob as a file through a temporary link. */
const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();

  // Some browsers read the URL after the click returns.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
};

export { rasterizeSvg, saveBlob, serializeSvg };
