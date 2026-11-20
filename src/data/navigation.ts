export type AppStaticRoute =
  | "/"
  | "/about"
  | "/accessibility"
  | "/admin"
  | "/campaigns"
  | "/chapters"
  | "/contact"
  | "/donate"
  | "/founder"
  | "/gallery"
  | "/get-involved"
  | "/impact"
  | "/legal-aid"
  | "/media"
  | "/membership"
  | "/partners"
  | "/privacy"
  | "/programs"
  | "/relief"
  | "/stories"
  | "/terms"
  | "/verify-id"
  | "/volunteer"
  | "/work";

export type NavIconKey =
  | "heart-handshake"
  | "scale"
  | "briefcase"
  | "users"
  | "map-pin"
  | "hand-heart"
  | "shield-check"
  | "bar-chart"
  | "newspaper"
  | "handshake"
  | "building"
  | "award"
  | "mail"
  | "camera";

export interface NavDestination {
  label: string;
  description: string;
  to: AppStaticRoute;
  hash?: string | undefined;
  badge?: string | undefined;
  icon: NavIconKey;
}

export interface NavGroup {
  id: "initiatives" | "network" | "accountability" | "foundation";
  label: string;
  tagline: string;
  items: readonly NavDestination[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: "initiatives",
    label: "Initiatives",
    tagline: "Frontline relief, legal defense & field programmes",
    items: [
      {
        label: "Relief Disbursements",
        description:
          "Multi-channel food aid, 10-state Ramadan relief, medical & Dutse outreach with eligibility criteria.",
        to: "/relief",
        badge: "Eligibility & Protocol",
        icon: "heart-handshake",
      },
      {
        label: "Pro Bono Legal Aid",
        description:
          "Free courtroom defense for indigent citizens, verified Nigerian Bar directory & advocate enrollment.",
        to: "/legal-aid",
        badge: "Lawyer Directory",
        icon: "scale",
      },
      {
        label: "Field Portfolio & Campaigns",
        description:
          "Documented volunteering activities, charity grants, and active focus campaigns across Nigeria.",
        to: "/work",
        icon: "briefcase",
      },
    ],
  },
  {
    id: "network",
    label: "Network",
    tagline: "Membership onboarding, chapters & volunteer service",
    items: [
      {
        label: "Nationwide Membership",
        description:
          "Register across all 36 states & FCT Abuja and download your verified digital ARF ID card.",
        to: "/membership",
        badge: "36 States + FCT",
        icon: "users",
      },
      {
        label: "Regional Chapters",
        description:
          "State & LGA coordination hubs across Jigawa, Kano, Northern relief corridor & FCT Abuja.",
        to: "/chapters",
        icon: "map-pin",
      },
      {
        label: "Volunteer Corps",
        description:
          "Apply for humanitarian field deployment, logistics support, and grassroots community service.",
        to: "/volunteer",
        icon: "hand-heart",
      },
      {
        label: "Check & Download ID",
        description:
          "Look up your verification status by registered phone number and download approved ID Cards or Slips.",
        to: "/verify-id",
        badge: "Phone Lookup",
        icon: "shield-check",
      },
    ],
  },
  {
    id: "accountability",
    label: "Accountability",
    tagline: "Verified metrics, field stories & institutional partners",
    items: [
      {
        label: "Verified Impact",
        description:
          "Published campaign figures, Jigawa–Kano corridor analytics, and reporting charter.",
        to: "/impact",
        icon: "bar-chart",
      },
      {
        label: "Field Stories & Media",
        description:
          "On-the-ground narratives, beneficiary dispatches, and confirmed Foundation updates.",
        to: "/stories",
        icon: "newspaper",
      },
      {
        label: "Photo Gallery",
        description:
          "Direct visual records from community distributions, schools, hospitals, and tournaments.",
        to: "/gallery",
        icon: "camera",
      },
      {
        label: "Strategic Partners",
        description: "Institutional, civic, and technology collaborators scaling community reach.",
        to: "/partners",
        icon: "handshake",
      },
    ],
  },
  {
    id: "foundation",
    label: "Foundation",
    tagline: "Governance, leadership & direct secretariat desk",
    items: [
      {
        label: "About ARF",
        description: "Institutional mission, vision, values, and approach to community trust.",
        to: "/about",
        icon: "building",
      },
      {
        label: "Founder's Desk",
        description:
          "Leadership dossier and civic mandate of Hon. Usman Aminu Usman (Abba Roller).",
        to: "/founder",
        icon: "award",
      },
      {
        label: "Contact & Helpdesk",
        description:
          "Reach our secretariat for relief referrals, partnerships, or chapter coordination.",
        to: "/contact",
        icon: "mail",
      },
    ],
  },
];

export type FooterLink =
  | {
      label: string;
      to: AppStaticRoute;
      hash?: string | undefined;
    }
  | {
      label: string;
      to: "/campaigns/$slug";
      params: { slug: string };
    };

export const FOOTER_COLUMNS: readonly {
  heading: string;
  links: readonly FooterLink[];
}[] = [
  {
    heading: "Initiatives",
    links: [
      { label: "Relief Disbursements", to: "/relief" },
      { label: "Eligibility & Protocol", to: "/relief", hash: "eligibility" },
      { label: "Weekly Community Feeding", to: "/relief", hash: "food-distribution" },
      { label: "10-State Ramadan Relief", to: "/relief", hash: "ramadan-support" },
      { label: "Dutse Special Education Aid", to: "/relief", hash: "dutse-outreach" },
      { label: "Pro Bono Legal Aid", to: "/legal-aid" },
      { label: "Verified Lawyer Directory", to: "/legal-aid", hash: "directory" },
      {
        label: "Pad Up Nigerian Girls",
        to: "/campaigns/$slug",
        params: { slug: "pad-up-nigerian-girls" },
      },
      { label: "Field Portfolio", to: "/work" },
    ],
  },
  {
    heading: "Network & Action",
    links: [
      { label: "Become a Member", to: "/membership" },
      { label: "Check & Download ID", to: "/verify-id" },
      { label: "Regional Chapters", to: "/chapters" },
      { label: "Volunteer Corps", to: "/volunteer" },
      { label: "Donate & Support", to: "/donate" },
      { label: "Verified Impact", to: "/impact" },
      { label: "Stories & Updates", to: "/stories" },
      { label: "Photo Gallery", to: "/gallery" },
      { label: "Media Dispatches", to: "/media" },
      { label: "Partner With Us", to: "/partners" },
    ],
  },
  {
    heading: "Foundation & Legal",
    links: [
      { label: "About ARF", to: "/about" },
      { label: "Founder's Desk", to: "/founder" },
      { label: "Contact & Referrals", to: "/contact" },
      { label: "Get Involved", to: "/get-involved" },
      { label: "Admin Console", to: "/admin" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Accessibility Statement", to: "/accessibility" },
    ],
  },
];
