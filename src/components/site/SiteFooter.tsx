import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { Logo } from "./Logo";
import { FOOTER_COLUMNS } from "@/data/navigation";
import { CMS_PLACEHOLDER, org } from "@/data/site";

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
              className="font-semibold text-on-dark underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red-wash"
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

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="eyebrow text-on-dark">{column.heading}</h2>
              <ul className="mt-5 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {"params" in link ? (
                      <Link
                        to={link.to}
                        params={link.params}
                        className="inline-flex min-h-8 items-center transition-colors hover:text-on-dark"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        to={link.to}
                        {...(link.hash ? { hash: link.hash } : {})}
                        className="inline-flex min-h-8 items-center transition-colors hover:text-on-dark"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-on-dark/10">
        <div className="shell flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>
              &copy; {new Date().getFullYear()} {org.name}. All rights reserved.
            </p>
            <p className="mt-1 text-on-dark-muted/70">
              Registered address:{" "}
              {org.address === CMS_PLACEHOLDER ? "To be confirmed" : org.address}
              {" · "}
              {org.country}
            </p>
            <p className="mt-1.5 text-on-dark-muted/80">
              Crafted &amp; Designed By{" "}
              <a
                href="https://www.innovatech-ng.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 font-semibold text-on-dark underline decoration-brand-red decoration-2 underline-offset-4 transition-colors hover:text-brand-red-wash"
              >
                <span>InnovaTech</span>
                <ExternalLink className="size-3 text-brand-red" />
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-[11px] sm:gap-3 sm:px-3.5 sm:text-xs">
            <span className="font-semibold text-on-dark">Official Account:</span>
            <span className="font-mono font-bold text-white">
              {org.bankDetails.bankName} · {org.bankDetails.accountNumber}
            </span>
            <span className="rounded-full bg-brand-red px-2 py-0.5 text-[9px] font-extrabold text-white sm:text-[10px]">
              VERIFIED
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
