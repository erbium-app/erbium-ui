/// <reference types="vite/client" />
export const componentDocuments = import.meta.glob("../components/*/index.md", { eager: true });
export const variantDocuments = import.meta.glob("../components/*/*.md", { eager: true });
