import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/blocks";
import { org } from "@/data/site";

const title = "Donate — Abba Roller Foundation";
const description =
  "Support education, skills training, humanitarian aid and menstrual health programmes for youth and women in Nigeria.";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Donate,
});

const allocations = [
  {
    title: "Menstrual health supplies",
    body: "Sanitary products distributed alongside education sessions so girls do not miss school.",
  },
  {
    title: "Skills training",
    body: "Materials, facilitation and follow-up support for vocational training cohorts.",
  },
  {
    title: "Humanitarian support",
    body: "Food staples and household support for vulnerable families, coordinated with community leaders.",
  },
];

function Donate() {
  return (
    <>
      <PageHeader
        eyebrow="Donate"
        title="Your support turns intent into delivery"
        lede="Contributions fund supplies, training and humanitarian support in the communities where we work."
        crumbs={[{ label: "Donate" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="display-2 text-ink">Where your gift goes</h2>
            <div className="mt-8 divide-y divide-hairline border-y border-hairline">
              {allocations.map((item) => (
                <article key={item.title} className="py-5">
                  <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="h-fit bg-green-deep p-8 text-on-dark-muted">
            <h2 className="font-display text-xl font-bold text-on-dark">Give to ARF</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Secure online giving is being set up with the Foundation's payment provider. In
              the meantime, please contact us directly and our team will share verified giving
              details for your contribution.
            </p>
            <Button asChild variant="give" size="lg" className="mt-8 w-full">
              <a href={`mailto:${org.email}?subject=Donation%20enquiry`}>Contact us to give</a>
            </Button>
            <p className="mt-6 text-xs">
              Prefer another way to help?{" "}
              <Link to="/get-involved" className="font-semibold text-on-dark underline decoration-brand-red decoration-2 underline-offset-4">
                Volunteer or partner with us
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
