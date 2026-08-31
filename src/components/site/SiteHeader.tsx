import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", sectionId: "hero", to: "/" },
  { label: "About", sectionId: "about", to: "/about" },
  { label: "Founder's Desk", sectionId: "founder", to: "/founder" },
  { label: "Programs", sectionId: "programs", to: "/programs" },
  { label: "Weekly Feeding", sectionId: "food-distribution", to: "/campaigns/weekly-community-food-distribution" },
  { label: "Media & Updates", sectionId: "media", to: "/media" },
  { label: "Impact", sectionId: "impact", to: "/impact" },
  { label: "Partners", sectionId: "partners", to: "/partners" },
  { label: "Get Involved", sectionId: "get-involved", to: "/get-involved" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy observer for single-page sections
  useEffect(() => {
    if (!isHome) return;

    const sections = navItems.map((item) => item.sectionId);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        const topEntry = visible.reduce((prev, current) =>
          prev.boundingClientRect.top > current.boundingClientRect.top ? current : prev,
        );
        setActiveSection(topEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-70px 0px -50% 0px",
      threshold: [0, 0.2, 0.5],
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollToSection = (sectionId: string, e?: React.MouseEvent) => {
    if (isHome) {
      if (e) e.preventDefault();
      setOpen(false);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `#${sectionId}`);
      } else if (sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

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
            ? "border-b border-hairline bg-background/95 backdrop-blur-md shadow-2xs"
            : "border-b border-on-dark/10 bg-transparent",
        )}
      >
        <div className="shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:h-20">
          <Logo tone={tone} />

          <div className="flex items-center gap-2 lg:gap-6 xl:gap-8">
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-5 xl:gap-6">
                {navItems.map((item) => {
                  const active = isHome
                    ? activeSection === item.sectionId
                    : pathname.startsWith(item.to);
                  return (
                    <li key={item.sectionId}>
                      <a
                        href={isHome ? `#${item.sectionId}` : item.to}
                        onClick={(e) => scrollToSection(item.sectionId, e)}
                        className={cn(
                          "relative text-xs xl:text-sm font-semibold transition-all py-1 cursor-pointer",
                          solid
                            ? active
                              ? "text-green-deep font-bold"
                              : "text-ink-soft hover:text-green-deep"
                            : active
                              ? "text-on-dark font-bold"
                              : "text-on-dark/80 hover:text-on-dark",
                        )}
                      >
                        {item.label}
                        {active && (
                          <span
                            aria-hidden
                            className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-brand-red rounded-full"
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <a
              href={isHome ? "#donate" : "/donate"}
              onClick={(e) => scrollToSection("donate", e)}
              className="btn-shine hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-red/25 ring-1 ring-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-red/40 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Heart className="size-3.5 fill-white animate-pulse" />
              <span>Donate</span>
            </a>

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

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-green-deep transition-opacity duration-300 lg:hidden overflow-y-auto",
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
        <nav aria-label="Mobile" className="shell relative mt-4 pb-12">
          <ul className="divide-y divide-on-dark/10 border-y border-on-dark/10">
            {navItems.map((item) => (
              <li key={item.sectionId}>
                <a
                  href={isHome ? `#${item.sectionId}` : item.to}
                  onClick={(e) => scrollToSection(item.sectionId, e)}
                  className="flex items-center justify-between py-4 font-display text-xl font-bold text-on-dark hover:text-brand-red-wash transition-colors"
                >
                  <span>{item.label}</span>
                  {activeSection === item.sectionId && (
                    <span className="size-2 rounded-full bg-brand-red" />
                  )}
                </a>
              </li>
            ))}
            <li>
              <a
                href={isHome ? "#contact" : "/contact"}
                onClick={(e) => scrollToSection("contact", e)}
                className="block py-4 font-display text-xl font-bold text-on-dark"
              >
                Contact
              </a>
            </li>
          </ul>
          <a
            href={isHome ? "#donate" : "/donate"}
            onClick={(e) => scrollToSection("donate", e)}
            className="btn-shine mt-8 flex w-full items-center justify-center gap-2.5 rounded-sm bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright py-4 text-base font-extrabold text-white shadow-lift ring-1 ring-white/30 transition-all active:scale-[0.99] cursor-pointer"
          >
            <Heart className="size-4.5 fill-white animate-pulse" />
            <span>Donate Now</span>
          </a>
        </nav>
      </div>
    </>
  );
}
