import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/blocks";
import { org } from "@/data/site";

const title = "Volunteer With Us — Abba Roller Foundation";
const description =
  "Give your time and skills to community outreach, menstrual health education, skills training and humanitarian support.";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Volunteer,
});

const areas = [
  "Community outreach & sensitisation",
  "Menstrual health education",
  "Skills training facilitation",
  "Logistics & distribution",
  "Communications, design & photography",
  "Monitoring, data & reporting",
];

function Volunteer() {
  return (
    <>
      <PageHeader
        eyebrow="Volunteer"
        title="Volunteers carry this work"
        lede="Outreach, facilitation, logistics and documentation — our programmes depend on people who show up."
        crumbs={[{ label: "Get Involved", to: "/get-involved" }, { label: "Volunteer" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="display-2 text-ink">Where volunteers are needed</h2>
            <ul className="mt-8 space-y-3 text-sm text-ink-soft">
              {areas.map((area) => (
                <li key={area} className="border-b border-hairline pb-3">
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="bg-surface p-8">
            <h2 className="font-display text-xl font-bold text-ink">How to apply</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Send us a short message with your name, location, availability and the area you
              would like to support. Our team reviews applications on a rolling basis and will
              respond with next steps.
            </p>
            <p className="mt-6 text-sm">
              <a
                href={`mailto:${org.email}?subject=Volunteer%20application`}
                className="font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
              >
                {org.email}
              </a>
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              An online volunteer application form will be added here once the Foundation
              confirms its intake process.
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
