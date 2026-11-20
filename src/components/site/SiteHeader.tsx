import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Camera,
  ChevronDown,
  HandHeart,
  Handshake,
  Heart,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Scale,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "./Logo";
import { loadCmsNav, type CmsNavEntry } from "@/data/admin/cmsStore";
import {
  NAV_GROUPS,
  type AppStaticRoute,
  type NavDestination,
  type NavGroup,
  type NavIconKey,
} from "@/data/navigation";
import { cn } from "@/lib/utils";

const NAV_ICON_MAP: Record<NavIconKey, React.ComponentType<{ className?: string }>> = {
  "heart-handshake": HeartHandshake,
  scale: Scale,
  briefcase: Briefcase,
  users: Users,
  "map-pin": MapPin,
  "hand-heart": HandHeart,
  "shield-check": ShieldCheck,
  "bar-chart": BarChart3,
  newspaper: Newspaper,
  handshake: Handshake,
  building: Building2,
  award: Award,
  mail: Mail,
  camera: Camera,
};

function isGroupActive(group: NavGroup, pathname: string): boolean {
  if (group.items.some((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))) {
    return true;
  }
  if (
    group.id === "initiatives" &&
    (pathname.startsWith("/programs") || pathname.startsWith("/campaigns"))
  ) {
    return true;
  }
  if (group.id === "network" && pathname.startsWith("/get-involved")) {
    return true;
  }
  if (group.id === "accountability" && pathname.startsWith("/media")) {
    return true;
  }
  return false;
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<NavGroup["id"] | null>(null);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<NavGroup["id"] | null>(
    "initiatives",
  );
  const [cmsNavItems, setCmsNavItems] = useState<CmsNavEntry[] | null>(null);

  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncNav = () => setCmsNavItems(loadCmsNav());
    syncNav();
    window.addEventListener("arf_cms_updated", syncNav);
    window.addEventListener("storage", syncNav);
    return () => {
      window.removeEventListener("arf_cms_updated", syncNav);
      window.removeEventListener("storage", syncNav);
    };
  }, []);

  const resolvedGroups = cmsNavItems
    ? NAV_GROUPS.map((group) => {
        const cmsGroupEntries = cmsNavItems
          .filter((entry) => entry.group === group.id && entry.visible)
          .sort((a, b) => a.order - b.order);

        if (cmsGroupEntries.length === 0) {
          return {
            ...group,
            items: group.items.map((item: NavDestination) => ({
              ...item,
              customSlug: undefined as string | undefined,
            })),
          };
        }

        const mappedItems = cmsGroupEntries.map((entry) => {
          const matchingStatic = group.items.find((s) => s.to === entry.to);
          const customSlug = entry.to.startsWith("/p/") ? entry.to.slice(3) : undefined;
          return {
            label: entry.label,
            description: entry.description,
            to: (customSlug ? "/" : entry.to) as AppStaticRoute,
            customSlug,
            badge: entry.badge,
            icon: (matchingStatic?.icon ?? "briefcase") as NavIconKey,
            hash: matchingStatic?.hash,
          };
        });

        return {
          ...group,
          items: mappedItems,
        };
      })
    : NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.map((item: NavDestination) => ({
          ...item,
          customSlug: undefined as string | undefined,
        })),
      }));

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
            ? "border-b border-hairline bg-background/95 shadow-2xs backdrop-blur-md"
            : "border-b border-on-dark/15 bg-green-deep/30 backdrop-blur-sm",
        )}
      >
        <div
          ref={navContainerRef}
          className="shell flex h-18 items-center justify-between gap-4 md:h-20"
        >
          <Logo tone={tone} />

          {/* Desktop 4-Domain Navigation + Conversion Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1 xl:gap-2">
                {resolvedGroups.map((group) => {
                  const active = isGroupActive(group, pathname);
                  const isOpen = openDropdown === group.id;
                  const menuId = `nav-menu-${group.id}`;

                  return (
                    <li key={group.id} className="relative">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={menuId}
                        onClick={() =>
                          setOpenDropdown((prev) => (prev === group.id ? null : group.id))
                        }
                        className={cn(
                          "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors xl:text-sm",
                          solid
                            ? active || isOpen
                              ? "bg-green-wash text-green-deep font-bold"
                              : "text-ink-soft hover:bg-surface hover:text-green-deep"
                            : active || isOpen
                              ? "bg-white/15 text-white font-bold"
                              : "text-on-dark/90 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <span>{group.label}</span>
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-3.5 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>

                      {isOpen && (
                        <div
                          id={menuId}
                          role="region"
                          aria-label={`${group.label} destinations`}
                          className="animate-in fade-in slide-in-from-top-1 absolute top-full left-0 z-50 mt-2 w-84 rounded-md border border-hairline bg-background p-2.5 shadow-panel duration-150"
                        >
                          <div className="border-b border-hairline px-3 pb-2 mb-1.5">
                            <p className="text-[11px] font-bold tracking-wider text-brand-red uppercase">
                              {group.label}
                            </p>
                            <p className="text-xs text-muted-foreground">{group.tagline}</p>
                          </div>

                          <ul className="space-y-1">
                            {group.items.map((item) => {
                              const Icon = NAV_ICON_MAP[item.icon];
                              const itemPath = item.customSlug ? `/p/${item.customSlug}` : item.to;
                              const itemActive =
                                pathname === itemPath || pathname.startsWith(`${itemPath}/`);

                              return (
                                <li key={itemPath + item.label}>
                                  {item.customSlug ? (
                                    <Link
                                      to="/p/$slug"
                                      params={{ slug: item.customSlug }}
                                      onClick={() => setOpenDropdown(null)}
                                      className={cn(
                                        "group flex min-h-12 items-start gap-3 rounded-sm p-2.5 transition-colors",
                                        itemActive
                                          ? "bg-green-wash text-green-deep"
                                          : "hover:bg-surface text-ink",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xs transition-colors",
                                          itemActive
                                            ? "bg-green-deep text-white"
                                            : "bg-surface text-green-deep group-hover:bg-green-deep group-hover:text-white",
                                        )}
                                      >
                                        <Icon className="size-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-ink">
                                            {item.label}
                                          </span>
                                          {item.badge && (
                                            <span className="rounded-full bg-green-wash px-2 py-0.5 text-[10px] font-bold text-green-deep">
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                          {item.description}
                                        </p>
                                      </div>
                                    </Link>
                                  ) : (
                                    <Link
                                      to={item.to}
                                      {...(item.hash ? { hash: item.hash } : {})}
                                      onClick={() => setOpenDropdown(null)}
                                      className={cn(
                                        "group flex min-h-12 items-start gap-3 rounded-sm p-2.5 transition-colors",
                                        itemActive
                                          ? "bg-green-wash text-green-deep"
                                          : "hover:bg-surface text-ink",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xs transition-colors",
                                          itemActive
                                            ? "bg-green-deep text-white"
                                            : "bg-surface text-green-deep group-hover:bg-green-deep group-hover:text-white",
                                        )}
                                      >
                                        <Icon className="size-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-ink">
                                            {item.label}
                                          </span>
                                          {item.badge && (
                                            <span className="rounded-full bg-green-wash px-2 py-0.5 text-[10px] font-bold text-green-deep">
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                          {item.description}
                                        </p>
                                      </div>
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Primary Membership Funnel CTA */}
            <Link
              to="/membership"
              className={cn(
                "hidden min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold whitespace-nowrap shadow-xs transition-all md:inline-flex",
                solid
                  ? "border-green-deep/30 bg-green-wash text-green-deep hover:bg-green-deep hover:text-white"
                  : "border-amber-300/60 bg-amber-400 text-slate-950 hover:bg-amber-300",
              )}
            >
              <Users className="size-3.5" />
              <span>Join ARF</span>
            </Link>

            {/* Direct Giving CTA */}
            <Link
              to="/donate"
              className="btn-shine hidden min-h-10 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright px-4 py-2 text-xs font-bold whitespace-nowrap text-white shadow-md shadow-brand-red/25 ring-1 ring-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-red/40 active:scale-95 sm:inline-flex lg:px-5"
            >
              <Heart className="size-3.5 fill-white" />
              <span>Donate</span>
            </Link>

            {/* Mobile Drawer Trigger (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className={cn(
                "inline-flex size-11 cursor-pointer items-center justify-center rounded-sm transition-colors lg:hidden",
                solid ? "text-ink hover:bg-muted" : "text-on-dark hover:bg-on-dark/15",
              )}
            >
              <Menu aria-hidden className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Accessible Full-Screen Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-60 flex h-[100dvh] flex-col overflow-hidden bg-green-deep text-on-dark lg:hidden"
        >
          <div aria-hidden className="motif-grid absolute inset-0 opacity-40" />

          {/* Drawer Top Bar */}
          <div className="shell relative flex h-18 shrink-0 items-center justify-between border-b border-white/10">
            <Logo tone="light" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-on-dark hover:bg-white/15"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>

          {/* Scrollable Accordion Domains */}
          <nav
            aria-label="Mobile navigation domains"
            className="shell relative flex-1 overflow-y-auto py-4"
          >
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex min-h-12 items-center justify-between border-b border-white/10 py-3 font-display text-base font-bold",
                pathname === "/" ? "text-amber-300" : "text-on-dark",
              )}
            >
              <span>Executive Summary Home</span>
              {pathname === "/" && <span className="size-2 rounded-full bg-brand-red-bright" />}
            </Link>

            <div className="divide-y divide-white/10">
              {resolvedGroups.map((group) => {
                const expanded = expandedMobileGroup === group.id;
                const active = isGroupActive(group, pathname);

                return (
                  <div key={group.id} className="py-1">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setExpandedMobileGroup((prev) => (prev === group.id ? null : group.id))
                      }
                      className="flex min-h-12 w-full cursor-pointer items-center justify-between py-3 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-display text-lg font-bold text-on-dark">
                          {group.label}
                        </span>
                        {active && (
                          <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-5 text-on-dark-muted transition-transform",
                          expanded && "rotate-180 text-white",
                        )}
                      />
                    </button>

                    {expanded && (
                      <ul className="space-y-1.5 pb-3 pl-1">
                        {group.items.map((item) => {
                          const Icon = NAV_ICON_MAP[item.icon];
                          const itemPath = item.customSlug ? `/p/${item.customSlug}` : item.to;
                          const itemActive =
                            pathname === itemPath || pathname.startsWith(`${itemPath}/`);

                          return (
                            <li key={itemPath + item.label}>
                              {item.customSlug ? (
                                <Link
                                  to="/p/$slug"
                                  params={{ slug: item.customSlug }}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex min-h-12 items-center gap-3 rounded-sm px-3 py-2.5 transition-colors",
                                    itemActive
                                      ? "bg-white/15 text-amber-300"
                                      : "bg-white/5 text-on-dark hover:bg-white/10",
                                  )}
                                >
                                  <Icon className="size-4.5 shrink-0 text-amber-300" />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-sm font-bold">{item.label}</span>
                                      {item.badge && (
                                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="line-clamp-1 text-xs text-on-dark-muted">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              ) : (
                                <Link
                                  to={item.to}
                                  {...(item.hash ? { hash: item.hash } : {})}
                                  onClick={() => setMobileOpen(false)}
                                  className={cn(
                                    "flex min-h-12 items-center gap-3 rounded-sm px-3 py-2.5 transition-colors",
                                    itemActive
                                      ? "bg-white/15 text-amber-300"
                                      : "bg-white/5 text-on-dark hover:bg-white/10",
                                  )}
                                >
                                  <Icon className="size-4.5 shrink-0 text-amber-300" />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-sm font-bold">{item.label}</span>
                                      {item.badge && (
                                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="line-clamp-1 text-xs text-on-dark-muted">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Sticky Drawer Conversion Footer */}
          <div className="shell relative shrink-0 border-t border-white/15 bg-green-deep/95 py-4 backdrop-blur-md">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Link
                to="/membership"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-md transition-transform active:scale-[0.99]"
              >
                <Users className="size-4.5" />
                <span>Become a Member (36 States)</span>
              </Link>
              <Link
                to="/donate"
                onClick={() => setMobileOpen(false)}
                className="btn-shine flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-red via-brand-red to-brand-red-bright px-4 py-3 text-sm font-extrabold text-white shadow-lift ring-1 ring-white/30 transition-transform active:scale-[0.99]"
              >
                <Heart className="size-4.5 fill-white" />
                <span>Donate Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
