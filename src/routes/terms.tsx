import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/blocks";
import { org } from "@/data/site";

const title = "Terms of Use — Abba Roller Foundation";
const description =
  "The terms that apply to your use of the Abba Roller Foundation website and its content.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        lede="Please read these terms before using this website or relying on its content."
        crumbs={[{ label: "Terms of Use" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Use of this site</h2>
            <p className="mt-3">
              This website is provided for information about the work of {org.name}. You may not
              use it in any way that is unlawful or that interferes with its operation or
              security.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Content and accuracy</h2>
            <p className="mt-3">
              We publish programme information in good faith. Figures shown as awaiting
              confirmation are not final and should not be cited as verified results.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Intellectual property</h2>
            <p className="mt-3">
              The Foundation's name, logo, text and images belong to {org.name} or its licensors.
              Please request permission before reproducing them.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Donations</h2>
            <p className="mt-3">
              Contributions are applied to the Foundation's charitable programmes. Where a gift is
              designated to a specific campaign, we apply it to that campaign or, if it is fully
              funded, to a comparable programme need.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
            <p className="mt-3">
              Questions about these terms can be sent to{" "}
              <a
                href={`mailto:${org.email}`}
                className="font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
              >
                {org.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
