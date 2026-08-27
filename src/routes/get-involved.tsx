import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { involvementOptions } from "@/data/site";

const title = "Get Involved — Abba Roller Foundation";
const description =
  "Volunteer, partner with us, support our programmes or help advocate for the communities we serve.";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: GetInvolved;
});

function GetInvolved() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="There is more than one way to stand with these communities"
        lede="Time, expertise, partnership or resources — each of them extends the reach of our programmes."
        crumbs={[{ label: "Get Involved" }]}
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          {involvementOptions.map((option, index) => (
            <Reveal
              key={option.title}
              delay={index * 70}
              as="article"
              className="flex flex-col border-t-2 border-brand-red pt-6"
            >
              <h2 className="font-display text-xl font-bold text-ink">{option.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {option.body}
              </p>
              <Button asChild variant="default" size="sm" className="mt-6 self-start">
                <Link to={option.to}>{option.cta}</Link>
              </Button>
            </Reveal>
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
