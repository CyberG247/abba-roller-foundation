import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, PhoneCall, ShieldCheck } from "lucide-react";

import { CredentialLookupWidget } from "@/components/site/CredentialLookupWidget";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { DonateBand, Section } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";

const title = "Verify Status & Download ID Card — Abba Roller Foundation";
const description =
  "Enter your registered phone number to verify Admin approval status and download your official ARF Membership ID Card, Pro Bono Bar Slip, or Volunteer Accreditation Slip.";

export const Route = createFileRoute("/verify-id")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: VerifyIdPage,
});

const ISSUANCE_STEPS = [
  {
    step: "01",
    title: "Submit Registration",
    copy: "Complete your application with a valid Nigerian phone number as a Member, Pro Bono Advocate, or Volunteer.",
    icon: PhoneCall,
  },
  {
    step: "02",
    title: "Admin Verification",
    copy: "Our Secretariat and State Chapter leads review credentials (including NBA numbers for legal advocates) before approval.",
    icon: Clock,
  },
  {
    step: "03",
    title: "Lookup & Download",
    copy: "Once verified by an Administrator, return here and enter your registered phone number to download your official ID or Slip.",
    icon: CheckCircle2,
  },
] as const;

function VerifyIdPage() {
  return (
    <>
      <PageHeader
        eyebrow="Credential Issuance & Verification"
        title="Verify Registration & Download ID"
        lede="ARF credentials are issued strictly after Administrator review. Enter the phone number you provided during registration to check approval status and download your official ID Card or Accreditation Slip."
        crumbs={[{ label: "Check & Download ID" }]}
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <CredentialLookupWidget />
          </Reveal>

          {/* How Admin-Gated Issuance Works */}
          <Reveal delay={80} className="mt-10">
            <div className="grid gap-4 sm:grid-cols-3">
              {ISSUANCE_STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="rounded-sm border border-hairline bg-surface p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-green-deep bg-green-wash px-2 py-0.5 rounded-xs">
                          STEP {item.step}
                        </span>
                        <Icon className="size-4 text-green-deep" />
                      </div>
                      <h3 className="font-display font-bold text-base text-ink">{item.title}</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Direct links for new registrations */}
          <Reveal delay={120} className="mt-10">
            <div className="rounded-sm border border-hairline bg-background p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-green-deep shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-ink text-base">
                    Need to submit a new application?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Choose your pathway below and provide an active phone number so you can track
                    issuance here.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button asChild size="sm" variant="outline">
                  <Link to="/membership">
                    Membership
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/legal-aid">
                    Pro Bono Lawyers
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/volunteer">
                    Volunteers
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
