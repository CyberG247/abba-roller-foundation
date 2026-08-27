import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/blocks";
import { org } from "@/data/site";

const title = "Accessibility Statement — Abba Roller Foundation";
const description =
  "Our commitment to keeping the Abba Roller Foundation website usable for everyone, including assistive technology users.";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Accessibility,
});

function Accessibility() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Accessibility Statement"
        lede="Dignity includes access. This site is built to be usable with a keyboard, a screen reader and a low-bandwidth connection."
        crumbs={[{ label: "Accessibility Statement" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Our approach</h2>
            <p className="mt-3">
              We aim to meet the WCAG 2.1 AA guidelines. That means semantic headings, visible
              focus states, a skip-to-content link, descriptive alternative text for images and
              colour contrast that remains legible.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Motion and animation</h2>
            <p className="mt-3">
              Animation is kept minimal and respects the operating system reduced-motion
              preference.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Known limitations</h2>
            <p className="mt-3">
              Some content is still being confirmed by the Foundation and appears as a
              placeholder. We will continue reviewing pages as content is added.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Feedback</h2>
            <p className="mt-3">
              If you encounter a barrier on this site, please tell us at{" "}
              <a
                href={`mailto:${org.email}`}
                className="font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
              >
                {org.email}
              </a>{" "}
              and we will work to resolve it.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
