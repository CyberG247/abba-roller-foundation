import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { DonateBand, Section } from "@/components/site/blocks";
import { CMS_PLACEHOLDER, founder, values } from "@/data/site";

const title = "Founder's Desk — Hon. Usman Aminu Usman (Abba Roller)";
const description =
  "A message from Hon. Usman Aminu Usman (Abba Roller), Founder of Abba Roller Foundation, on dignity, empowerment and accountable community work in Nigeria.";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: founder.image },
    ],
  }),
  component: Founder,
});

function Founder() {
  return (
    <>
      <PageHeader
        eyebrow="Founder's Desk"
        title={founder.name}
        lede={`${founder.role} · Popularly known as ${founder.alias}`}
        crumbs={[{ label: "Founder's Desk" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
          <Reveal>
            <div className="overflow-hidden border border-hairline bg-surface shadow-lift">
              <img
                src={founder.image}
                alt={founder.portraitAlt}
                className="aspect-[4/5] w-full object-cover object-top"
                width={768}
                height={1024}
                loading="eager"
              />
            </div>
            <p className="mt-4 text-xs font-medium text-muted-foreground">
              {founder.name} ({founder.alias}) — {founder.role}
            </p>

            <dl className="mt-8 divide-y divide-hairline border-y border-hairline">
              {founder.profile.map((row) => (
                <div key={row.label} className="grid gap-1 py-4">
                  <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {row.label}
                  </dt>
                  <dd className="text-sm font-semibold text-ink">
                    {row.value === CMS_PLACEHOLDER ? (
                      <span className="font-normal text-muted-foreground">To be confirmed</span>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow text-green-mid">A message from the Founder</p>
            <h2 className="display-2 mt-4 text-ink">{founder.lede}</h2>
            <div className="mt-8 space-y-5">
              {founder.message.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-10 font-display text-lg font-bold text-ink">{founder.name}</p>
            <p className="text-sm text-muted-foreground">{founder.role}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="give" size="lg">
                <Link to="/donate">Support the mission</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/media">See our latest updates</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Priorities"
          title="Where the Founder's focus sits"
          lede="The areas the Foundation was created to serve, and where our attention remains."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {founder.focusAreas.map((area, index) => (
            <Reveal key={area} delay={index * 70} as="article">
              <span className="font-display text-3xl font-extrabold text-brand-red">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{area}</h3>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="What guides the work" title="Values held from the start" />
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
