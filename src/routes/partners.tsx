import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { org } from "@/data/site";

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

      <Section>
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
            Tell us about your organisation, the communities you work in and the outcome you
            want to achieve. We will respond with a proposed scope and the documentation we can
            share.
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
