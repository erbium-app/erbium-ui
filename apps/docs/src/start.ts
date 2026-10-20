import { createCsrfMiddleware, createStart } from "@tanstack/react-start";

// Server functions are same-origin RPC endpoints. Defining a custom Start
// instance disables Start's automatic CSRF middleware, so install it here.
const csrf = createCsrfMiddleware({
  filter: (context) => context.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrf],
}));
