import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import { documentationSections, kindPaths } from "@erbium/content/taxonomy";

export const changelogDirectory = new URL("../../packages/content/changelog/", import.meta.url);

const directory = changelogDirectory;
const semver = /^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/iu;
const isoDate = /^\d{4}-\d{2}-\d{2}$/u;
const componentLink = /\]\((?<href>\/docs\/[a-z-]+\/[a-z\d-]+)(?:#[^)]*)?\)/gu;

const componentRoutes = new Set(
  documentationSections.flatMap(({ kind, names }) =>
    names.map((name) => `/docs/${kindPaths[kind]}/${name}`),
  ),
);

export const readChangelog = () => {
  const files = readdirSync(directory).filter((file) => file.endsWith(".md"));

  const releases = files
    .map((file) => {
      const { content, data } = matter(readFileSync(new URL(file, directory), "utf-8"));
      const version = String(data.version ?? "");
      const date = String(data.date ?? "");
      const publishedAt = Date.parse(date);

      if (
        !semver.test(version) ||
        file !== `${version}.md` ||
        !isoDate.test(date) ||
        !Number.isFinite(publishedAt) ||
        new Date(publishedAt).toISOString().slice(0, 10) !== date
      ) {
        throw new Error(
          `Invalid changelog entry ${file}. Use a version filename and a quoted YYYY-MM-DD date.`,
        );
      }

      return { content: content.trim(), date, publishedAt, version };
    })
    .toSorted(
      (left, right) =>
        right.publishedAt - left.publishedAt ||
        right.version.localeCompare(left.version, "en", { numeric: true }),
    );

  const changed: Record<string, number[]> = {};

  for (const release of releases) {
    for (const match of release.content.matchAll(componentLink)) {
      const href = match.groups?.href;

      if (href !== undefined && componentRoutes.has(href)) {
        const days = changed[href] ?? [];

        if (!days.includes(release.publishedAt)) {
          changed[href] = [...days, release.publishedAt];
        }
      }
    }
  }

  const notes = releases.map(
    ({ version, date, content }) => `## v${version} · ${date}\n\n${content}`,
  );

  const markdown = notes.join("\n\n");

  return {
    changed,
    // Files only: a watched directory enters the module graph as an import it cannot resolve.
    files: files.map((file) => new URL(file, directory)),
    markdown,
    version: releases[0]?.version ?? null,
  };
};
