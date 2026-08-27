import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { DonateBand, Section } from "@/components/site/blocks";
import { org, values } from "@/data/site";

const title = "About — Abba Roller Foundation";
const description =
  "Who we are, why we exist and how Abba Roller Foundation works alongside communities in Nigeria.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A foundation built on dignity, opportunity and community trust"
        lede={org.description}
        crumbs={[{ label: "About" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              Abba Roller Foundation was established to close the distance between potential and
              opportunity for young people and women in Nigeria. We work in education and skills
              development, humanitarian support, and health and social advocacy.
            </p>
            <p>
              Our approach is deliberately unglamorous: we work with community leaders, schools and
              volunteers, we stay after the programme ends, and we report what we can verify. Where
              a figure or detail is still being confirmed, we say so rather than fill the space with
              an estimate.
            </p>
            <p>
              The Foundation is registered and operating in {org.country}, and is structured to
              collaborate with institutional partners, development organisations and government
              agencies as our programmes grow.
            </p>
          </Reveal>
          <Reveal delay={120} className="border-l-4 border-brand-red pl-6">
            <h2 className="eyebrow text-green-mid">Mission</h2>
            <p className="mt-3 font-display text-xl leading-snug font-bold text-ink">
              To empower youth and women through education, skills training and humanitarian support
              — strengthening the communities they belong to.
            </p>
            <h2 className="eyebrow mt-10 text-green-mid">Vision</h2>
            <p className="mt-3 font-display text-xl leading-snug font-bold text-ink">
              Communities in which no person is left behind because of where they were born or what
              they lack.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="What guides us" title="Our values" />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 60} as="article">
              <h3 className="font-display text-lg font-bold text-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
