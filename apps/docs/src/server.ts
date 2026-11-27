import { createServerEntry } from "@tanstack/react-start/server-entry";
import * as HttpRouter from "effect/http/HttpRouter";
import * as Layer from "effect/Layer";
import { pages } from "./http/pages";
import { siteApi } from "./http/site";

// Effect routes the request, and TanStack Start is the fallback route.
const { handler } = HttpRouter.toWebHandler(Layer.mergeAll(siteApi, pages), {
  disableLogger: true,
});

export default createServerEntry({
  fetch: async (request) => await handler(request),
});
