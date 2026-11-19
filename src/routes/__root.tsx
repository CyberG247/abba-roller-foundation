import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { Toaster } from "../components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 pt-24 pb-16">
      <div className="max-w-lg text-center">
        <span className="inline-block rounded-full bg-brand-red-wash px-3.5 py-1 text-xs font-bold tracking-wider text-brand-red uppercase">
          Error 404
        </span>
        <h1 className="mt-4 font-display text-7xl font-extrabold tracking-tight text-green-deep">
          404
        </h1>
        <h2 className="mt-3 font-display text-2xl font-bold text-ink">Page not found</h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for does not exist, has been moved, or the link may be outdated.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-green-deep px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-mid"
          >
            <Home className="size-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/work"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-input bg-background px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
            <span>Explore Our Work</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 pt-24 pb-16">
      <div className="max-w-md text-center">
        <span className="inline-block rounded-full bg-brand-red-wash px-3.5 py-1 text-xs font-bold tracking-wider text-brand-red uppercase">
          Unexpected Error
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
          This page could not be loaded
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          Something unexpected occurred while rendering this view. Please try reloading or return to
          the homepage.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-green-deep px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-mid cursor-pointer"
          >
            <RefreshCw className="size-4" />
            <span>Try again</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-input bg-background px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent"
          >
            <Home className="size-4" />
            <span>Go home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0B3D2E" },
      { title: "Abba Roller Foundation" },
      {
        name: "description",
        content:
          "Abba Roller Foundation empowers youth and women in Nigeria through education, skills training, humanitarian support and advocacy.",
      },
      { name: "robots", content: "index, follow" },
      {
        name: "google-site-verification",
        content: "1DXrK_MfkjeniXR87759wO2GX9TufI5J2OpPNMTXTpI",
      },
      { name: "author", content: "Abba Roller Foundation" },
      { property: "og:site_name", content: "Abba Roller Foundation" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.abbarollerfoundation.com.ng" },
      { property: "og:image", content: "https://www.abbarollerfoundation.com.ng/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,500..800;1,9..40,500..700&family=Manrope:wght@400..800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NGO",
              "@id": "https://www.abbarollerfoundation.com.ng/#organization",
              name: "Abba Roller Foundation",
              alternateName: "ARF",
              url: "https://www.abbarollerfoundation.com.ng",
              logo: "https://www.abbarollerfoundation.com.ng/favicon.png",
              description:
                "Abba Roller Foundation empowers youth and women in Nigeria through education, skills training, humanitarian support and advocacy.",
              email: "abbarollerfoundation@gmail.com",
              areaServed: {
                "@type": "Country",
                name: "Nigeria",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://www.abbarollerfoundation.com.ng/#website",
              url: "https://www.abbarollerfoundation.com.ng",
              name: "Abba Roller Foundation",
              publisher: {
                "@id": "https://www.abbarollerfoundation.com.ng/#organization",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdminRoute && <SiteHeader />}
      <main id="main">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      {!isAdminRoute && <SiteFooter />}
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
