import documents from "virtual:docs-pages";

// Vite splits each compiled document into its own asset. Router owns preloading
// and caching; both SSR and client navigation use this same loader.
export const getDocPage = async (path: string) => {
  const load = Object.hasOwn(documents, path) ? documents[path] : undefined;

  if (!load) {
    return null;
  }

  const module = await load();

  return module.default;
};
