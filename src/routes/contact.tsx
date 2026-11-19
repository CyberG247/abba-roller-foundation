import { createFileRoute } from "@tanstack/react-router";

import { ContactSection } from "@/components/site/ContactSection";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/blocks";
import { CMS_PLACEHOLDER, org } from "@/data/site";

const title = "Contact — Abba Roller Foundation";
const description =
  "Get in touch with Abba Roller Foundation about programmes, partnerships, volunteering or media enquiries.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

function Contact() {
  const details = [
    { label: "Email", value: org.email, href: `mailto:${org.email}` },
    { label: "Phone", value: org.phone },
    { label: "Address", value: org.address },
    { label: "Country", value: org.country },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the Foundation"
        lede="Programme enquiries, partnerships, volunteering and media — we read every message."
        crumbs={[{ label: "Contact" }]}
      />

      <Section>
        <Reveal>
          <h2 className="display-2 text-ink">Official Contact Directory</h2>
          <dl className="mt-8 divide-y divide-hairline border-y border-hairline max-w-3xl">
            {details.map((detail) => (
              <div key={detail.label} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
                <dt className="eyebrow text-green-mid">{detail.label}</dt>
                <dd className="text-sm text-ink-soft">
                  {detail.value === CMS_PLACEHOLDER ? (
                    <span className="text-muted-foreground">To be confirmed</span>
                  ) : detail.href ? (
                    <a
                      href={detail.href}
                      className="font-semibold text-green-deep underline decoration-brand-red decoration-2 underline-offset-4"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <ContactSection id="contact-form" />
    </>
  );
}
