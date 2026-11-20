import campaignPadUp from "@/assets/campaign-padup.jpg";
import correctionalOutreach from "@/assets/correctional-centre-outreach.jpg";
import footballTrophy from "@/assets/football-tournament-trophy-presentation.jpg";
import gumelHospital from "@/assets/gumel-hospital-outreach.jpg";
import heroGirls from "@/assets/hero-girls.jpg";
import programEducation from "@/assets/program-skills.jpg";
import ramadanBoxes from "@/assets/ramadan-food-packages-10-states.jpg";
import dutseSchoolSupplies from "@/assets/visually-impaired-school-dutse-supplies-display.jpg";
import weeklyFoodBeneficiaries from "@/assets/weekly-food-distribution-beneficiaries.jpg";
import { NAV_GROUPS, type AppStaticRoute, type NavGroup } from "@/data/navigation";

export type CmsBlockType = "hero" | "rich_split" | "media_video" | "impact_reports" | "cta_banner";

export interface CmsHeroBlock {
  id: string;
  type: "hero";
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string | undefined;
  secondaryCtaHref?: string | undefined;
  backgroundImageUrl?: string | undefined;
}

export interface CmsRichSplitBlock {
  id: string;
  type: "rich_split";
  eyebrow: string;
  heading: string;
  body: string;
  imageUrl: string;
  imagePosition: "left" | "right";
  bulletPoints: string[];
}

export interface CmsMediaVideoBlock {
  id: string;
  type: "media_video";
  heading: string;
  caption: string;
  mode: "gallery" | "video";
  videoUrl?: string | undefined;
  galleryUrls: string[];
}

export interface CmsImpactCounter {
  label: string;
  value: string;
  note?: string | undefined;
}

export interface CmsPdfReport {
  title: string;
  year: string;
  fileSize: string;
  url: string;
}

export interface CmsImpactReportsBlock {
  id: string;
  type: "impact_reports";
  heading: string;
  counters: CmsImpactCounter[];
  pdfReports: CmsPdfReport[];
}

export interface CmsCtaBannerBlock {
  id: string;
  type: "cta_banner";
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  tone: "green" | "navy" | "red";
}

export type CmsBlock =
  CmsHeroBlock | CmsRichSplitBlock | CmsMediaVideoBlock | CmsImpactReportsBlock | CmsCtaBannerBlock;

export type CmsPublishStatus = "draft" | "published" | "scheduled";

export interface CmsPageVersion {
  versionId: string;
  versionNumber: number;
  savedAt: string;
  savedBy: string;
  note: string;
  status: CmsPublishStatus;
  title: string;
  seoDescription: string;
  blocks: CmsBlock[];
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  navLabel: string;
  seoDescription: string;
  isBuiltIn: boolean;
  navGroup: NavGroup["id"];
  status: CmsPublishStatus;
  scheduledFor?: string | undefined;
  updatedAt: string;
  updatedBy: string;
  blocks: CmsBlock[];
  versions: CmsPageVersion[];
}

export interface CmsNavEntry {
  id: string;
  label: string;
  to: AppStaticRoute | `/p/${string}`;
  group: NavGroup["id"];
  visible: boolean;
  order: number;
  description: string;
  badge?: string | undefined;
  isCustomPage?: boolean | undefined;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: "image" | "video" | "pdf";
  url: string;
  folder: "Field Relief" | "Schools & Youth" | "Hospitals & Legal" | "Video & Reports";
  tags: string[];
  sizeLabel: string;
  uploadedAt: string;
  uploadedBy: string;
}

const PAGES_STORAGE_KEY = "arf_cms_pages_v1";
const NAV_STORAGE_KEY = "arf_cms_nav_v1";
const MEDIA_STORAGE_KEY = "arf_cms_media_v1";

const INITIAL_CMS_MEDIA: MediaAsset[] = [
  {
    id: "MED-2026-01",
    title: "Schoolgirls Empowerment Session Banner",
    type: "image",
    url: heroGirls,
    folder: "Schools & Youth",
    tags: ["hero", "education", "girls"],
    sizeLabel: "420 KB · JPEG",
    uploadedAt: "2026-10-14",
    uploadedBy: "Sadiq Danjuma",
  },
  {
    id: "MED-2026-02",
    title: "Pad Up Nigerian Girls Classroom Outreach",
    type: "image",
    url: campaignPadUp,
    folder: "Schools & Youth",
    tags: ["pad-up", "gumel", "health"],
    sizeLabel: "310 KB · JPEG",
    uploadedAt: "2026-10-18",
    uploadedBy: "Sadiq Danjuma",
  },
  {
    id: "MED-2026-03",
    title: "10-State Ramadan Relief Cartons & Meals",
    type: "image",
    url: ramadanBoxes,
    folder: "Field Relief",
    tags: ["ramadan", "food", "10-states"],
    sizeLabel: "485 KB · JPEG",
    uploadedAt: "2026-10-25",
    uploadedBy: "Hajiya Zainab Garba",
  },
  {
    id: "MED-2026-04",
    title: "Weekly Street Nutrition Hot Meals Handover",
    type: "image",
    url: weeklyFoodBeneficiaries,
    folder: "Field Relief",
    tags: ["weekly-feeding", "nutrition", "kano"],
    sizeLabel: "390 KB · JPEG",
    uploadedAt: "2026-11-02",
    uploadedBy: "Hajiya Zainab Garba",
  },
  {
    id: "MED-2026-05",
    title: "Dutse Visually Impaired School Care Supplies",
    type: "image",
    url: dutseSchoolSupplies,
    folder: "Schools & Youth",
    tags: ["dutse", "disability", "special-needs"],
    sizeLabel: "360 KB · JPEG",
    uploadedAt: "2026-11-06",
    uploadedBy: "Ibrahim Sani",
  },
  {
    id: "MED-2026-06",
    title: "Gumel General Hospital Patient Relief Visit",
    type: "image",
    url: gumelHospital,
    folder: "Hospitals & Legal",
    tags: ["hospital", "medical-debt", "gumel"],
    sizeLabel: "340 KB · JPEG",
    uploadedAt: "2026-11-10",
    uploadedBy: "Sadiq Danjuma",
  },
  {
    id: "MED-2026-07",
    title: "Correctional Facility Welfare & Legal Desk",
    type: "image",
    url: correctionalOutreach,
    folder: "Hospitals & Legal",
    tags: ["inmates", "custodial", "legal-aid"],
    sizeLabel: "355 KB · JPEG",
    uploadedAt: "2026-11-14",
    uploadedBy: "Barr. Aminu Kabir Dutse",
  },
  {
    id: "MED-2026-08",
    title: "Vocational Tailoring & Youth Skills Cohort",
    type: "image",
    url: programEducation,
    folder: "Schools & Youth",
    tags: ["bursary", "skills", "youth"],
    sizeLabel: "295 KB · JPEG",
    uploadedAt: "2026-11-16",
    uploadedBy: "Sadiq Danjuma",
  },
  {
    id: "MED-2026-09",
    title: "Grassroots Football Championship Cup Presentation",
    type: "image",
    url: footballTrophy,
    folder: "Schools & Youth",
    tags: ["sports", "gumel", "youth"],
    sizeLabel: "380 KB · JPEG",
    uploadedAt: "2026-11-17",
    uploadedBy: "Sadiq Danjuma",
  },
  {
    id: "MED-2026-10",
    title: "2026 Field Impact & Community Relief Documentary Reel",
    type: "video",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    folder: "Video & Reports",
    tags: ["video", "documentary", "field"],
    sizeLabel: "YouTube HD Embed",
    uploadedAt: "2026-11-18",
    uploadedBy: "Sadiq Danjuma",
  },
  {
    id: "MED-2026-11",
    title: "ARF 2026 Audited Relief & Student Bursary Dossier (PDF)",
    type: "pdf",
    url: "https://www.abbarollerfoundation.com.ng/impact",
    folder: "Video & Reports",
    tags: ["pdf", "audit", "bursary"],
    sizeLabel: "1.4 MB · PDF",
    uploadedAt: "2026-11-19",
    uploadedBy: "Hon. Usman Aminu Usman",
  },
];

const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: "page-scholarship-2026",
    slug: "scholarship-bursary-2026",
    title: "2026 Northern Student Bursary & Skills Grant Initiative",
    navLabel: "2026 Student Bursary",
    seoDescription:
      "Official Abba Roller Foundation student scholarship, WAEC/JAMB exam sponsorship, and vocational bursary programme across Nigerian public schools.",
    isBuiltIn: false,
    navGroup: "initiatives",
    status: "published",
    updatedAt: "2026-11-20T09:15:00Z",
    updatedBy: "Hon. Usman Aminu Usman",
    blocks: [
      {
        id: "blk-sb-1",
        type: "hero",
        eyebrow: "No-Code Program Portal · 2026 Academic Cycle",
        heading: "2026 Indigent Student Bursary & Exam Relief Programme",
        subheading:
          "Ensuring brilliant students from low-income families, visually impaired hostels, and rural LGAs complete secondary and tertiary education with dignity.",
        primaryCtaLabel: "Register for Chapter Endorsement",
        primaryCtaHref: "/membership",
        secondaryCtaLabel: "Inspect Relief Eligibility",
        secondaryCtaHref: "/relief",
        backgroundImageUrl: heroGirls,
      },
      {
        id: "blk-sb-2",
        type: "rich_split",
        eyebrow: "Direct Education Support",
        heading: "Removing Financial & Hygiene Barriers to School Attendance",
        body: "Working closely with public school principals across Jigawa, Kano, and partner northern states, ARF disburses direct examination fees, learning materials, and vocational toolkits without intermediaries.",
        imageUrl: programEducation,
        imagePosition: "right",
        bulletPoints: [
          "100% direct payment of examination & registration fees to public schools",
          "Priority slots for orphans, visually impaired pupils, and girl-child scholars",
          "Combined vocational tailoring and digital starter kits for post-secondary youth",
        ],
      },
      {
        id: "blk-sb-3",
        type: "impact_reports",
        heading: "2026 Allocation Counters & Audit Documentation",
        counters: [
          {
            label: "Target Student Scholars",
            value: "500+",
            note: "Across Jigawa, Kano & Kaduna corridors",
          },
          {
            label: "Sanitary & Dignity Packs",
            value: "1,200+",
            note: "Paired under Pad Up Nigerian Girls",
          },
          {
            label: "Dutse Special Education Aid",
            value: "100+ Pupils",
            note: "Residential hostel care & food relief",
          },
        ],
        pdfReports: [
          {
            title: "2026 Bursary Guidelines & School Endorsement Template",
            year: "2026",
            fileSize: "1.4 MB PDF",
            url: "/impact",
          },
          {
            title: "Dutse Visually Impaired School Four-Pillar Assessment",
            year: "2026",
            fileSize: "920 KB PDF",
            url: "/relief",
          },
        ],
      },
      {
        id: "blk-sb-4",
        type: "media_video",
        heading: "Classroom & Field Outreach Visual Record",
        caption:
          "Published field photography highlighting school outreach sessions and supply disbursements.",
        mode: "gallery",
        galleryUrls: [campaignPadUp, dutseSchoolSupplies, programEducation],
      },
      {
        id: "blk-sb-5",
        type: "cta_banner",
        heading: "Sponsor a Scholar or Nominate an Indigent Student",
        body: "School principals and verified LGA chapters can submit nominations directly through our helpdesk, or donors can fund bursary tranches via our Polaris Bank account.",
        buttonLabel: "Fund Student Support",
        buttonHref: "/donate",
        tone: "green",
      },
    ],
    versions: [
      {
        versionId: "ver-sb-2",
        versionNumber: 2,
        savedAt: "2026-11-20T09:15:00Z",
        savedBy: "Hon. Usman Aminu Usman",
        note: "Published with 2026 allocation counters & Dutse gallery",
        status: "published",
        title: "2026 Northern Student Bursary & Skills Grant Initiative",
        seoDescription:
          "Official Abba Roller Foundation student scholarship, WAEC/JAMB exam sponsorship, and vocational bursary programme across Nigerian public schools.",
        blocks: [],
      },
      {
        versionId: "ver-sb-1",
        versionNumber: 1,
        savedAt: "2026-11-18T12:10:00Z",
        savedBy: "Sadiq Danjuma",
        note: "Initial program structure draft",
        status: "draft",
        title: "2026 Student Bursary Initiative (Draft)",
        seoDescription: "Draft bursary guidelines for Abba Roller Foundation.",
        blocks: [
          {
            id: "blk-sb-draft-1",
            type: "hero",
            eyebrow: "Draft Preview",
            heading: "2026 Student Bursary & Skills Initiative",
            subheading: "Preliminary page layout prior to board sign-off.",
            primaryCtaLabel: "Contact Secretariat",
            primaryCtaHref: "/contact",
          },
        ],
      },
    ],
  },
  {
    id: "page-home-exec",
    slug: "home-executive-summary",
    title: "Executive Summary Homepage (/)",
    navLabel: "Home",
    seoDescription:
      "Abba Roller Foundation empowers youth and women in Nigeria through education, skills training, relief disbursements, and pro bono legal aid.",
    isBuiltIn: true,
    navGroup: "foundation",
    status: "published",
    updatedAt: "2026-11-20T09:00:00Z",
    updatedBy: "Hon. Usman Aminu Usman",
    blocks: [
      {
        id: "blk-home-1",
        type: "hero",
        eyebrow: "ARF · Jigawa, Kano & 10-State Corridor",
        heading: "Empowering youth and women. Strengthening communities.",
        subheading:
          "Decoupled high-impact executive summary routing citizens cleanly to multi-channel relief, pro bono legal aid, and nationwide membership.",
        primaryCtaLabel: "Become a Member",
        primaryCtaHref: "/membership",
        secondaryCtaLabel: "Explore Relief Programs",
        secondaryCtaHref: "/relief",
        backgroundImageUrl: heroGirls,
      },
      {
        id: "blk-home-2",
        type: "impact_reports",
        heading: "Verified Executive Trust Counters",
        counters: [
          { label: "Lives Reached", value: "15,400+", note: "Jigawa & Kano Corridor" },
          { label: "Ramadan Relief", value: "1,500+", note: "10 Northern States" },
          { label: "Weekly Nutrition", value: "250+", note: "Hot meals weekly" },
        ],
        pdfReports: [],
      },
    ],
    versions: [],
  },
  {
    id: "page-relief-portal",
    slug: "relief-portal",
    title: "Multi-Channel Relief Disbursements (/relief)",
    navLabel: "Relief Disbursements",
    seoDescription:
      "Beneficiary eligibility matrix, 4-step anti-diversion disbursement protocol, weekly meals, and 10-state Ramadan aid.",
    isBuiltIn: true,
    navGroup: "initiatives",
    status: "published",
    updatedAt: "2026-11-19T18:00:00Z",
    updatedBy: "Hajiya Zainab Garba",
    blocks: [
      {
        id: "blk-rel-1",
        type: "hero",
        eyebrow: "Zero-Middleman Disbursements",
        heading: "Direct Relief Disbursements & Eligibility",
        subheading:
          "Transparent eligibility standards for street children, widows, indigent hospital patients, and visually impaired pupils.",
        primaryCtaLabel: "Submit Community Nomination",
        primaryCtaHref: "/contact",
        backgroundImageUrl: ramadanBoxes,
      },
    ],
    versions: [],
  },
  {
    id: "page-legal-aid",
    slug: "legal-aid-portal",
    title: "Pro Bono Legal Aid & Advocate Directory (/legal-aid)",
    navLabel: "Pro Bono Legal Aid",
    seoDescription:
      "Free courtroom representation for indigent detainees and verified Nigerian Bar Association pro bono directory.",
    isBuiltIn: true,
    navGroup: "initiatives",
    status: "published",
    updatedAt: "2026-11-19T16:15:00Z",
    updatedBy: "Barr. Aminu Kabir Dutse",
    blocks: [
      {
        id: "blk-leg-1",
        type: "hero",
        eyebrow: "Access to Justice",
        heading: "Pro Bono Legal Aid & Verified Advocate Directory",
        subheading:
          "NBA-verified counsel volunteering courtroom representation for prolonged remand detainees and vulnerable families.",
        primaryCtaLabel: "Browse Advocate Directory",
        primaryCtaHref: "/legal-aid",
        backgroundImageUrl: correctionalOutreach,
      },
    ],
    versions: [],
  },
];

// Populate version 2 snapshot with actual initial blocks
INITIAL_CMS_PAGES[0]!.versions[0]!.blocks = INITIAL_CMS_PAGES[0]!.blocks;

function buildInitialNav(): CmsNavEntry[] {
  const entries: CmsNavEntry[] = [];
  let order = 1;
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      entries.push({
        id: `nav-${group.id}-${order}`,
        label: item.label,
        to: item.to,
        group: group.id,
        visible: true,
        order: order++,
        description: item.description,
        badge: item.badge,
        isCustomPage: false,
      });
    }
  }
  entries.push({
    id: "nav-custom-scholarship-2026",
    label: "2026 Student Bursary",
    to: "/p/scholarship-bursary-2026",
    group: "initiatives",
    visible: true,
    order: order++,
    description: "No-code program portal: WAEC/JAMB grants & vocational support.",
    badge: "New",
    isCustomPage: true,
  });
  return entries;
}

export function loadCmsPages(): CmsPage[] {
  if (typeof window === "undefined") return INITIAL_CMS_PAGES;
  try {
    const raw = localStorage.getItem(PAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(INITIAL_CMS_PAGES));
      return INITIAL_CMS_PAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as CmsPage[]) : INITIAL_CMS_PAGES;
  } catch {
    return INITIAL_CMS_PAGES;
  }
}

function persistCmsPages(pages: CmsPage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
    window.dispatchEvent(new Event("arf_cms_updated"));
  } catch {
    // ignore quota errors
  }
}

export function saveCmsPage(page: CmsPage, note = "Updated page blocks"): CmsPage[] {
  const current = loadCmsPages();
  const nextVersionNumber = (page.versions[0]?.versionNumber ?? page.versions.length) + 1;
  const newVersion: CmsPageVersion = {
    versionId: `ver-${Date.now()}`,
    versionNumber: nextVersionNumber,
    savedAt: new Date().toISOString(),
    savedBy: page.updatedBy,
    note,
    status: page.status,
    title: page.title,
    seoDescription: page.seoDescription,
    blocks: JSON.parse(JSON.stringify(page.blocks)) as CmsBlock[],
  };

  const updatedPage: CmsPage = {
    ...page,
    updatedAt: new Date().toISOString(),
    versions: [newVersion, ...page.versions].slice(0, 15),
  };

  const exists = current.some((p) => p.id === page.id);
  const nextPages = exists
    ? current.map((p) => (p.id === page.id ? updatedPage : p))
    : [updatedPage, ...current];

  persistCmsPages(nextPages);
  return nextPages;
}

export function createCmsPage(params: {
  title: string;
  slug: string;
  navLabel: string;
  seoDescription: string;
  navGroup: NavGroup["id"];
  updatedBy: string;
}): CmsPage {
  const cleanSlug = params.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const initialBlocks: CmsBlock[] = [
    {
      id: `blk-${Date.now()}-1`,
      type: "hero",
      eyebrow: "Abba Roller Foundation · Initiative",
      heading: params.title,
      subheading: params.seoDescription,
      primaryCtaLabel: "Become a Member",
      primaryCtaHref: "/membership",
      secondaryCtaLabel: "Support This Work",
      secondaryCtaHref: "/donate",
      backgroundImageUrl: heroGirls,
    },
    {
      id: `blk-${Date.now()}-2`,
      type: "rich_split",
      eyebrow: "Program Details",
      heading: "How This Initiative Operates",
      body: "Edit this block cleanly inside the CMS Builder to explain eligibility, regional schedules, and community partner expectations.",
      imageUrl: ramadanBoxes,
      imagePosition: "right",
      bulletPoints: [
        "Direct ward verification without intermediaries",
        "Coordinated by state & LGA chapter volunteers",
      ],
    },
  ];

  const newPage: CmsPage = {
    id: `page-${Date.now()}`,
    slug: cleanSlug || `initiative-${Date.now()}`,
    title: params.title.trim(),
    navLabel: params.navLabel.trim() || params.title.trim(),
    seoDescription: params.seoDescription.trim(),
    isBuiltIn: false,
    navGroup: params.navGroup,
    status: "draft",
    updatedAt: new Date().toISOString(),
    updatedBy: params.updatedBy,
    blocks: initialBlocks,
    versions: [],
  };

  saveCmsPage(newPage, "Created new no-code page draft");
  return loadCmsPages().find((p) => p.id === newPage.id) ?? newPage;
}

export function publishCmsPage(pageId: string, actorName: string): CmsPage[] {
  const pages = loadCmsPages();
  const target = pages.find((p) => p.id === pageId);
  if (!target) return pages;

  const published: CmsPage = {
    ...target,
    status: "published",
    scheduledFor: undefined,
    updatedBy: actorName,
  };
  const next = saveCmsPage(published, "Published live to public website");

  if (!target.isBuiltIn) {
    const nav = loadCmsNav();
    const targetPath: `/p/${string}` = `/p/${target.slug}`;
    if (!nav.some((n) => n.to === targetPath)) {
      saveCmsNav([
        ...nav,
        {
          id: `nav-custom-${target.slug}`,
          label: target.navLabel,
          to: targetPath,
          group: target.navGroup,
          visible: true,
          order: nav.length + 1,
          description: target.seoDescription,
          badge: "CMS",
          isCustomPage: true,
        },
      ]);
    }
  }
  return next;
}

export function scheduleCmsPage(
  pageId: string,
  scheduledFor: string,
  actorName: string,
): CmsPage[] {
  const pages = loadCmsPages();
  const target = pages.find((p) => p.id === pageId);
  if (!target) return pages;
  return saveCmsPage(
    {
      ...target,
      status: "scheduled",
      scheduledFor,
      updatedBy: actorName,
    },
    `Scheduled auto-publish for ${scheduledFor}`,
  );
}

export function rollbackCmsPageVersion(
  pageId: string,
  versionId: string,
  actorName: string,
): CmsPage[] {
  const pages = loadCmsPages();
  const target = pages.find((p) => p.id === pageId);
  if (!target) return pages;
  const version = target.versions.find((v) => v.versionId === versionId);
  if (!version) return pages;

  return saveCmsPage(
    {
      ...target,
      title: version.title,
      seoDescription: version.seoDescription,
      blocks: JSON.parse(JSON.stringify(version.blocks)) as CmsBlock[],
      updatedBy: actorName,
    },
    `Rolled back cleanly to Version v${version.versionNumber}`,
  );
}

export function deleteCmsPage(pageId: string): CmsPage[] {
  const next = loadCmsPages().filter((p) => p.id !== pageId || p.isBuiltIn);
  persistCmsPages(next);
  return next;
}

export function getPublishedCustomPages(): CmsPage[] {
  return loadCmsPages().filter((p) => !p.isBuiltIn && p.status === "published");
}

export function getPublishedPageBySlug(slug: string): CmsPage | null {
  return (
    loadCmsPages().find(
      (p) => p.slug === slug && (p.status === "published" || p.status === "scheduled"),
    ) ?? null
  );
}

export function loadCmsNav(): CmsNavEntry[] {
  const baseline = buildInitialNav();
  if (typeof window === "undefined") return baseline;
  try {
    const raw = localStorage.getItem(NAV_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(baseline));
      return baseline;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as CmsNavEntry[]).sort((a, b) => a.order - b.order)
      : baseline;
  } catch {
    return baseline;
  }
}

export function saveCmsNav(items: CmsNavEntry[]): CmsNavEntry[] {
  const normalized = items.map((item, idx) => ({ ...item, order: idx + 1 }));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(normalized));
      window.dispatchEvent(new Event("arf_cms_updated"));
    } catch {
      // ignore
    }
  }
  return normalized;
}

export function loadMediaAssets(): MediaAsset[] {
  if (typeof window === "undefined") return INITIAL_CMS_MEDIA;
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_CMS_MEDIA));
      return INITIAL_CMS_MEDIA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as MediaAsset[])
      : INITIAL_CMS_MEDIA;
  } catch {
    return INITIAL_CMS_MEDIA;
  }
}

export function addMediaAsset(asset: Omit<MediaAsset, "id" | "uploadedAt">): MediaAsset {
  const item: MediaAsset = {
    ...asset,
    id: `MED-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 89)}`,
    uploadedAt: new Date().toISOString().slice(0, 10),
  };
  const updated = [item, ...loadMediaAssets()];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_cms_updated"));
    } catch {
      // ignore
    }
  }
  return item;
}

export function deleteMediaAsset(id: string): MediaAsset[] {
  const updated = loadMediaAssets().filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("arf_cms_updated"));
    } catch {
      // ignore
    }
  }
  return updated;
}
