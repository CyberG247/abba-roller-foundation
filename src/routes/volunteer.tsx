import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Scale, Users2 } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { VolunteerSection } from "@/components/site/VolunteerSection";
import { LawyersVolunteerSection } from "@/components/site/LawyersVolunteerSection";
import { org } from "@/data/site";

const title = "Volunteer & Lawyers Pro Bono Network — Abba Roller Foundation";
const description =
  "Step forward to serve humanity. Register as a general volunteer or join our specialized Lawyers Volunteer Network to win a case for the less privileged.";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Volunteer,
});

const volunteerPerks = [
  {
    title: "Direct Grassroots Impact",
    desc: "Hands-on participation in weekly food distribution, school outreaches, and Ramadan relief operations.",
  },
  {
    title: "Official Volunteer Slip & Credentials",
    desc: "Instant verified registration slip, certificate of volunteer service, and accreditation letter upon request.",
  },
  {
    title: "Pro Bono Legal Representation",
    desc: "Qualified legal practitioners stand up in courtrooms to defend indigent citizens and win cases for the vulnerable.",
  },
  {
    title: "Community of Purpose",
    desc: "Connect with dedicated civic actors, youth changemakers, and compassionate leaders across northern Nigeria.",
  },
];

function Volunteer() {
  const [activeTab, setActiveTab] = useState<"general" | "lawyers">("general");

  // Check URL hash on load or change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("lawyer")) {
        setActiveTab("lawyers");
      }
    }
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Volunteer Network"
        title="Volunteers Carry This Work"
        lede="Outreach, logistics, healthcare assistance, and legal defense — our humanitarian interventions succeed because people like you show up."
        crumbs={[{ label: "Get Involved", to: "/get-involved" }, { label: "Volunteer Intake" }]}
      />

      {/* Overview Highlights Banner */}
      <section className="py-12 bg-surface border-b border-hairline">
        <div className="shell">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {volunteerPerks.map((perk, i) => (
              <Reveal
                key={perk.title}
                delay={i * 60}
                className="p-5 rounded-sm bg-background border border-hairline shadow-2xs"
              >
                <div className="size-8 rounded-full bg-green-wash text-green-deep flex items-center justify-center mb-3">
                  <CheckCircle2 className="size-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-ink">{perk.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation Selector */}
      <section className="py-8 bg-background border-b border-hairline sticky top-16 z-30 backdrop-blur-md bg-background/95">
        <div className="shell max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab("general");
                if (typeof window !== "undefined") {
                  window.history.replaceState(null, "", "#general-volunteer");
                }
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                activeTab === "general"
                  ? "bg-green-deep text-white shadow-md ring-2 ring-green-deep/20"
                  : "bg-surface text-ink hover:bg-surface/80 border border-hairline"
              }`}
            >
              <Users2 className="size-4" />
              <span>General Humanitarian Volunteers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("lawyers");
                if (typeof window !== "undefined") {
                  window.history.replaceState(null, "", "#lawyers-volunteer");
                }
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                activeTab === "lawyers"
                  ? "bg-emerald-900 text-white shadow-md ring-2 ring-emerald-800/30"
                  : "bg-surface text-ink hover:bg-surface/80 border border-hairline"
              }`}
            >
              <Scale className="size-4 text-emerald-400" />
              <div className="flex items-center gap-2">
                <span>Lawyers Volunteer Section</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Win a case
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Active Tab View */}
      {activeTab === "general" ? (
        <div id="general-volunteer">
          <VolunteerSection id="volunteer-form" />
        </div>
      ) : (
        <div id="lawyers-volunteer">
          <LawyersVolunteerSection id="lawyers-intake" />
        </div>
      )}

      {/* Support / Help Desk Footer */}
      <section className="py-14 bg-background border-t border-hairline">
        <div className="shell max-w-4xl mx-auto text-center">
          <Reveal>
            <h3 className="font-display text-xl font-bold text-ink">
              Have Questions About the Volunteer Intake or Legal Corps?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
              Our central volunteer coordination and legal advocacy desk reviews applications
              continuously. If you have inquiries or represent a law firm / civil society
              organization seeking collective volunteer partnerships, reach out directly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${org.email}?subject=Volunteer%20Inquiry%20-%20Abba%20Roller%20Foundation`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-surface border border-hairline text-xs font-bold text-green-deep hover:bg-green-wash transition-colors"
              >
                <span>Email Coordinator: {org.email}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
