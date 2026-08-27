import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { DonateBand, Section, StoryCard } from "@/components/site/blocks";
import { stories } from "@/data/site";

const title = "Stories & Updates — Abba Roller Foundation";
const description =
  "Campaign updates, community stories and announcements from the work of Abba Roller Foundation.";

export const Route = createFileRoute("/stories/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Stories,
});

function Stories() {
  return (
    <>
      <PageHeader
        eyebrow="Stories & updates"
        title="From the communities we serve"
        lede="Field reports, reflections from our programmes team, and announcements as they are confirmed."
        crumbs={[{ label: "Stories" }]}
      />

      <Section>
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <StoryCard key={story.slug} story={story} index={index} />
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
