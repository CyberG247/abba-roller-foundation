import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { campaigns } from "@/data/site";

const title = "Campaigns — Abba Roller Foundation";
const description =
  "Active and completed campaigns, including Pad Up Nigerian Girls, our menstrual health and girl-child empowerment initiative.";

export const Route = createFileRoute("/campaigns/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Campaigns,
});

function Campaigns() {
  return (
    <>
      <PageHeader
        eyebrow="Campaigns"
        title="Focused initiatives, documented openly"
        lede="Each campaign has a defined community, a defined objective and published documentation as outcomes are confirmed."
        crumbs={[{ label: "Campaigns" }]}
      />

      <Section>
        <div className="grid gap-14">
          {campaigns.map((campaign, index) => (
            <Reveal
              key={campaign.slug}
              delay={index * 80}
              as="article"
              className="grid gap-8 lg:grid-cols-2 lg:items-center"
            >
              <Link
                to="/campaigns/$slug"
                params={{ slug: campaign.slug }}
                className="block overflow-hidden bg-muted"
              >
                <img
                  src={campaign.image}
                  alt={campaign.imageAlt}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="aspect-[3/2] w-full object-cover"
                />
              </Link>
              <div>
                <p className="eyebrow text-green-mid">{campaign.kicker}</p>
                <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                  <Link to="/campaigns/$slug" params={{ slug: campaign.slug }}>
                    {campaign.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {campaign.summary}
                </p>
                <p className="mt-4 text-xs font-semibold tracking-[0.1em] text-brand-red uppercase">
                  {campaign.status} · {campaign.location}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
