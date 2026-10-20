import type { ReactNode } from "react";

export interface ShowcaseStory {
  name?: string;
  args?: Record<string, unknown>;
  argTypes?: Record<
    string,
    {
      control?: string | { type: string; min?: number; max?: number; step?: number } | false;
      options?: unknown[];
      description?: string;
    }
  >;
  parameters?: {
    layout?: string;
    docs?: { description?: { story?: string }; source?: { code?: string } };
  };
  render: (args: Record<string, unknown>) => ReactNode;
}

export interface ShowcaseCatalog {
  default: { parameters?: { layout?: string } };
  [name: string]: unknown;
}

const catalogs = import.meta.glob<ShowcaseCatalog>("./*/catalog.tsx");

export const loadShowcase = async (name: string) => {
  const load = catalogs[`./${name}/catalog.tsx`];

  if (!load) {
    throw new Error(`Missing showcase: ${name}`);
  }

  return await load();
};
