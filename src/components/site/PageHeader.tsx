import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type Crumb = { label: string; to?: string };

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
};

/** Shared deep-green masthead used by every interior page. */
export function PageHeader({ eyebrow, title, lede, crumbs, children }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-green-deep pt-32 pb-16 md:pt-40 md:pb-24">
      <div aria-hidden className="motif-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-light/25 blur-3xl"
      />
      <div className="shell relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-on-dark-muted">
              <li>
                <Link to="/" className="hover:text-on-dark">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3.5 opacity-50" />
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-on-dark">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-on-dark">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow text-brand-red-wash">{eyebrow}</p>
        <h1 className="display-1 mt-4 max-w-4xl text-on-dark">{title}</h1>
        {lede && <p className="lede mt-6 max-w-2xl text-on-dark-muted">{lede}</p>}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </header>
  );
}
