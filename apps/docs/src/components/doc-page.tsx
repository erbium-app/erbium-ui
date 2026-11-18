import { TableOfContents } from "./table-of-contents";
import { Button } from "@erbium/ui/components/button";
import { buttonVariants } from "@erbium/ui/lib/button-variants";
import { Link } from "@erbium/ui/components/link";
import { Icon } from "@erbium/ui/components/icon";
import { Separator } from "@erbium/ui/components/separator";
import { CopyPageButton, Prose } from "./markdown";
import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Showcase } from "./showcase";
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
    <article id="main-content" tabIndex={-1} className="docs-page outline-none">
      <div className="docs-page-body">
        <div className="docs-page-inner">
          <div className="grow *:last:mb-0">
            <header className="mb-4">
              <div className="flex items-center justify-between gap-group">
                <h1 className="text-display text-foreground min-w-0 wrap-anywhere">{page.title}</h1>
                <div className="flex shrink-0 gap-(--docs-tight-gap)">
                  {previousPage !== undefined && (
                    <Button
                      to={previousPage.href}
                      size="icon-sm"
                      variant="outline"
                      aria-label={`Previous: ${previousPage.title}`}
                      title={previousPage.title}
                    >
                      <Icon name="arrow-left-01" className="rtl:rotate-180" />
                    </Button>
                  )}
                  {nextPage !== undefined && (
                    <Button
                      to={nextPage.href}
                      size="icon-sm"
                      variant="outline"
                      aria-label={`Next: ${nextPage.title}`}
                      title={nextPage.title}
                    >
                      <Icon name="arrow-right-01" className="rtl:rotate-180" />
                    </Button>
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
                key={`${lead.name}-${lead.slug}`}
                path={page.path}
                variant={lead}
                sources={page.exampleSources}
                separator={false}
              />
            )}
            <Prose tree={page.tree} />
            {page.variants
              .filter((variant) => variant !== lead)
              .map((variant) => (
                <Showcase
                  key={`${variant.name}-${variant.slug}`}
                  path={page.path}
                  variant={variant}
                  sources={page.exampleSources}
                />
              ))}
            {page.colorSources.map((item) => (
              <section key={item.title} id={item.id}>
                <h2 className="text-title">{item.title}</h2>
                <CodeBlock
                  wrap
                  code={item.source}
                  language="css"
                  title={`${item.id}.css`}
                  className="my-4"
                />
                {item.colors.length > 0 && (
                  <div className="@container my-6">
                    <ul
                      aria-label={`${item.title} swatches`}
                      className="grid gap-x-6 gap-y-2 @min-[44rem]:grid-cols-2"
                    >
                      {item.colors.map((color) => (
                        <li
                          key={color}
                          className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"
                        >
                          <span
                            className="image-hairline size-8 rounded-md"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                          />
                          <code className="text-metadata wrap-anywhere">
                            <bdi dir="ltr">{color}</bdi>
                          </code>
                          <CopyButton
                            aria-label={`Copy ${color}`}
                            size="icon-xs"
                            value={color}
                            variant="embedded"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
          </div>
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
        </div>
        <TableOfContents key={page.path} headings={headings} />
      </div>
    </article>
  );
};
