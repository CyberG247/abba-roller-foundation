import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/blocks";
import { org } from "@/data/site";

const title = "Privacy Policy — Abba Roller Foundation";
const description =
  "How Abba Roller Foundation collects, uses and protects personal information shared with us.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="We collect only what we need, use it only for the purpose it was given, and protect it."
        crumbs={[{ label: "Privacy Policy" }]}
      />

      <Section>
        <div className="prose-editorial mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Information we collect</h2>
            <p className="mt-3">
              We collect information you choose to share with us — for example your name, email
              address and message when you contact us, volunteer or enquire about partnership.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">How we use information</h2>
            <p className="mt-3">
              We use your information to respond to your enquiry, coordinate volunteering or
              partnership, and keep records of our programme activities. We do not sell personal
              information.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Photography and consent</h2>
            <p className="mt-3">
              Where we publish images from our programmes, we seek consent from participants or
              their guardians. If you would like an image involving you removed, contact us and we
              will act on the request.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Retention and security</h2>
            <p className="mt-3">
              We retain information only as long as needed for the purpose it was collected and
              apply reasonable safeguards against unauthorised access.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-ink">Your rights</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of the personal information we
              hold about you by writing to{" "}
              <a
                href={`mailto:${org.email}`}
                className="font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
              >
                {org.email}
              </a>
              .
            </p>
          </section>
          <p className="text-xs">
            This policy will be updated with the Foundation's registered data-protection contact
            once confirmed.
          </p>
        </div>
      </Section>
    </>
  );
}
