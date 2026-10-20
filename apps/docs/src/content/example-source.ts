export interface ExampleSourceFile {
  path: string;
  source: string;
}

const isExampleSourceFile = (value: unknown): value is ExampleSourceFile =>
  typeof value === "object" &&
  value !== null &&
  "path" in value &&
  typeof value.path === "string" &&
  "source" in value &&
  typeof value.source === "string";

const isExampleSourceFileList = (value: unknown): value is ExampleSourceFile[] =>
  Array.isArray(value) && value.every(isExampleSourceFile);

export const fetchExampleSource = async ({
  name,
  slug,
}: {
  name: string;
  slug: string;
}): Promise<ExampleSourceFile[]> => {
  const response = await fetch(
    `/examples/${encodeURIComponent(name)}-${encodeURIComponent(slug)}.json`,
  );

  if (!response.ok) {
    throw new Error("Example source unavailable");
  }

  const data: unknown = await response.json();

  if (!isExampleSourceFileList(data)) {
    throw new Error("Example source unavailable");
  }

  return data;
};
