import documents from "virtual:docs-pages";

export const getPage = (path: string) => (Object.hasOwn(documents, path) ? documents[path] : null);
