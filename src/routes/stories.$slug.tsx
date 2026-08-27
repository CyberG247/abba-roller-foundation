import { createFileRoute, notFound } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section, formatDate } from "@/components/site/blocks";
import { cn } from "@/lib/utils";
import { stories } from "@/data/site";

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
                "aspect-[3/2] w-full object-cover",
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
        </article>
      </Section>

      <DonateBand />
    </>
  );
}
