import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  ScriptOnce,
  Link,
} from "@tanstack/react-router";
import { IconSprite } from "@erbium/ui/components/icon-sprite";
import { Shell } from "@/components/shell";
import stylesheet from "@/styles.css?url";

// Alchemy supplies the token only to deploy builds; dev and local builds omit the beacon.
const analyticsToken = import.meta.env.PROD
  ? import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN
  : undefined;

const Root = () => (
  <html className="antialiased" lang="en" suppressHydrationWarning>
    <head>
      <HeadContent />
    </head>
    <body className="font-sans">
      <IconSprite />
      <ScriptOnce>{`try { const theme = localStorage.getItem('erbium-theme'); document.documentElement.classList.toggle('dark', theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)); } catch {}`}</ScriptOnce>
      <Shell>
        <Outlet />
      </Shell>
      <Scripts />
      {analyticsToken === undefined || analyticsToken === "" ? null : (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: analyticsToken })}
        />
      )}
    </body>
  </html>
);

export const Route = createRootRoute({
  component: Root,
  head: () => ({
    links: [
      { href: stylesheet, rel: "stylesheet" },
      { href: "/favicon.svg", rel: "icon" },
    ],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Erbium UI" },
    ],
  }),
  notFoundComponent: () => (
    <main id="main-content" className="docs-page surface-panel rounded-xl">
      <h1 className="text-display">Page not found</h1>
      <Link to="/">Return to documentation</Link>
    </main>
  ),
});
