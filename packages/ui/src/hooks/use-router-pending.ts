import { useRouterState } from "@tanstack/react-router";

/**
 * True while TanStack Router resolves a navigation: matching, `beforeLoad`,
 * loaders and lazy route chunks. Preloads do not count. Pass it to a loading
 * indicator such as `LogoLoader`'s `loading` prop.
 */
const useRouterPending = () => useRouterState({ select: (state) => state.status === "pending" });

export { useRouterPending };
