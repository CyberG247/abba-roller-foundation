import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Trophy, Eye, ExternalLink, Camera } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section, formatDate } from "@/components/site/blocks";
import { cn } from "@/lib/utils";
import { stories } from "@/data/site";
import { tournamentGallery } from "@/components/site/FootballTournamentSection";
import { dutseSchoolGallery } from "@/components/site/VisuallyImpairedSchoolSection";

export const Route = createFileRoute("/stories/$slug")({
  loader: ({ params }) => {
    const story = stories.find((item) => item.slug === params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Story not found — Abba Roller Foundation" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.story.title} — Abba Roller Foundation`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.story.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.story.excerpt },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: StoryDetail,
});

function StoryDetail() {
  const { story } = Route.useLoaderData();

  const isFootballStory = story.slug === "grassroots-football-championship-peace-cup";
  const isDutseStory = story.slug === "visually-impaired-school-dutse-outreach";

  return (
    <>
      <PageHeader
        eyebrow={story.category}
        title={story.title}
        lede={story.excerpt}
        crumbs={[{ label: "Stories", to: "/stories" }, { label: story.title }]}
      >
        <p className="text-sm text-on-dark-muted">
          {story.author} · <time dateTime={story.date}>{formatDate(story.date)}</time> ·{" "}
          {story.readingTime}
        </p>
      </PageHeader>

      <Section>
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <img
              src={story.image}
              alt={story.imageAlt}
              width={1200}
              height={800}
              className={cn(
                "aspect-[3/2] w-full object-cover rounded-xs shadow-md",
                story.imagePosition || "object-center",
              )}
            />
          </Reveal>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
            {story.body.map((block: string) =>
              block.startsWith("## ") ? (
                <Reveal
                  key={block}
                  as="h2"
                  className="pt-4 font-display text-2xl font-bold text-ink"
                >
                  {block.replace("## ", "")}
                </Reveal>
              ) : (
                <Reveal key={block} as="p">
                  {block}
                </Reveal>
              ),
            )}
          </div>

          {/* Dedicated Photo Showcase for Football Championship */}
          {isFootballStory && (
            <div className="mt-14 border-t border-hairline pt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                    <Trophy className="size-3.5" />
                    <span>Tournament Photo Gallery</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    Matchday Moments &amp; Ceremony Records
                  </h3>
                </div>
                <Link
                  to="/#football-tournament"
                  className="text-xs font-bold text-brand-red hover:underline inline-flex items-center gap-1"
                >
                  <span>Interactive Section</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tournamentGallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-xs border border-hairline bg-surface shadow-2xs group"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <span className="text-[11px] font-bold text-amber-600 block mb-1">
                        {photo.category}
                      </span>
                      <p className="text-xs font-bold text-ink line-clamp-1">{photo.title}</p>
                      <p className="text-[11px] text-ink-soft mt-1 line-clamp-2">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Photo Showcase for Visually Impaired School Outreach */}
          {isDutseStory && (
            <div className="mt-14 border-t border-hairline pt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-deep mb-1">
                    <Eye className="size-3.5" />
                    <span>Outreach Documentation</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    Field Photography from Dutse School
                  </h3>
                </div>
                <Link
                  to="/#dutse-outreach"
                  className="text-xs font-bold text-green-deep hover:underline inline-flex items-center gap-1"
                >
                  <span>Interactive Section</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dutseSchoolGallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-xs border border-hairline bg-surface shadow-2xs group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 flex items-center justify-center">
                      <img
                        src={photo.src}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 size-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
                      />
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <span className="text-[11px] font-bold text-green-deep block mb-1">
                        {photo.category}
                      </span>
                      <p className="text-xs font-bold text-ink line-clamp-1">{photo.title}</p>
                      <p className="text-[11px] text-ink-soft mt-1 line-clamp-2">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </Section>

      <DonateBand />
    </>
  );
}
