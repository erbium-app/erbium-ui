import { repositoryUrl, site, siteName } from "@/config/site";

export const structuredData = (
  route: string,
  title: string,
  description: string,
  image: string,
) => {
  const url = new URL(route, site).href;
  const websiteId = `${site}/#website`;
  const softwareId = `${site}/#software`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${site}/`,
      name: siteName,
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": softwareId },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": softwareId,
      name: siteName,
      codeRepository: repositoryUrl,
      programmingLanguage: "TypeScript",
      runtimePlatform: "React",
      license: "https://opensource.org/license/mit",
      url: `${site}/`,
    },
  ];
  if (route !== "/") {
    const breadcrumbId = `${url}#breadcrumb`;
    graph[1].breadcrumb = { "@id": breadcrumbId };
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteName, item: `${site}/` },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    });
  }
  // Prevent content from closing the inline script element.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll(
    "<",
    "\\u003c",
  );
};
