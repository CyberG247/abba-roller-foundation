import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export type Partner = {
  name: string;
  category: string;
  logo: ReactNode;
  url?: string;
};

const partners: Partner[] = [
  {
    name: "Jigawa State Government",
    category: "State Government & Regional Authority",
    logo: (
      <svg viewBox="0 0 200 48" className="h-9 w-auto fill-current" aria-hidden>
        <g className="text-green-deep">
          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M14 28 L24 14 L34 28 Z" fill="currentColor" opacity="0.85" />
          <circle cx="24" cy="20" r="3" fill="#C62828" />
          <path d="M16 32 Q24 35 32 32" stroke="#C62828" strokeWidth="2" fill="none" />
        </g>
        <text
          x="50"
          y="21"
          className="fill-ink text-[12px] font-extrabold tracking-wider uppercase font-sans"
        >
          JIGAWA STATE
        </text>
        <text
          x="50"
          y="34"
          className="fill-muted-foreground text-[9.5px] font-medium tracking-widest uppercase font-sans"
        >
          GOVERNMENT
        </text>
      </svg>
    ),
  },
  {
    name: "UNICEF",
    category: "United Nations Children's Fund",
    logo: (
      <svg viewBox="0 0 160 48" className="h-9 w-auto fill-current" aria-hidden>
        <g className="text-[#00AEEF]">
          <circle cx="22" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="22" cy="18" r="4" fill="currentColor" />
          <path d="M16 28 C16 23 28 23 28 28 Z" fill="currentColor" />
          <circle cx="29" cy="21" r="2.5" fill="#C62828" />
          <path d="M25 28 C25 25 33 25 33 28 Z" fill="#C62828" />
        </g>
        <text
          x="46"
          y="30"
          className="fill-[#00AEEF] text-[20px] font-black tracking-tight font-sans lowercase"
        >
          unicef
        </text>
      </svg>
    ),
  },
  {
    name: "Bill & Melinda Gates Foundation",
    category: "Global Philanthropy & Healthcare",
    logo: (
      <svg viewBox="0 0 240 48" className="h-9 w-auto fill-current" aria-hidden>
        <g className="text-ink">
          <rect x="6" y="10" width="28" height="28" rx="4" fill="#C62828" />
          <path
            d="M14 18 H26 M14 24 H22 M14 30 H26"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="42"
            y="21"
            className="fill-ink text-[11px] font-extrabold tracking-wide uppercase font-sans"
          >
            BILL &amp; MELINDA
          </text>
          <text
            x="42"
            y="34"
            className="fill-ink-soft text-[10.5px] font-bold tracking-[0.14em] uppercase font-sans"
          >
            GATES foundation
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "USAID",
    category: "International Development Agency",
    logo: (
      <svg viewBox="0 0 170 48" className="h-9 w-auto fill-current" aria-hidden>
        <g>
          <circle cx="22" cy="24" r="16" fill="#002F6C" />
          <path d="M14 24 Q22 17 30 24" stroke="#BA0C2F" strokeWidth="2.5" fill="none" />
          <circle cx="18" cy="20" r="1.5" fill="#FFFFFF" />
          <circle cx="22" cy="18" r="1.5" fill="#FFFFFF" />
          <circle cx="26" cy="20" r="1.5" fill="#FFFFFF" />
          <path d="M17 25 L27 25" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <text
            x="46"
            y="26"
            className="fill-[#002F6C] text-[18px] font-black tracking-wider font-sans"
          >
            USAID
          </text>
          <text
            x="47"
            y="36"
            className="fill-muted-foreground text-[6.5px] font-bold tracking-widest uppercase font-sans"
          >
            FROM THE AMERICAN PEOPLE
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "UNHCR / UN Human Rights",
    category: "United Nations Agency",
    logo: (
      <svg viewBox="0 0 190 48" className="h-9 w-auto fill-current" aria-hidden>
        <g className="text-[#0072BC]">
          <circle cx="22" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M14 26 C14 18 30 18 30 26" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="22" cy="17" r="3" fill="currentColor" />
          <path
            d="M10 24 Q16 32 22 34 Q28 32 34 24"
            fill="none"
            stroke="#C62828"
            strokeWidth="1.5"
          />
          <text
            x="46"
            y="23"
            className="fill-[#0072BC] text-[14px] font-black tracking-wider font-sans"
          >
            UNHCR
          </text>
          <text
            x="46"
            y="34"
            className="fill-muted-foreground text-[8px] font-semibold tracking-wider uppercase font-sans"
          >
            The UN Refugee Agency
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "InnovaTech",
    category: "Digital Technology & Skills Partner",
    logo: (
      <svg viewBox="0 0 190 48" className="h-9 w-auto fill-current" aria-hidden>
        <g>
          <polygon
            points="22,10 34,17 34,31 22,38 10,31 10,17"
            fill="none"
            stroke="#145A43"
            strokeWidth="2.5"
          />
          <circle cx="22" cy="24" r="4" fill="#C62828" />
          <text
            x="44"
            y="24"
            className="fill-ink text-[14px] font-extrabold tracking-tight font-sans"
          >
            Innova<span className="text-green-mid">Tech</span>
          </text>
          <text
            x="44"
            y="35"
            className="fill-muted-foreground text-[8px] font-bold tracking-[0.18em] uppercase font-sans"
          >
            SOLUTIONS &amp; LABS
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Nigerian Correctional Service",
    category: "Custodial & Rehabilitation Partner",
    logo: (
      <svg viewBox="0 0 210 48" className="h-9 w-auto fill-current" aria-hidden>
        <g>
          <circle cx="22" cy="24" r="16" fill="#145A43" />
          <circle cx="22" cy="24" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <path
            d="M17 24 L27 24 M22 17 L22 31"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="46"
            y="21"
            className="fill-ink text-[11px] font-extrabold tracking-wider uppercase font-sans"
          >
            NIGERIAN CORRECTIONAL
          </text>
          <text
            x="46"
            y="34"
            className="fill-green-mid text-[9.5px] font-bold tracking-widest uppercase font-sans"
          >
            SERVICE (NCoS)
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Fed. Ministry of Humanitarian Affairs",
    category: "National Institutional Partner",
    logo: (
      <svg viewBox="0 0 230 48" className="h-9 w-auto fill-current" aria-hidden>
        <g>
          <circle cx="22" cy="24" r="16" fill="#0B3D2E" />
          <path
            d="M14 24 H30 M22 14 Q28 24 22 34 Q16 24 22 14"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
          />
          <text
            x="46"
            y="21"
            className="fill-ink text-[10.5px] font-extrabold tracking-tight uppercase font-sans"
          >
            FEDERAL MINISTRY OF
          </text>
          <text
            x="46"
            y="34"
            className="fill-brand-red text-[9px] font-bold tracking-wider uppercase font-sans"
          >
            HUMANITARIAN AFFAIRS
          </text>
        </g>
      </svg>
    ),
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
              <p
                className={`eyebrow ${tone === "dark" ? "text-brand-red-wash" : "text-brand-red"}`}
              >
                Strategic Collaboration
              </p>
              <h2 className={`display-2 mt-3 ${tone === "dark" ? "text-on-dark" : "text-ink"}`}>
                Our Partners
              </h2>
              <p
                className={`mt-4 max-w-2xl text-base ${
                  tone === "dark" ? "text-on-dark-muted" : "text-muted-foreground"
                }`}
              >
                Collaborating alongside state institutions, international agencies, philanthropic
                trusts, and technical organisations to deliver accountable community impact across
                Northern Nigeria.
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
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 ${
            tone === "dark"
              ? "bg-gradient-to-r from-green-deep to-transparent"
              : tone === "white"
                ? "bg-gradient-to-r from-background to-transparent"
                : "bg-gradient-to-r from-surface to-transparent"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 ${
            tone === "dark"
              ? "bg-gradient-to-l from-green-deep to-transparent"
              : tone === "white"
                ? "bg-gradient-to-l from-background to-transparent"
                : "bg-gradient-to-l from-surface to-transparent"
          }`}
        />

        <div className="animate-marquee-slow flex items-center gap-6 py-4">
          {/* First loop */}
          {partners.map((partner, index) => (
            <div
              key={`p1-${partner.name}-${index}`}
              className="group flex min-w-[240px] items-center gap-4 rounded-xs border border-hairline bg-background/95 px-6 py-4 shadow-xs transition-all duration-300 hover:scale-[1.03] hover:border-green-deep hover:shadow-lift"
            >
              <div className="flex h-10 shrink-0 items-center justify-center">{partner.logo}</div>
            </div>
          ))}
          {/* Second loop for infinite continuity */}
          {partners.map((partner, index) => (
            <div
              key={`p2-${partner.name}-${index}`}
              className="group flex min-w-[240px] items-center gap-4 rounded-xs border border-hairline bg-background/95 px-6 py-4 shadow-xs transition-all duration-300 hover:scale-[1.03] hover:border-green-deep hover:shadow-lift"
            >
              <div className="flex h-10 shrink-0 items-center justify-center">{partner.logo}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
