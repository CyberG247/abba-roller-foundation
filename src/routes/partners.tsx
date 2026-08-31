import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { PartnersMarquee, partners } from "@/components/site/PartnersMarquee";
import { org } from "@/data/site";
import { ExternalLink, Handshake, Sparkles } from "lucide-react";

const title = "Partner With Us — Abba Roller Foundation";
const description =
  "Collaborate with Abba Roller Foundation on community programmes, campaigns and shared development initiatives.";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Partners,
});

const models = [
  {
    title: "Programme partnership",
    body: "Co-design and co-deliver a programme in a community where both organisations have reach.",
  },
  {
    title: "Campaign support",
    body: "Fund or supply a defined campaign such as Pad Up Nigerian Girls, with documented outcomes.",
  },
  {
    title: "Institutional collaboration",
    body: "Work with us as an implementing partner on development, health or education mandates.",
  },
  {
    title: "Corporate social responsibility",
    body: "Direct CSR resources and employee volunteering into measurable community outcomes.",
  },
];

function Partners() {
  return (
    <>
      <PageHeader
        eyebrow="Partnership"
        title="Built to work alongside institutions"
        lede="Our programmes are documented, community-anchored and structured for partnership with development organisations, agencies and enterprises."
        crumbs={[{ label: "Get Involved", to: "/get-involved" }, { label: "Partner With Us" }]}
      />

      {/* Horizontal Sliding Partners Marquee */}
      <PartnersMarquee showHeading={false} tone="white" />

      {/* Featured Strategic Partners */}
      <Section>
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-red">Confirmed Collaborators</p>
          <h2 className="display-2 mt-3 text-ink">Our Strategic Partners</h2>
          <p className="lede mt-4">
            We work in trusted synergy with national initiatives, grassroots organizations, and
            technology providers to maximize the impact of our interventions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {partners.map((partner, index) => (
            <Reveal
              key={partner.name}
              delay={index * 80}
              as="article"
              className="flex flex-col justify-between rounded-sm border border-hairline bg-surface p-6 shadow-2xs transition-all hover:border-green-deep hover:shadow-lift"
            >
              <div>
                <div className="flex h-20 items-center justify-center rounded-xs bg-white p-3 border border-hairline/80 shadow-2xs">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5">
                  <span className="inline-block rounded-full bg-green-wash px-2.5 py-0.5 text-[10px] font-bold text-green-deep uppercase tracking-wider">
                    {partner.badge}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink">{partner.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-brand-red">{partner.category}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {partner.description}
                  </p>
                </div>
              </div>

              {partner.url && (
                <div className="mt-5 pt-4 border-t border-hairline">
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green-deep hover:underline"
                  >
                    <span>Visit website</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow text-green-mid">Collaboration Frameworks</p>
          <h2 className="display-3 mt-2 text-ink">How We Partner</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {models.map((model, index) => (
            <Reveal
              key={model.title}
              delay={index * 70}
              as="article"
              className="border-t-2 border-brand-red pt-6"
            >
              <h2 className="font-display text-xl font-bold text-ink">{model.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-14 bg-surface p-8">
          <h2 className="font-display text-xl font-bold text-ink">Start a conversation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tell us about your organisation, the communities you work in and the outcome you want to
            achieve. We will respond with a proposed scope and the documentation we can share.
          </p>
          <p className="mt-6 text-sm">
            <a
              href={`mailto:${org.email}?subject=Partnership%20enquiry`}
              className="font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
            >
              {org.email}
            </a>
          </p>
        </Reveal>
      </Section>

      <DonateBand />
    </>
  );
}
