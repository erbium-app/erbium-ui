import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  ScriptOnce,
  Link,
} from "@tanstack/react-router";
import spriteUrl from "@erbium/icons/sprite.svg?url";
import { IconSpriteProvider } from "@erbium/ui/components/icon";
import { SkeletonProvider } from "@erbium/ui/components/skeleton";
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
      <ScriptOnce>{`try { const theme = localStorage.getItem('erbium-theme'); document.documentElement.classList.toggle('dark', theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)); } catch {}`}</ScriptOnce>
      <IconSpriteProvider href={spriteUrl}>
        <SkeletonProvider>
          <Shell>
            <Outlet />
          </Shell>
        </SkeletonProvider>
      </IconSpriteProvider>
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
    <article id="main-content" tabIndex={-1} className="docs-page outline-none">
      <h1 className="text-display">Page not found</h1>
      <Link to="/">Return to documentation</Link>
    </article>
  ),
});
