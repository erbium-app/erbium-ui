import { TableOfContents } from "./table-of-contents";
import { buttonVariants } from "@erbium/ui/lib/button-variants";
import { Icon } from "@erbium/ui/components/icon";
import { Separator } from "@erbium/ui/components/separator";
import { Link } from "@tanstack/react-router";
import { CopyPageButton, Prose } from "./markdown";
import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Showcase, ShowcaseToaster } from "./showcase";
import type { DocPage } from "@/content/types";
import { pages } from "@/content/catalog";

export const DocPageView = ({ page }: { page: DocPage }) => {
  const leadHeading =
    page.variants.find((variant) => variant.exportName === "Overview") ?? page.variants.at(0);

  const headings = [
    ...(leadHeading === undefined ? [] : [{ id: leadHeading.anchor, title: leadHeading.title }]),
    ...page.headings,
    ...page.colorSources.map((item) => ({ id: item.id, title: item.title })),
    ...page.variants
      .filter((variant) => variant !== leadHeading)
      .map((variant) => ({ id: variant.anchor, title: variant.title })),
  ];

  const neighbors = page.name ? pages.filter((item) => item.section === page.section) : pages;
  const index = neighbors.findIndex((item) => item.href === page.path);

  const previousPage = index > 0 ? neighbors.at(index - 1) : undefined;
  const nextPage = index === -1 ? undefined : neighbors.at(index + 1);
  const lead = leadHeading;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="docs-page surface-panel border border-transparent rounded-xl outline-none"
    >
      <div className="docs-page-body">
        <div className="docs-page-inner">
          <header className="mb-4">
            <div className="flex items-center justify-between gap-group">
              <h1 className="text-display text-foreground min-w-0 wrap-anywhere">{page.title}</h1>
              <div className="flex shrink-0 gap-(--docs-tight-gap)">
                {previousPage !== undefined && (
                  <Link
                    to={previousPage.href}
                    className={buttonVariants({ size: "icon-sm", variant: "outline" })}
                    aria-label={`Previous: ${previousPage.title}`}
                    title={previousPage.title}
                  >
                    <Icon name="arrow-left-01" className="rtl:rotate-180" />
                  </Link>
                )}
                {nextPage !== undefined && (
                  <Link
                    to={nextPage.href}
                    className={buttonVariants({ size: "icon-sm", variant: "outline" })}
                    aria-label={`Next: ${nextPage.title}`}
                    title={nextPage.title}
                  >
                    <Icon name="arrow-right-01" className="rtl:rotate-180" />
                  </Link>
                )}
              </div>
            </div>
            <p className="max-w-2xl mt-(--docs-description-gap) text-body text-muted-foreground">
              {page.description}
            </p>
            <div className="flex flex-wrap gap-related mt-(--docs-page-action-gap)">
              {page.sourceUrl !== undefined && page.sourceUrl !== "" && (
                <a
                  href={page.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "xs", variant: "outline" })}
                >
                  View source <Icon name="arrow-up-right-01" />
                </a>
              )}
              <CopyPageButton key={page.path} path={page.path} />
            </div>
            <Separator className="mt-6" variant="full" role="presentation" />
          </header>
          {lead !== undefined && (
            <Showcase
              key={`${page.name}-${lead.slug}`}
              name={page.name}
              variant={lead}
              separator={false}
            />
          )}
          <Prose tree={page.tree} />
          {page.variants
            .filter((variant) => variant !== lead)
            .map((variant) => (
              <Showcase key={`${page.name}-${variant.slug}`} name={page.name} variant={variant} />
            ))}
          {page.colorSources.map((item) => (
            <section key={item.title} id={item.id}>
              <h2 className="text-title">{item.title}</h2>
              <CodeBlock
                code={item.source}
                language="css"
                title={`${item.id}.css`}
                className="my-4"
              />
              <div className="grid gap-3 sm:grid-cols-2 my-6">
                {item.colors.map((color) => (
                  <div key={color} className="flex items-center gap-3">
                    <span
                      className="size-8 rounded-md border border-border"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    <code className="text-metadata min-w-0 break-all">{color}</code>
                    <CopyButton value={color} size="icon-xs" aria-label={`Copy ${color}`} />
                  </div>
                ))}
              </div>
            </section>
          ))}
          {page.reference && (
            <section className="mt-8">
              <h2 id="component-reference-title" className="text-title font-semibold">
                {page.reference.title}
              </h2>
              <p className="text-body mt-3">{page.reference.description}</p>
              <div className="docs-toolbar">
                {page.reference.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption"
                  >
                    {link.title} ↗
                  </a>
                ))}
              </div>
            </section>
          )}
          <nav
            aria-label="Adjacent documentation pages"
            className="grid grid-cols-2 gap-group mt-12 carve-top pt-6"
          >
            {previousPage === undefined ? (
              <span />
            ) : (
              <Link
                to={previousPage.href}
                className={`${buttonVariants({ variant: "outline" })} h-auto min-w-0 items-start py-(--docs-pagination-block) px-4 whitespace-normal flex-col gap-1 text-control`}
              >
                <span className="flex items-center gap-related text-muted-foreground text-metadata">
                  <Icon name="arrow-left-01" className="rtl:rotate-180" />
                  Previous
                </span>
                <strong>{previousPage.title}</strong>
              </Link>
            )}
            {nextPage !== undefined && (
              <Link
                to={nextPage.href}
                className={`${buttonVariants({ variant: "outline" })} h-auto min-w-0 items-end py-(--docs-pagination-block) px-4 whitespace-normal flex-col gap-1 text-end text-control`}
              >
                <span className="flex items-center gap-related text-muted-foreground text-metadata">
                  Next
                  <Icon name="arrow-right-01" className="rtl:rotate-180" />
                </span>
                <strong>{nextPage.title}</strong>
              </Link>
            )}
          </nav>
          {page.name === "toast" && <ShowcaseToaster />}
        </div>
        <TableOfContents key={page.path} headings={headings} />
      </div>
    </main>
  );
};
