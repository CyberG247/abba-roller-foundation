import { Link } from "@tanstack/react-router";

import { Logo } from "./Logo";
import { CMS_PLACEHOLDER, org } from "@/data/site";

const columns = [
  {
    heading: "Organisation",
    links: [
      { label: "About", to: "/about" },
      { label: "Programs", to: "/programs" },
      { label: "Impact", to: "/impact" },
      { label: "Stories", to: "/stories" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Donate", to: "/donate" },
      { label: "Volunteer", to: "/volunteer" },
      { label: "Partner With Us", to: "/partners" },
      { label: "Campaigns", to: "/campaigns" },
      { label: "Get Involved", to: "/get-involved" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Accessibility Statement", to: "/accessibility" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-on-dark-muted">
      <div aria-hidden className="h-1 w-full bg-brand-red" />
      <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-6 text-sm leading-relaxed">{org.description}</p>
          <p className="mt-6 text-sm">
            <a
              href={`mailto:${org.email}`}
              className="font-semibold text-on-dark underline decoration-brand-red decoration-2 underline-offset-4"
            >
              {org.email}
            </a>
          </p>
          {org.socials.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-4 text-sm">
              {org.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="hover:text-on-dark"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-xs text-on-dark-muted/70">
              Official social accounts will be listed here once confirmed by the Foundation.
            </p>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="eyebrow text-on-dark">{column.heading}</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-on-dark">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-on-dark/10">
        <div className="shell flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {org.name}. All rights reserved.
          </p>
          <p>
            Registered address: {org.address === CMS_PLACEHOLDER ? "To be confirmed" : org.address}
            {" · "}
            {org.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
