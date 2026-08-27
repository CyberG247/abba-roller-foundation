import { createFileRoute, Link } from "@tanstack/react-router";

import heroGirls from "@/assets/hero-girls.jpg";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  DonateBand,
  ProgramCard,
  Section,
  StatList,
  StoryCard,
} from "@/components/site/blocks";
import { campaigns, impactMetrics, org, programs, stories, values } from "@/data/site";

const title = "Abba Roller Foundation — Empowering youth and women in Nigeria";
const description = org.description;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

function Home() {
  const campaign = campaigns[0];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-green-deep">
        <img
          src={heroGirls}
          alt="Schoolgirls in Nigeria smiling during a community outreach session"
          className="absolute inset-0 size-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div aria-hidden className="absolute inset-0 bg-green-deep/70" />
        <div aria-hidden className="motif-grid absolute inset-0 opacity-40" />
        <div className="shell relative grid gap-10 pt-36 pb-20 md:pt-48 md:pb-28">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-brand-red-wash">{org.shortName} · {org.country}</p>
            <h1 className="display-1 mt-5 text-on-dark">{org.tagline}</h1>
            <p className="lede mt-6 max-w-2xl text-on-dark-muted">{org.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="give" size="lg">
                <Link to="/donate">Donate now</Link>
              </Button>
              <Button asChild variant="onDarkOutline" size="lg">
                <Link to="/programs">Explore our programmes</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Our work"
          title="Programmes built around dignity and opportunity"
          lede="Five areas of focus, delivered with communities rather than for them."
        />
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <ProgramCard key={program.slug} program={program} index={index} />
          ))}
        </div>
      </Section>

      <section className="bg-surface py-20 md:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="Impact"
            title="Measured honestly, reported openly"
            lede="We publish verified figures only. Where a number is still being confirmed, we say so."
          />
          <div className="mt-14">
            <StatList metrics={impactMetrics} />
          </div>
          <Reveal delay={140} className="mt-10">
            <Link to="/impact" className="text-sm font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4">
              See our impact approach
            </Link>
          </Reveal>
        </div>
      </section>

      {campaign && (
        <Section>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <img
                src={campaign.image}
                alt={campaign.imageAlt}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[3/2] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow text-green-mid">Featured campaign</p>
              <h2 className="display-2 mt-4 text-ink">{campaign.title}</h2>
              <p className="lede mt-5">{campaign.summary}</p>
              <p className="mt-4 text-sm text-muted-foreground">{campaign.location}</p>
              <Button asChild variant="default" size="lg" className="mt-8">
                <Link to="/campaigns/$slug" params={{ slug: campaign.slug }}>
                  Read about the campaign
                </Link>
              </Button>
            </Reveal>
          </div>
        </Section>
      )}

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

      <Section>
        <SectionHeading eyebrow="Stories" title="Latest from the field" />
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <StoryCard key={story.slug} story={story} index={index} compact />
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}

/** Unused placeholder retained to satisfy shared header import parity. */
export const _pageHeader = PageHeader;
