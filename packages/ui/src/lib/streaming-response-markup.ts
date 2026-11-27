import { iconDefinitions } from "@erbium/icons";
import type { IconName } from "@erbium/icons";
import type { MarkdownProps } from "@pierre/words/react";
import { codeBlockActionsClassName } from "../blocks/code-block";
import {
  codePanelFocusRing,
  codePanelHeader,
  codePanelSurface,
  codePanelTitle,
} from "../blocks/code-panel";
import {
  alertClassName,
  alertDescriptionClassName,
  alertTitleClassName,
  alertVariants,
} from "../components/alert";
import type { AlertVariant } from "../components/alert";
import { iconClassName } from "../components/icon";
import { markerVariants } from "../components/marker";
import { separatorVariants } from "../components/separator";
import {
  checkboxCheckClassName,
  checkboxStateIconClassName,
  statefulIconClassName,
  statefulIconItemClassName,
  statefulIconStateClassNames,
} from "../components/stateful-icon";
import { buttonVariants } from "./button-variants";
import { checkboxClassName, checkboxIndicatorClassName } from "./choice-styles";
import { codeLanguageIcon } from "./code-language-icon";
import { kbdClassName } from "./kbd-styles";
import { tableStyles } from "./table-styles";
import { cn } from "./utils";

/*
 * Pierre renders a response as HTML, so React components cannot render inside it. These element
 * hooks give its elements the markup and classes of Erbium's components instead, taken from the
 * components themselves, so a design change reaches responses too.
 */

type ResponseElementHooks = NonNullable<MarkdownProps["components"]>;

type CopyStatus = "idle" | "copied" | "error";

// Pierre finds elements with `[^>]*>`, so `>` is escaped too, as in `[&>svg]:size-4`.
const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/** Attributes as HTML, each with a leading space. */
const attributes = (values: Record<string, string>) =>
  Object.entries(values)
    .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
    .join("");

/** Adds attributes to the element that `html` opens with. */
const decorate = (html: string, values: Record<string, string>) =>
  html.replace(/^<[a-z][a-z0-9]*/u, (open) => `${open}${attributes(values)}`);

const icon = (spriteHref: string, name: IconName, className?: string) => {
  const { id, viewBox } = iconDefinitions[name];
  const href = `${spriteHref}#${id}`;

  return `<svg${attributes({
    viewBox,
    "aria-hidden": "true",
    class: cn(iconClassName, className),
    "data-slot": "icon",
    focusable: "false",
    height: "16",
    width: "16",
  })}><use${attributes({ href })}></use></svg>`;
};

const copyIcons: [CopyStatus, IconName][] = [
  ["idle", "copy"],
  ["copied", "check"],
  ["error", "cancel-01"],
];

const copyIconClassName = (active: boolean) =>
  cn(statefulIconItemClassName, statefulIconStateClassNames[active ? "active" : "inactive"]);

/** `CodeBlockCopyButton`, which the response's click handler operates. */
const copyButton = (spriteHref: string) => {
  const icons = copyIcons
    .map(
      ([status, name]) =>
        `<span${attributes({
          class: copyIconClassName(status === "idle"),
          "data-state": status,
        })}>${icon(spriteHref, name, "size-control-icon-sm")}</span>`,
    )
    .join("");

  return `<button${attributes({
    "aria-label": "Copy code",
    class: buttonVariants({ size: "icon-xs", variant: "ghost" }),
    "data-response-copy": "",
    "data-slot": "button",
    type: "button",
  })}><span${attributes({
    "aria-hidden": "true",
    class: statefulIconClassName,
    "data-slot": "stateful-icon",
  })}>${icons}</span></button>`;
};

/** The buttons that `copyButton` made inside `content`, in document order. */
const responseCopyButtons = (content: Element) => [
  ...content.querySelectorAll("[data-response-copy]"),
];

/** Shows the outcome of a copy on a button that `copyButton` made. */
const showCopyStatus = (button: Element | undefined, status: CopyStatus) => {
  for (const item of button?.querySelectorAll<HTMLElement>("[data-state]") ?? []) {
    item.className = copyIconClassName(item.dataset.state === status);
  }
};

// `title="…"`, `filename='…'` or `title=name`, as Pierre escapes it in `data-meta`.
const titlePattern =
  /(?:^|\s|;)(?:title|filename)=(?:&quot;(?<double>.*?)&quot;|(?:'|&#39;)(?<single>.*?)(?:'|&#39;)|(?<bare>(?:(?!&quot;)[^\s'"])+))/u;

const codeTitle = (openTag: string) => {
  const meta = /\sdata-meta="(?<meta>[^"]*)"/u.exec(openTag)?.groups?.meta ?? "";
  const groups = titlePattern.exec(meta)?.groups;

  // Still escaped, so it is safe to place in the markup.
  return groups?.double ?? groups?.single ?? groups?.bare ?? "";
};

/** `CodeBlock`: a header only when the fence has a title, and a copy action over the source. */
const codeBlock = (html: string, spriteHref: string) => {
  const openTag = html.slice(0, html.indexOf(">") + 1);
  const language = /\sdata-language="(?<language>[^"]*)"/u.exec(openTag)?.groups?.language;
  const title = codeTitle(openTag);

  const header =
    title === ""
      ? ""
      : `<div${attributes({
          class: cn(codePanelHeader, "flex-nowrap pe-12"),
          "data-slot": "code-block-header",
        })}><span${attributes({
          class: cn(codePanelTitle, "truncate"),
          "data-slot": "code-block-title",
        })}>${icon(spriteHref, codeLanguageIcon(language), "size-4.5")}<span class="truncate">${title}</span></span></div><div${attributes(
          {
            class: separatorVariants({ labeled: false }),
            "data-horizontal": "",
            "data-orientation": "horizontal",
            "data-separator": "",
            "data-slot": "separator",
            "data-variant": "full",
            role: "separator",
          },
        )}></div>`;

  const actions = `<div${attributes({
    class: codeBlockActionsClassName,
    "data-slot": "code-block-actions",
  })}>${copyButton(spriteHref)}</div>`;

  return decorate(html, {
    class: cn("not-typeset group/code-block relative", codePanelSurface),
    "data-slot": "code-block",
    "data-surface": "code",
    dir: "ltr",
  })
    .replace(/<div data-markdown="code-header">.*?<\/div>/su, () => `${header}${actions}`)
    .replace(
      "<pre",
      () =>
        `<pre${attributes({
          class: cn(
            "m-0 overflow-x-auto p-panel pe-12 text-code-block [tab-size:2]",
            codePanelFocusRing,
          ),
          "data-slot": "code-block-content",
          tabindex: "0",
        })}`,
    );
};

/** An island's placeholder, as a `Marker` for a running step. */
const islandPending = (html: string) =>
  html.startsWith('<div data-markdown="island-pending" role="status">')
    ? decorate(html, { class: markerVariants(), "data-slot": "marker" })
        .replace(">", '><span class="shimmer" data-slot="marker-content">')
        .replace(/<\/div>$/u, "</span></div>")
    : html;

const calloutVariants = new Map<string, AlertVariant>([
  ["caution", "error"],
  ["important", "info"],
  ["note", "info"],
  ["tip", "success"],
  ["warning", "warning"],
]);

const calloutPattern =
  /^<blockquote[^>]*>\s*<p[^>]*>\[!(?<kind>caution|important|note|tip|warning)\][^\S\n]*(?:<br[^>]*>)?(?:\n|(?=<\/p>))/iu;

/** A GitHub callout, such as `> [!WARNING]`, as an `Alert`. */
const callout = (html: string, spriteHref: string) => {
  const match = calloutPattern.exec(html);
  const kind = match?.groups?.kind?.toLowerCase();

  if (match === null || kind === undefined) {
    return html;
  }

  const body = `<p>${html.slice(match[0].length)}`
    .replace(/<\/blockquote>\s*$/u, "")
    .replace(/^<p><\/p>\s*/u, "");

  const variant = alertVariants[calloutVariants.get(kind) ?? "default"];
  const title = `${kind.charAt(0).toUpperCase()}${kind.slice(1)}`;

  return `<div${attributes({
    class: cn(alertClassName, variant.className),
    "data-slot": "alert",
    role: "note",
  })}>${icon(spriteHref, variant.icon, variant.iconClassName)}<div${attributes({
    class: alertTitleClassName,
    "data-slot": "alert-title",
  })}>${title}</div><div${attributes({
    class: alertDescriptionClassName,
    "data-slot": "alert-description",
  })}>${body}</div></div>`;
};

const tablePart = (slot: string, className: string) =>
  attributes({ class: className, "data-slot": slot });

const tableParts = new Map([
  ["table", tablePart("table", tableStyles.table)],
  ["tbody", tablePart("table-body", tableStyles.tableBody)],
  // Model tables often hold sentences, so cells wrap.
  ["td", tablePart("table-cell", cn(tableStyles.tableCell, "whitespace-normal"))],
  ["tfoot", tablePart("table-footer", tableStyles.tableFooter)],
  ["th", tablePart("table-head", cn(tableStyles.tableHead, "whitespace-normal"))],
  ["thead", tablePart("table-header", tableStyles.tableHeader)],
  ["tr", tablePart("table-row", tableStyles.tableRow)],
]);

/** `Table`, in its own scrolling region. */
const table = (html: string) => {
  const parts = html.replaceAll(
    /<(?<tag>table|tbody|td|tfoot|th|thead|tr)(?=[\s>])/gu,
    (open, tag: string) => `${open}${tableParts.get(tag) ?? ""}`,
  );

  return `<div${attributes({
    "aria-label": "Table",
    class: cn("not-typeset relative w-full overflow-x-auto", codePanelFocusRing),
    "data-slot": "table-container",
    role: "region",
    tabindex: "0",
  })}>${parts}</div>`;
};

/** A read-only `Checkbox` for a task list item. */
const taskCheckbox = (html: string, spriteHref: string) => {
  if (!/\stype="checkbox"/u.test(html)) {
    return html;
  }

  const checked = /\schecked(?:=|\s|>)/u.test(html);
  const state: Record<string, string> = checked ? { "data-checked": "" } : { "data-unchecked": "" };

  const check = checked
    ? `<span${attributes({ "aria-hidden": "true", class: checkboxStateIconClassName })}>${icon(
        spriteHref,
        "check",
        checkboxCheckClassName,
      )}</span>`
    : "";

  return `<span${attributes({
    ...state,
    "aria-checked": String(checked),
    "aria-label": "Task",
    "aria-readonly": "true",
    class: cn(checkboxClassName, "me-2 inline-flex align-text-bottom"),
    "data-choice": "",
    "data-readonly": "",
    "data-slot": "checkbox",
    role: "checkbox",
  })}><span${attributes({
    ...state,
    class: checkboxIndicatorClassName,
    "data-slot": "checkbox-indicator",
  })}>${check}</span></span>`;
};

/** Element hooks for icons drawn from `spriteHref`. */
const createResponseElementHooks = (spriteHref: string): ResponseElementHooks => ({
  // A link to another site opens a new tab, so the conversation stays open.
  a: (html) =>
    /^<a\s[^>]*href="(?:https?:)?\/\//iu.test(html)
      ? decorate(html, { rel: "noopener noreferrer", target: "_blank" })
      : html,
  blockquote: (html) => callout(html, spriteHref),
  div: (html) => {
    if (html.startsWith('<div data-markdown="code-block"')) {
      return codeBlock(html, spriteHref);
    }

    return islandPending(html);
  },
  hr: (html) =>
    decorate(html, {
      class: cn(separatorVariants({ labeled: false }), "not-typeset border-0"),
      "data-horizontal": "",
      "data-orientation": "horizontal",
      "data-separator": "",
      "data-slot": "separator",
    }),
  input: (html) => taskCheckbox(html, spriteHref),
  kbd: (html) => decorate(html, { class: cn(kbdClassName, "not-typeset"), "data-slot": "kbd" }),
  table,
});

export { createResponseElementHooks, responseCopyButtons, showCopyStatus };

export type { CopyStatus, ResponseElementHooks };
