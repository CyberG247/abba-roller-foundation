import { createFileRoute, notFound } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, ProgramIcon, Section } from "@/components/site/blocks";
import { programs } from "@/data/site";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = programs.find((item) => item.slug === params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Programme not found — Abba Roller Foundation" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.program.title} — Abba Roller Foundation`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.program.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.program.summary },
      ],
    };
  },
  component: ProgramDetail,
});

function ProgramDetail() {
  const { program } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title={program.title}
        lede={program.summary}
        crumbs={[{ label: "Programs", to: "/programs" }, { label: program.title }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <img
                src={program.image}
                alt={program.imageAlt}
                width={1200}
                height={800}
                className="aspect-[3/2] w-full object-cover"
              />
            </Reveal>
            <div className="mt-10 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground">
              {program.body.map((paragraph) => (
                <Reveal key={paragraph} as="p">
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={120} className="h-fit bg-surface p-8">
            <h2 className="eyebrow flex items-center gap-2 text-green-mid">
              <ProgramIcon icon={program.icon} className="size-4" />
              Focus areas
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              {program.focus.map((item) => (
                <li key={item} className="border-b border-hairline pb-3 last:border-0">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
