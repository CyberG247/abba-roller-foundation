import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { DonateBand, ProgramCard, Section } from "@/components/site/blocks";
import { programs } from "@/data/site";

const title = "Programmes — Abba Roller Foundation";
const description =
  "Education and skills development, youth and women's empowerment, humanitarian support, and health and social advocacy.";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Programs,
});

function Programs() {
  return (
    <>
      <PageHeader
        eyebrow="Our programmes"
        title="Five areas of focus, one commitment to dignity"
        lede="Each programme is designed with the communities it serves and structured for follow-up after delivery."
        crumbs={[{ label: "Programs" }]}
      />

      <Section>
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <ProgramCard key={program.slug} program={program} index={index} />
          ))}
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
