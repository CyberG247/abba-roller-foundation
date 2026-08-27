import { createFileRoute, notFound } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { campaigns } from "@/data/site";

export const Route = createFileRoute("/campaigns/$slug")({
  loader: ({ params }) => {
    const campaign = campaigns.find((item) => item.slug === params.slug);
    if (!campaign) throw notFound();
    return { campaign };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Campaign not found — Abba Roller Foundation" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.campaign.title} — Abba Roller Foundation`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.campaign.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.campaign.summary },
      ],
    };
  },
  component: CampaignDetail,
});

function CampaignDetail() {
  const { campaign } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        eyebrow={campaign.kicker}
        title={campaign.title}
        lede={campaign.summary}
        crumbs={[{ label: "Campaigns", to: "/campaigns" }, { label: campaign.title }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <img
                src={campaign.image}
                alt={campaign.imageAlt}
                width={1200}
                height={800}
                className="aspect-[3/2] w-full object-cover"
              />
            </Reveal>
            <div className="mt-10 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground">
              {campaign.body.map((paragraph: string) => (
                <Reveal key={paragraph} as="p">
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={120} className="h-fit bg-surface p-8">
            <h2 className="eyebrow text-green-mid">Campaign activities</h2>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              {campaign.activities.map((item: string) => (
                <li key={item} className="border-b border-hairline pb-3 last:border-0">
                  {item}
                </li>
              ))}
            </ul>
            <h2 className="eyebrow mt-10 text-green-mid">Location</h2>
            <p className="mt-3 text-sm text-ink-soft">{campaign.location}</p>
            <h2 className="eyebrow mt-8 text-green-mid">Status</h2>
            <p className="mt-3 text-sm text-ink-soft">{campaign.status}</p>
          </Reveal>
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
