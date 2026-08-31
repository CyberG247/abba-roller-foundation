import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Handshake, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import partnerRenewedHope from "@/assets/partner-renewed-hope.jpg";
import partnerJigawaTso from "@/assets/partner-jigawa-tso.jpg";
import partnerInnovatech from "@/assets/partner-innovatech.png";

export type Partner = {
  name: string;
  category: string;
  logo: string;
  badge: string;
  description: string;
  url?: string;
};

export const partners: Partner[] = [
  {
    name: "Renewed Hope Partners",
    category: "Strategic National Development Initiative",
    logo: partnerRenewedHope,
    badge: "Strategic Partner",
    description:
      "Collaborating on nationwide social welfare, food security, and community empowerment initiatives across Northern Nigeria.",
  },
  {
    name: "Jigawa Tinubu Support Organization",
    category: "Civic Leadership & Community Outreach",
    logo: partnerJigawaTso,
    badge: "Civic & Outreach Partner",
    description:
      "Partnering on grassroots community mobilization, youth development, and verified humanitarian outreaches across Jigawa State.",
  },
  {
    name: "InnovaTech",
    category: "Digital Technology & Web Innovation",
    logo: partnerInnovatech,
    badge: "Technology Partner",
    description:
      "Providing digital infrastructure, technical innovation, and digital empowerment solutions to amplify Foundation impact.",
    url: "https://www.innovatech-ng.com/",
  },
];

export function PartnersMarquee({
  className,
  showHeading = true,
  tone = "surface",
  id = "partners",
}: {
  className?: string;
  showHeading?: boolean;
  tone?: "surface" | "white" | "dark";
  id?: string;
}) {
  // Repeat partner array for smooth, infinite marquee scrolling
  const marqueeItems = [...partners, ...partners, ...partners, ...partners];

  return (
    <section
      id={id}
      className={`scroll-mt-20 relative overflow-hidden py-16 md:py-24 ${
        tone === "dark"
          ? "bg-green-deep text-on-dark"
          : tone === "white"
            ? "bg-background text-ink"
            : "bg-surface text-ink border-y border-hairline"
      } ${className || ""}`}
    >
      {showHeading && (
        <div className="shell mb-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-red-wash px-3 py-1 text-xs font-bold text-brand-red">
                <Handshake className="size-3.5" />
                <span>Strategic Collaboration</span>
              </div>
              <h2 className={`display-2 mt-3 ${tone === "dark" ? "text-on-dark" : "text-ink"}`}>
                Our Partners
              </h2>
              <p
                className={`mt-4 max-w-2xl text-base ${
                  tone === "dark" ? "text-on-dark-muted" : "text-muted-foreground"
                }`}
              >
                Collaborating alongside trusted national initiatives, civic leadership
                organizations, and technical innovators to deliver accountable community impact
                across Nigeria.
              </p>
            </div>
            <Button
              asChild
              variant={tone === "dark" ? "onDarkOutline" : "outline"}
              size="default"
              className="shrink-0"
            >
              <Link to="/partners" className="inline-flex items-center gap-2">
                Partner with us
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Marquee Track Container with Gradient Edge Masks */}
      <div className="relative w-full overflow-hidden">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-36 ${
            tone === "dark"
              ? "bg-gradient-to-r from-green-deep to-transparent"
              : tone === "white"
                ? "bg-gradient-to-r from-background to-transparent"
                : "bg-gradient-to-r from-surface to-transparent"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-36 ${
            tone === "dark"
              ? "bg-gradient-to-l from-green-deep to-transparent"
              : tone === "white"
                ? "bg-gradient-to-l from-background to-transparent"
                : "bg-gradient-to-l from-surface to-transparent"
          }`}
        />

        <div className="animate-marquee-slow flex items-center gap-6 py-4">
          {marqueeItems.map((partner, index) => (
            <div
              key={`marquee-partner-${partner.name}-${index}`}
              className="group flex min-w-[300px] max-w-[340px] items-center gap-4 rounded-sm border border-hairline bg-background px-5 py-4 shadow-2xs transition-all duration-300 hover:scale-[1.03] hover:border-green-deep hover:shadow-lift"
            >
              <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-white p-1.5 border border-hairline/60 shadow-2xs">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  width={160}
                  height={80}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-display text-sm font-bold text-ink group-hover:text-green-deep transition-colors truncate">
                  {partner.name}
                </span>
                <span className="block text-[11px] font-medium text-muted-foreground truncate">
                  {partner.category}
                </span>
                <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-green-mid">
                  {partner.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
