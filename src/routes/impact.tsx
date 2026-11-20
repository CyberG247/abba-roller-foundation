import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { DonateBand, Section, StatList } from "@/components/site/blocks";
import { PartnersMarquee } from "@/components/site/PartnersMarquee";
import { RegionalStatistics } from "@/components/site/RegionalStatistics";
import { impactMetrics, verifiedFigures } from "@/data/site";

const title = "Impact — Abba Roller Foundation";
const description =
  "How Abba Roller Foundation measures and reports impact across Northern Nigeria (Jigawa State to Kano State), including verified figures from our campaigns.";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Impact,
});

function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Impact & Accountability"
        title="We publish what we can verify"
        lede="Reporting is only useful when it is honest. Figures appear here once they are confirmed by our programmes team across Northern Nigeria."
        crumbs={[{ label: "Impact" }]}
      />

      {/* Regional Beneficiary Breakdown: Jigawa to Kano State */}
      <RegionalStatistics tone="default" />

      <Section tone="muted">
        <SectionHeading eyebrow="Verified figures" title="Confirmed campaign outcomes" />
        <div className="mt-12">
          <StatList metrics={verifiedFigures} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="In confirmation"
          title="Indicators we are currently consolidating"
          lede="These indicators are tracked across our programmes and will be published once verified."
        />
        <div className="mt-12">
          <StatList metrics={impactMetrics} />
        </div>
      </Section>

      <PartnersMarquee tone="surface" />

      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "How we measure",
              body: "Attendance, distribution records and follow-up engagement are recorded at the point of delivery and reconciled with community leaders.",
            },
            {
              title: "How we report",
              body: "Campaign documentation is published on this site as it is confirmed, with locations and activity detail included.",
            },
            {
              title: "How we improve",
              body: "Follow-up after a programme concludes tells us what actually changed — and shapes the design of the next cohort.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 70} as="article">
              <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col justify-between gap-6 rounded-sm border border-hairline bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-green-deep uppercase">
              <ShieldCheck className="size-4" />
              <span>Accountability &amp; Operational Cross-Links</span>
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-ink">
              Inspect How Relief Rules &amp; Chapters Operate
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Review our beneficiary eligibility matrix, zero-middleman disbursement steps, and
              active LGA chapter hubs across Northern Nigeria.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-12 gap-2 font-bold">
              <Link to="/relief">
                <span>View Relief Eligibility</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12 gap-2 font-bold">
              <Link to="/chapters">
                <MapPin className="size-4" />
                <span>Regional Chapter Hubs</span>
              </Link>
            </Button>
          </div>
        </Reveal>
      </Section>

      <DonateBand />
    </>
  );
}
