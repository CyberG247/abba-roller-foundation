import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { DonateBand, Section, formatDate } from "@/components/site/blocks";
import { cn } from "@/lib/utils";
import { CMS_PLACEHOLDER, updateCategories, updates } from "@/data/site";

const title = "Media & Updates — Abba Roller Foundation";
const description =
  "Updates from Abba Roller Foundation: food distributions, financial support, empowerment outreach, pad disbursements, skills training and humanitarian response.";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Media,
});

function Media() {
  const [active, setActive] = useState<string>("All");
  const filtered =
    active === "All" ? updates : updates.filter((update) => update.category === active);

  return (
    <>
      <PageHeader
        eyebrow="Media & Updates"
        title="What we have been doing, community by community"
        lede="A running record of our outreach — food distributions, financial support, empowerment sessions, pad disbursements and humanitarian response. Dates and figures appear once confirmed by our programmes team."
        crumbs={[{ label: "Media & Updates" }]}
      />

      <Section>
        <SectionHeading eyebrow="Filter" title="Browse by activity" />

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", ...updateCategories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-colors",
                active === category
                  ? "border-green-deep bg-green-deep text-on-dark"
                  : "border-hairline text-ink-soft hover:border-green-deep hover:text-green-deep",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((update, index) => (
            <Reveal key={update.id} delay={index * 70} as="article" className="flex flex-col">
              <div className="overflow-hidden bg-muted">
                <img
                  src={update.image}
                  alt={update.imageAlt}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className={cn(
                    "aspect-[16/10] w-full object-cover",
                    update.imagePosition || "object-center",
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col pt-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground">
                  <span className="tracking-[0.1em] text-brand-red uppercase">
                    {update.category}
                  </span>
                  <span aria-hidden>·</span>
                  {update.date === CMS_PLACEHOLDER ? (
                    <span>Date to be confirmed</span>
                  ) : (
                    <time dateTime={update.date}>{formatDate(update.date)}</time>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{update.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{update.location}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {update.summary}
                </p>
                <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4 text-sm text-ink-soft">
                  {update.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-brand-red" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Media"
          title="Press & documentation"
          lede="Photography, campaign documentation and press material are published here as each outreach is documented and confirmed."
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="default" size="lg">
            <Link to="/stories">Read our stories</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">Media enquiries</Link>
          </Button>
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
