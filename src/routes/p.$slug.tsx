import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileWarning, Home } from "lucide-react";

import { CmsBlockRenderer } from "@/components/admin/CmsBlockRenderer";
import { Button } from "@/components/ui/button";
import { getPublishedPageBySlug, type CmsPage } from "@/data/admin/cmsStore";

export const Route = createFileRoute("/p/$slug")({
  head: () => ({
    meta: [
      { title: "Initiative Portal — Abba Roller Foundation" },
      {
        name: "description",
        content:
          "Dynamic programme and community information page managed through the Abba Roller Foundation Headless CMS.",
      },
    ],
  }),
  component: DynamicCmsPage,
});

function DynamicCmsPage() {
  const { slug } = Route.useParams();
  const [page, setPage] = useState<CmsPage | null>(() => getPublishedPageBySlug(slug));

  useEffect(() => {
    const sync = () => {
      const next = getPublishedPageBySlug(slug);
      setPage(next);
      if (next && typeof document !== "undefined") {
        document.title = `${next.title} — Abba Roller Foundation`;
      }
    };
    sync();
    window.addEventListener("arf_cms_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("arf_cms_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  if (!page) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 pt-28 pb-16">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface text-muted-foreground">
            <FileWarning className="size-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">
            Initiative page not published
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The CMS page <span className="font-mono font-semibold">/p/{slug}</span> is currently a
            draft or does not exist in this browser&apos;s CMS store.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="min-h-11 gap-2">
              <Link to="/">
                <Home className="size-4" />
                <span>Return Home</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-11 gap-2">
              <Link to="/admin">
                <ArrowLeft className="size-4" />
                <span>Open CMS Builder</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <CmsBlockRenderer blocks={page.blocks} />;
}
