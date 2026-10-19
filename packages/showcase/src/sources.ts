const sources = import.meta.glob<string>("./**/*.{tsx,ts}", {
  eager: true,
  import: "default",
  query: "?raw",
});

export function showcaseSource(path: string) {
  const source = sources[`./${path.replace(/^src\//, "")}`];

  if (!source) {
    throw new Error(`Missing showcase source: ${path}`);
  }

  return source;
}
