import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Founder's Desk", to: "/founder" },
  { label: "Programs", to: "/programs" },
  { label: "Media & Updates", to: "/media" },
  { label: "Impact", to: "/impact" },
  { label: "Get Involved", to: "/get-involved" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const overHero = pathname === "/";
  const solid = scrolled || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const tone: "dark" | "light" = solid ? "dark" : "light";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:bg-green-deep focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-dark"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solid
            ? "border-b border-hairline bg-background/95 backdrop-blur-md"
            : "border-b border-on-dark/10 bg-transparent",
        )}
      >
        <div className="shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:h-20">
          <Logo tone={tone} />

          <div className="flex items-center gap-2 lg:gap-8">
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {navItems.map((item) => {
                  const active =
                    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "relative text-sm font-semibold transition-colors",
                          solid
                            ? active
                              ? "text-green-deep"
                              : "text-ink-soft hover:text-green-deep"
                            : active
                              ? "text-on-dark"
                              : "text-on-dark/75 hover:text-on-dark",
                        )}
                      >
                        {item.label}
                        {active && (
                          <span
                            aria-hidden
                            className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-brand-red"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Button asChild variant="give" size="sm" className="hidden sm:inline-flex">
              <Link to="/donate">Donate</Link>
            </Button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-sm transition-colors lg:hidden",
                solid ? "text-ink hover:bg-muted" : "text-on-dark hover:bg-on-dark/10",
              )}
            >
              <Menu aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-green-deep transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div aria-hidden className="motif-grid absolute inset-0 opacity-50" />
        <div className="shell relative flex h-18 items-center justify-between">
          <Logo tone="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-sm text-on-dark hover:bg-on-dark/10"
          >
            <X aria-hidden className="size-6" />
          </button>
        </div>
        <nav aria-label="Mobile" className="shell relative mt-6">
          <ul className="divide-y divide-on-dark/10 border-y border-on-dark/10">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-2xl font-bold text-on-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-2xl font-bold text-on-dark"
              >
                Contact
              </Link>
            </li>
          </ul>
          <Button asChild variant="give" size="lg" className="mt-8 w-full">
            <Link to="/donate" onClick={() => setOpen(false)}>
              Donate
            </Link>
          </Button>
        </nav>
      </div>
    </>
  );
}
