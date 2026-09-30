import * as React from "react";

type Section = {
  name: string;
  type: React.ElementType;
};

export function assertOverlaySections(
  children: React.ReactNode,
  panelName: string,
  header: Section,
  content: Section,
  footer: Section,
) {
  const sections = React.Children.toArray(children);
  const indexes = new Map<React.ElementType, number>();

  for (const [index, child] of sections.entries()) {
    if (
      !React.isValidElement(child) ||
      (child.type !== header.type && child.type !== content.type && child.type !== footer.type)
    ) {
      throw new Error(
        `${panelName} accepts only direct <${header.name}>, <${content.name}>, and <${footer.name}> children.`,
      );
    }
    if (indexes.has(child.type)) {
      const name = [header, content, footer].find((section) => section.type === child.type)?.name;
      throw new Error(`${panelName} accepts only one <${name}>.`);
    }
    indexes.set(child.type, index);
  }

  const contentIndex = indexes.get(content.type);
  if (contentIndex === undefined) {
    throw new Error(`${panelName} requires a direct <${content.name}> child.`);
  }
  const headerIndex = indexes.get(header.type);
  const footerIndex = indexes.get(footer.type);
  if (headerIndex !== undefined && headerIndex > contentIndex) {
    throw new Error(`<${header.name}> must come before <${content.name}>.`);
  }
  if (footerIndex !== undefined && footerIndex < contentIndex) {
    throw new Error(`<${footer.name}> must come after <${content.name}>.`);
  }
}
