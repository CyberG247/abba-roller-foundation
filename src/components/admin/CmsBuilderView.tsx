import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  CalendarClock,
  Copy,
  Eye,
  FileText,
  Film,
  Globe,
  History,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { CmsBlockRenderer } from "@/components/admin/CmsBlockRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  addMediaAsset,
  createCmsPage,
  deleteCmsPage,
  deleteMediaAsset,
  loadCmsNav,
  loadCmsPages,
  loadMediaAssets,
  publishCmsPage,
  rollbackCmsPageVersion,
  saveCmsNav,
  saveCmsPage,
  scheduleCmsPage,
  type CmsBlock,
  type CmsBlockType,
  type CmsNavEntry,
  type CmsPage,
  type MediaAsset,
} from "@/data/admin/cmsStore";
import { appendAuditLog, getRoleProfile, hasPermission, type AdminRole } from "@/data/admin/rbac";
import type { NavGroup } from "@/data/navigation";
import { compressPassportPhoto, copyToClipboard } from "@/lib/utils";

interface CmsBuilderViewProps {
  activeRole: AdminRole;
  initialSubTab?: "pages" | "navigation" | "media" | undefined;
}

const BLOCK_TYPE_OPTIONS: { type: CmsBlockType; label: string; desc: string }[] = [
  { type: "hero", label: "Hero Banner", desc: "Eyebrow, mission headline & dual CTAs" },
  {
    type: "rich_split",
    label: "Rich-Text & Media Split",
    desc: "Editorial copy paired with field photo",
  },
  {
    type: "media_video",
    label: "Gallery / Video Player",
    desc: "YouTube/Vimeo/MP4 video or multi-photo grid",
  },
  {
    type: "impact_reports",
    label: "Impact Counters & PDFs",
    desc: "Stat counters & downloadable audit dossiers",
  },
  {
    type: "cta_banner",
    label: "Call-to-Action Banner",
    desc: "High-contrast directional action strip",
  },
];

export function CmsBuilderView({ activeRole, initialSubTab = "pages" }: CmsBuilderViewProps) {
  const [subTab, setSubTab] = useState<"pages" | "navigation" | "media">(initialSubTab);
  const [pages, setPages] = useState<CmsPage[]>(() => loadCmsPages());
  const [navEntries, setNavEntries] = useState<CmsNavEntry[]>(() => loadCmsNav());
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => loadMediaAssets());

  const [selectedPageId, setSelectedPageId] = useState<string>(
    () => loadCmsPages()[0]?.id ?? "page-scholarship-2026",
  );
  const [draftPage, setDraftPage] = useState<CmsPage | null>(() => loadCmsPages()[0] ?? null);
  const [previewMode, setPreviewMode] = useState(false);
  const [versionsSheetOpen, setVersionsSheetOpen] = useState(false);

  // Create Page dialog
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newNavLabel, setNewNavLabel] = useState("");
  const [newSeoDesc, setNewSeoDesc] = useState("");
  const [newNavGroup, setNewNavGroup] = useState<NavGroup["id"]>("initiatives");

  // Schedule Publish dialog
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("2026-12-01T09:00");

  // Media Picker / Upload
  const [mediaFolderFilter, setMediaFolderFilter] = useState<string>("All");
  const [mediaSearch, setMediaSearch] = useState("");
  const [pickerTarget, setPickerTarget] = useState<{
    blockId: string;
    field: "bg" | "split" | "gallery";
  } | null>(null);
  const [addMediaOpen, setAddMediaOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "pdf">("video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTags, setMediaTags] = useState("documentary, impact");

  useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    const target = pages.find((p) => p.id === selectedPageId) ?? pages[0] ?? null;
    setDraftPage(target ? (JSON.parse(JSON.stringify(target)) as CmsPage) : null);
  }, [selectedPageId, pages]);

  const roleProfile = getRoleProfile(activeRole);
  const canEdit = hasPermission(activeRole, "cms:edit");
  const canPublish = hasPermission(activeRole, "cms:publish");
  const canManageMedia = hasPermission(activeRole, "media:manage");

  const filteredMedia = useMemo(() => {
    const q = mediaSearch.trim().toLowerCase();
    return mediaAssets.filter((asset) => {
      if (mediaFolderFilter !== "All" && asset.folder !== mediaFolderFilter) return false;
      if (!q) return true;
      return (
        asset.title.toLowerCase().includes(q) || asset.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [mediaAssets, mediaFolderFilter, mediaSearch]);

  const handleAddBlock = (type: CmsBlockType) => {
    if (!draftPage || !canEdit) return;
    const id = `blk-${Date.now()}`;
    const defaultImg = mediaAssets.find((m) => m.type === "image")?.url ?? "";

    let newBlock: CmsBlock;
    switch (type) {
      case "hero":
        newBlock = {
          id,
          type: "hero",
          eyebrow: "Abba Roller Foundation · Initiative",
          heading: "Headline for Community Programme",
          subheading: "Summarize mandate, target Nigerian states, and community objective.",
          primaryCtaLabel: "Become a Member",
          primaryCtaHref: "/membership",
          backgroundImageUrl: defaultImg,
        };
        break;
      case "rich_split":
        newBlock = {
          id,
          type: "rich_split",
          eyebrow: "Field Methodology",
          heading: "Verified Direct Delivery",
          body: "Explain eligibility criteria, ward coordination, and accountability milestones.",
          imageUrl: defaultImg,
          imagePosition: "right",
          bulletPoints: [
            "Zero-middleman delivery to verified recipients",
            "Public outcome reporting",
          ],
        };
        break;
      case "media_video":
        newBlock = {
          id,
          type: "media_video",
          heading: "Field Video & Visual Documentation",
          caption: "Watch verified field footage or review recent distribution photographs.",
          mode: "video",
          videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
          galleryUrls: defaultImg ? [defaultImg] : [],
        };
        break;
      case "impact_reports":
        newBlock = {
          id,
          type: "impact_reports",
          heading: "Verified Outcomes & Downloadable Reports",
          counters: [
            { label: "Target Beneficiaries", value: "500+", note: "Northern Nigeria" },
            { label: "Applicant Fee", value: "₦0", note: "100% Free Access" },
          ],
          pdfReports: [
            {
              title: "Programme Operational Guidelines (PDF)",
              year: "2026",
              fileSize: "1.2 MB",
              url: "/impact",
            },
          ],
        };
        break;
      case "cta_banner":
        newBlock = {
          id,
          type: "cta_banner",
          heading: "Stand With ARF Communities Today",
          body: "Register as a citizen member across 36 states or contribute directly via Polaris Bank.",
          buttonLabel: "Open Donation Portal",
          buttonHref: "/donate",
          tone: "green",
        };
        break;
    }

    setDraftPage({
      ...draftPage,
      blocks: [...draftPage.blocks, newBlock],
    });
    toast.success(`Added ${type.replace("_", " ")} block.`);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    if (!draftPage || !canEdit) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= draftPage.blocks.length) return;
    const copy = [...draftPage.blocks];
    const [removed] = copy.splice(index, 1);
    if (!removed) return;
    copy.splice(nextIndex, 0, removed);
    setDraftPage({ ...draftPage, blocks: copy });
  };

  const removeBlock = (blockId: string) => {
    if (!draftPage || !canEdit) return;
    setDraftPage({
      ...draftPage,
      blocks: draftPage.blocks.filter((b) => b.id !== blockId),
    });
  };

  const updateBlock = (blockId: string, updater: (prev: CmsBlock) => CmsBlock) => {
    if (!draftPage || !canEdit) return;
    setDraftPage({
      ...draftPage,
      blocks: draftPage.blocks.map((b) => (b.id === blockId ? updater(b) : b)),
    });
  };

  const handleSaveDraft = () => {
    if (!draftPage || !canEdit) return;
    const updatedPages = saveCmsPage(
      { ...draftPage, updatedBy: roleProfile.actorName },
      `Saved draft (${draftPage.blocks.length} blocks)`,
    );
    setPages(updatedPages);
    appendAuditLog({
      role: activeRole,
      action: "CMS_DRAFT_SAVED",
      entityType: "CmsPage",
      entityId: draftPage.slug,
      summary: `Saved CMS draft for '${draftPage.title}' (${draftPage.blocks.length} blocks).`,
    });
    toast.success("CMS draft & version snapshot saved.");
  };

  const handlePublishLive = () => {
    if (!draftPage || !canPublish) {
      toast.error("Your active RBAC role allows drafting only. Switch to Super Admin to publish.");
      return;
    }
    saveCmsPage({ ...draftPage, updatedBy: roleProfile.actorName }, "Pre-publish snapshot");
    const updatedPages = publishCmsPage(draftPage.id, roleProfile.actorName);
    setPages(updatedPages);
    setNavEntries(loadCmsNav());
    appendAuditLog({
      role: activeRole,
      action: "CMS_PAGE_PUBLISHED",
      entityType: "CmsPage",
      entityId: draftPage.slug,
      summary: `Published CMS page '${draftPage.title}' live.`,
    });
    toast.success(`Published "${draftPage.title}" live to the website.`);
  };

  const handleSchedulePublish = () => {
    if (!draftPage || !canPublish) return;
    saveCmsPage({ ...draftPage, updatedBy: roleProfile.actorName }, "Scheduled publish snapshot");
    const updatedPages = scheduleCmsPage(draftPage.id, scheduledDate, roleProfile.actorName);
    setPages(updatedPages);
    setScheduleOpen(false);
    appendAuditLog({
      role: activeRole,
      action: "CMS_PAGE_SCHEDULED",
      entityType: "CmsPage",
      entityId: draftPage.slug,
      summary: `Scheduled '${draftPage.title}' for auto-publish at ${scheduledDate}.`,
    });
    toast.success(`Scheduled publish for ${scheduledDate}.`);
  };

  const handleRollback = (versionId: string, versionNum: number) => {
    if (!draftPage || !canPublish) return;
    const updatedPages = rollbackCmsPageVersion(draftPage.id, versionId, roleProfile.actorName);
    setPages(updatedPages);
    setVersionsSheetOpen(false);
    appendAuditLog({
      role: activeRole,
      action: "CMS_VERSION_ROLLBACK",
      entityType: "CmsPage",
      entityId: draftPage.slug,
      summary: `Rolled back '${draftPage.title}' to Version v${versionNum}.`,
    });
    toast.success(`Rolled back "${draftPage.title}" to Version v${versionNum}.`);
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !newTitle.trim()) return;
    const created = createCmsPage({
      title: newTitle.trim(),
      slug: newSlug.trim() || newTitle.trim(),
      navLabel: newNavLabel.trim() || newTitle.trim(),
      seoDescription:
        newSeoDesc.trim() || "Official Abba Roller Foundation initiative information page.",
      navGroup: newNavGroup,
      updatedBy: roleProfile.actorName,
    });
    setPages(loadCmsPages());
    setSelectedPageId(created.id);
    setCreatePageOpen(false);
    setNewTitle("");
    setNewSlug("");
    setNewNavLabel("");
    setNewSeoDesc("");
    appendAuditLog({
      role: activeRole,
      action: "CMS_PAGE_CREATED",
      entityType: "CmsPage",
      entityId: created.slug,
      summary: `Created custom no-code CMS page '/p/${created.slug}'.`,
    });
    toast.success(`Created custom page draft at /p/${created.slug}`);
  };

  const handleSaveNavChanges = () => {
    if (!canPublish) {
      toast.error("Content Editors cannot alter live site navigation; Super Admin role required.");
      return;
    }
    const saved = saveCmsNav(navEntries);
    setNavEntries(saved);
    appendAuditLog({
      role: activeRole,
      action: "CMS_NAV_UPDATED",
      entityType: "CmsNav",
      entityId: "primary-nav",
      summary: `Updated live website navigation schema (${saved.filter((n) => n.visible).length} visible destinations).`,
    });
    toast.success("Public SiteHeader navigation schema updated live.");
  };

  const moveNavItem = (index: number, direction: -1 | 1) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= navEntries.length) return;
    const copy = [...navEntries];
    const [item] = copy.splice(index, 1);
    if (!item) return;
    copy.splice(nextIdx, 0, item);
    setNavEntries(copy.map((n, i) => ({ ...n, order: i + 1 })));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !canManageMedia) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        continue;
      }
      try {
        const compressed = await compressPassportPhoto(file);
        const created = addMediaAsset({
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: "image",
          url: compressed,
          folder: "Field Relief",
          tags: ["uploaded", "field"],
          sizeLabel: `${Math.round(file.size / 1024)} KB · Optimized`,
          uploadedBy: roleProfile.actorName,
        });
        setMediaAssets(loadMediaAssets());
        appendAuditLog({
          role: activeRole,
          action: "MEDIA_UPLOADED",
          entityType: "MediaAsset",
          entityId: created.id,
          summary: `Uploaded & compressed image '${created.title}' to Media Library.`,
        });
        toast.success(`Uploaded "${created.title}" to Media Library.`);
      } catch {
        toast.error(`Failed to process ${file.name}.`);
      }
    }
  };

  const handleAddExternalMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaUrl.trim() || !canManageMedia) return;
    const created = addMediaAsset({
      title: mediaTitle.trim(),
      type: mediaType,
      url: mediaUrl.trim(),
      folder: "Video & Reports",
      tags: mediaTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sizeLabel: mediaType === "video" ? "External Video Stream" : "External PDF Link",
      uploadedBy: roleProfile.actorName,
    });
    setMediaAssets(loadMediaAssets());
    setAddMediaOpen(false);
    setMediaTitle("");
    setMediaUrl("");
    appendAuditLog({
      role: activeRole,
      action: "MEDIA_REGISTERED",
      entityType: "MediaAsset",
      entityId: created.id,
      summary: `Registered ${mediaType.toUpperCase()} asset '${created.title}'.`,
    });
    toast.success(`Added "${created.title}" to Media Library.`);
  };

  return (
    <div className="space-y-6">
      {/* Sub-module Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
        <div className="inline-flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setSubTab("pages")}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
              subTab === "pages"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutTemplate className="size-4" />
            <span>Page &amp; Block Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("navigation")}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
              subTab === "navigation"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="size-4" />
            <span>Navigation Manager</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("media")}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all sm:text-sm ${
              subTab === "media"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="size-4" />
            <span>Media Library ({mediaAssets.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!canEdit && (
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
              Read-Only Mode for {roleProfile.label}
            </Badge>
          )}
          {canEdit && !canPublish && (
            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-800">
              Editor Role: Draft Only (Publishing Locked)
            </Badge>
          )}
        </div>
      </div>

      {/* =================================================== SUB-TAB 1: PAGE & BLOCK BUILDER */}
      {subTab === "pages" && (
        <div className="grid gap-6 xl:grid-cols-[290px_1fr]">
          {/* Left Page Directory */}
          <Card className="h-fit border-slate-200 bg-white shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">Website Pages</CardTitle>
              <Button
                type="button"
                size="sm"
                disabled={!canEdit}
                onClick={() => setCreatePageOpen(true)}
                className="min-h-9 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <Plus className="mr-1 size-3.5" />
                New Page
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {pages.map((p) => {
                const selected = draftPage?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPageId(p.id)}
                    className={`w-full cursor-pointer rounded-md border p-3 text-left transition-all ${
                      selected
                        ? "border-emerald-600 bg-emerald-50/70"
                        : "border-slate-100 bg-slate-50/60 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-bold text-slate-900">
                        {p.navLabel}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase ${
                          p.status === "published"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : p.status === "scheduled"
                              ? "border-sky-200 bg-sky-50 text-sky-800"
                              : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
                      {p.isBuiltIn ? `Core Route (${p.slug})` : `/p/${p.slug}`}
                    </p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Right Block Editor & Live Preview Canvas */}
          {draftPage && (
            <div className="space-y-4">
              {/* Workflow Toolbar */}
              <Card className="border-slate-200 bg-white shadow-xs">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-bold text-slate-900">
                        {draftPage.title}
                      </h2>
                      {!draftPage.isBuiltIn && draftPage.status === "published" && (
                        <Link
                          to="/p/$slug"
                          params={{ slug: draftPage.slug }}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 hover:underline"
                        >
                          <Globe className="size-3" />
                          <span>Open /p/{draftPage.slug}</span>
                        </Link>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Last saved by <strong>{draftPage.updatedBy}</strong> ·{" "}
                      {draftPage.blocks.length} content blocks
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-md bg-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-bold ${
                          !previewMode ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        <Pencil className="size-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-bold ${
                          previewMode ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        <Eye className="size-3.5" />
                        <span>Live Preview</span>
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setVersionsSheetOpen(true)}
                      className="min-h-9 gap-1.5 text-xs"
                    >
                      <History className="size-3.5" />
                      <span>History ({draftPage.versions.length})</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canEdit}
                      onClick={handleSaveDraft}
                      className="min-h-9 gap-1.5 text-xs font-bold"
                    >
                      <Save className="size-3.5" />
                      <span>Save Draft</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canPublish}
                      onClick={() => setScheduleOpen(true)}
                      className="min-h-9 gap-1.5 text-xs"
                    >
                      <CalendarClock className="size-3.5" />
                      <span>Schedule</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={!canPublish}
                      onClick={handlePublishLive}
                      className="min-h-9 gap-1.5 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Send className="size-3.5" />
                      <span>Publish Live</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Edit vs Live Preview Body */}
              {previewMode ? (
                <Card className="overflow-hidden border-slate-300 bg-white shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-2 text-xs text-slate-200">
                    <span className="font-mono">
                      LIVE CMS PREVIEW ·{" "}
                      {draftPage.isBuiltIn ? draftPage.slug : `/p/${draftPage.slug}`}
                    </span>
                    <Badge className="bg-emerald-700 text-white">Interactive Render</Badge>
                  </div>
                  <CmsBlockRenderer blocks={draftPage.blocks} compactPreview />
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Page SEO & Metadata Box */}
                  <Card className="border-slate-200 bg-white shadow-xs">
                    <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Page Title</Label>
                        <Input
                          value={draftPage.title}
                          disabled={!canEdit}
                          onChange={(e) => setDraftPage({ ...draftPage, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">
                          Navigation Label &amp; URL Slug
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={draftPage.navLabel}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraftPage({ ...draftPage, navLabel: e.target.value })
                            }
                          />
                          {!draftPage.isBuiltIn && (
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              title="Delete custom page"
                              disabled={!canPublish}
                              onClick={() => {
                                const remaining = deleteCmsPage(draftPage.id);
                                setPages(remaining);
                                setSelectedPageId(remaining[0]?.id ?? "");
                                toast.success(`Deleted custom page '${draftPage.title}'.`);
                              }}
                              className="shrink-0 text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs font-bold text-slate-700">
                          SEO Meta Description
                        </Label>
                        <Input
                          value={draftPage.seoDescription}
                          disabled={!canEdit}
                          onChange={(e) =>
                            setDraftPage({ ...draftPage, seoDescription: e.target.value })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Modular Block Stack */}
                  {draftPage.blocks.map((block, index) => (
                    <Card key={block.id} className="border-slate-200 bg-white shadow-xs">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <Layers className="size-4 text-emerald-700" />
                          <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                            Block {index + 1}: {block.type.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={!canEdit || index === 0}
                            onClick={() => moveBlock(index, -1)}
                            title="Move block up"
                          >
                            <ArrowUp className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={!canEdit || index === draftPage.blocks.length - 1}
                            onClick={() => moveBlock(index, 1)}
                            title="Move block down"
                          >
                            <ArrowDown className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={!canEdit}
                            onClick={() => removeBlock(block.id)}
                            className="text-rose-600 hover:bg-rose-50"
                            title="Remove block"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 p-4">
                        {block.type === "hero" && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Eyebrow Label</Label>
                              <Input
                                value={block.eyebrow}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "hero" ? { ...b, eyebrow: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Primary CTA Label &amp; Link</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={block.primaryCtaLabel}
                                  disabled={!canEdit}
                                  onChange={(e) =>
                                    updateBlock(block.id, (b) =>
                                      b.type === "hero"
                                        ? { ...b, primaryCtaLabel: e.target.value }
                                        : b,
                                    )
                                  }
                                />
                                <Input
                                  value={block.primaryCtaHref}
                                  disabled={!canEdit}
                                  placeholder="/membership"
                                  className="w-36 font-mono text-xs"
                                  onChange={(e) =>
                                    updateBlock(block.id, (b) =>
                                      b.type === "hero"
                                        ? { ...b, primaryCtaHref: e.target.value }
                                        : b,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Hero Headline</Label>
                              <Input
                                value={block.heading}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "hero" ? { ...b, heading: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Subheading</Label>
                              <Textarea
                                value={block.subheading}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "hero" ? { ...b, subheading: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                              <Input
                                value={block.backgroundImageUrl || ""}
                                disabled={!canEdit}
                                placeholder="Background image URL..."
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "hero"
                                      ? { ...b, backgroundImageUrl: e.target.value }
                                      : b,
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canEdit}
                                onClick={() => setPickerTarget({ blockId: block.id, field: "bg" })}
                              >
                                Pick Media
                              </Button>
                            </div>
                          </div>
                        )}

                        {block.type === "rich_split" && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Section Eyebrow</Label>
                              <Input
                                value={block.eyebrow}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "rich_split" ? { ...b, eyebrow: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Image Alignment</Label>
                              <select
                                value={block.imagePosition}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "rich_split"
                                      ? { ...b, imagePosition: e.target.value as "left" | "right" }
                                      : b,
                                  )
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                              >
                                <option value="right">Image on Right</option>
                                <option value="left">Image on Left</option>
                              </select>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Section Heading</Label>
                              <Input
                                value={block.heading}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "rich_split" ? { ...b, heading: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Editorial Copy</Label>
                              <Textarea
                                value={block.body}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "rich_split" ? { ...b, body: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Key Bullet Points (One per line)</Label>
                              <Textarea
                                value={block.bulletPoints.join("\n")}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "rich_split"
                                      ? {
                                          ...b,
                                          bulletPoints: e.target.value
                                            .split("\n")
                                            .filter((l) => l.trim().length > 0),
                                        }
                                      : b,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                              <Input
                                value={block.imageUrl}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "rich_split"
                                      ? { ...b, imageUrl: e.target.value }
                                      : b,
                                  )
                                }
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canEdit}
                                onClick={() =>
                                  setPickerTarget({ blockId: block.id, field: "split" })
                                }
                              >
                                Pick Image
                              </Button>
                            </div>
                          </div>
                        )}

                        {block.type === "media_video" && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Block Heading</Label>
                              <Input
                                value={block.heading}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "media_video"
                                      ? { ...b, heading: e.target.value }
                                      : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Display Mode</Label>
                              <select
                                value={block.mode}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "media_video"
                                      ? { ...b, mode: e.target.value as "gallery" | "video" }
                                      : b,
                                  )
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                              >
                                <option value="video">
                                  Embedded Video (YouTube / Vimeo / MP4)
                                </option>
                                <option value="gallery">Multi-Photo Field Gallery</option>
                              </select>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Caption</Label>
                              <Input
                                value={block.caption}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "media_video"
                                      ? { ...b, caption: e.target.value }
                                      : b,
                                  )
                                }
                              />
                            </div>
                            {block.mode === "video" ? (
                              <div className="space-y-1 sm:col-span-2">
                                <Label className="text-xs">
                                  Video URL (YouTube, Vimeo, or Direct .mp4)
                                </Label>
                                <Input
                                  value={block.videoUrl || ""}
                                  disabled={!canEdit}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  onChange={(e) =>
                                    updateBlock(block.id, (b) =>
                                      b.type === "media_video"
                                        ? { ...b, videoUrl: e.target.value }
                                        : b,
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                                <span className="text-xs text-slate-600">
                                  {block.galleryUrls.length} gallery image(s) attached
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  disabled={!canEdit}
                                  onClick={() =>
                                    setPickerTarget({ blockId: block.id, field: "gallery" })
                                  }
                                >
                                  Add Photo from Media Library
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {block.type === "impact_reports" && (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Block Heading</Label>
                              <Input
                                value={block.heading}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "impact_reports"
                                      ? { ...b, heading: e.target.value }
                                      : b,
                                  )
                                }
                              />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {block.counters.map((cnt, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="space-y-1.5 rounded-md border border-slate-100 bg-slate-50 p-2.5"
                                >
                                  <Input
                                    value={cnt.value}
                                    disabled={!canEdit}
                                    placeholder="Value e.g. 500+"
                                    className="font-bold"
                                    onChange={(e) =>
                                      updateBlock(block.id, (b) =>
                                        b.type === "impact_reports"
                                          ? {
                                              ...b,
                                              counters: b.counters.map((c, idx) =>
                                                idx === cIdx ? { ...c, value: e.target.value } : c,
                                              ),
                                            }
                                          : b,
                                      )
                                    }
                                  />
                                  <Input
                                    value={cnt.label}
                                    disabled={!canEdit}
                                    placeholder="Counter Label"
                                    onChange={(e) =>
                                      updateBlock(block.id, (b) =>
                                        b.type === "impact_reports"
                                          ? {
                                              ...b,
                                              counters: b.counters.map((c, idx) =>
                                                idx === cIdx ? { ...c, label: e.target.value } : c,
                                              ),
                                            }
                                          : b,
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {block.type === "cta_banner" && (
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">CTA Heading</Label>
                              <Input
                                value={block.heading}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "cta_banner" ? { ...b, heading: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Banner Theme</Label>
                              <select
                                value={block.tone}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "cta_banner"
                                      ? { ...b, tone: e.target.value as "green" | "navy" | "red" }
                                      : b,
                                  )
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                              >
                                <option value="green">Forest Green</option>
                                <option value="navy">Executive Navy</option>
                                <option value="red">Foundation Red</option>
                              </select>
                            </div>
                            <div className="space-y-1 sm:col-span-3">
                              <Label className="text-xs">Supporting Message</Label>
                              <Input
                                value={block.body}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "cta_banner" ? { ...b, body: e.target.value } : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Button Label</Label>
                              <Input
                                value={block.buttonLabel}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "cta_banner"
                                      ? { ...b, buttonLabel: e.target.value }
                                      : b,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">Destination Route / URL</Label>
                              <Input
                                value={block.buttonHref}
                                disabled={!canEdit}
                                onChange={(e) =>
                                  updateBlock(block.id, (b) =>
                                    b.type === "cta_banner"
                                      ? { ...b, buttonHref: e.target.value }
                                      : b,
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Block Palette */}
                  {canEdit && (
                    <Card className="border-dashed border-slate-300 bg-slate-50/70">
                      <CardContent className="p-4">
                        <p className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                          + Insert Reusable UI Block
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {BLOCK_TYPE_OPTIONS.map((opt) => (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => handleAddBlock(opt.type)}
                              className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 text-left transition-all hover:border-emerald-600 hover:shadow-xs"
                            >
                              <p className="text-xs font-bold text-slate-900">{opt.label}</p>
                              <p className="mt-0.5 text-[11px] text-slate-500">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =================================================== SUB-TAB 2: NAVIGATION MANAGER */}
      {subTab === "navigation" && (
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-col gap-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Public Top-Level Navigation Schema Manager
              </CardTitle>
              <p className="text-xs text-slate-500">
                Rename, reorder, reassign dropdown domain, or toggle live visibility across the
                decoupled public website header.
              </p>
            </div>
            <Button
              type="button"
              disabled={!canPublish}
              onClick={handleSaveNavChanges}
              className="min-h-10 bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <Send className="mr-1.5 size-3.5" />
              Save Live Navigation
            </Button>
          </CardHeader>

          <CardContent className="divide-y divide-slate-100 p-0">
            {navEntries.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!canPublish || idx === 0}
                      onClick={() => moveNavItem(idx, -1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!canPublish || idx === navEntries.length - 1}
                      onClick={() => moveNavItem(idx, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                  </div>

                  <Input
                    value={item.label}
                    disabled={!canPublish}
                    onChange={(e) =>
                      setNavEntries((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, label: e.target.value } : n)),
                      )
                    }
                    className="w-48 text-xs font-bold"
                  />

                  <select
                    aria-label={`Navigation domain for ${item.label}`}
                    value={item.group}
                    disabled={!canPublish}
                    onChange={(e) =>
                      setNavEntries((prev) =>
                        prev.map((n) =>
                          n.id === item.id ? { ...n, group: e.target.value as NavGroup["id"] } : n,
                        ),
                      )
                    }
                    className="h-9 rounded-md border border-input bg-background px-2.5 text-xs"
                  >
                    <option value="initiatives">Initiatives</option>
                    <option value="network">Network</option>
                    <option value="accountability">Accountability</option>
                    <option value="foundation">Foundation</option>
                  </select>

                  <span className="font-mono text-xs text-slate-500">{item.to}</span>
                  {item.isCustomPage && (
                    <Badge className="bg-emerald-50 text-[10px] text-emerald-800">
                      CMS Custom Page
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-slate-600">
                    {item.visible ? "Visible" : "Hidden"}
                  </span>
                  <Switch
                    checked={item.visible}
                    disabled={!canPublish}
                    onCheckedChange={(checked) =>
                      setNavEntries((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, visible: checked } : n)),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =================================================== SUB-TAB 3: MEDIA LIBRARY */}
      {subTab === "media" && (
        <div className="space-y-6">
          {/* Drag-and-Drop Uploader + External Video/PDF Trigger */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-6">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <label
                  htmlFor="cms-media-dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    void handleFileUpload(e.dataTransfer.files);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-emerald-600 hover:bg-emerald-50/30"
                >
                  <UploadCloud className="size-8 text-emerald-700" />
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    Drag &amp; drop field images here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Auto-optimized JPEG compression for S3/R2 CDN preview (PNG, JPG, WebP)
                  </p>
                  <input
                    id="cms-media-dropzone"
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={!canManageMedia}
                    onChange={(e) => void handleFileUpload(e.target.files)}
                    className="sr-only"
                  />
                </label>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Embed Videos &amp; Audited PDFs
                  </p>
                  <p className="text-xs text-slate-600">
                    Register YouTube, Vimeo, direct MP4 field documentaries, or published Foundation
                    audit PDFs cleanly in the centralized asset catalog.
                  </p>
                  <Button
                    type="button"
                    disabled={!canManageMedia}
                    onClick={() => setAddMediaOpen(true)}
                    className="min-h-10 w-full bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Register Video / PDF Asset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {[
                "All",
                "Field Relief",
                "Schools & Youth",
                "Hospitals & Legal",
                "Video & Reports",
              ].map((folder) => (
                <button
                  key={folder}
                  type="button"
                  onClick={() => setMediaFolderFilter(folder)}
                  className={`min-h-9 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    mediaFolderFilter === folder
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>
            <Input
              type="search"
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
              placeholder="Search media by title or tag..."
              className="max-w-xs"
            />
          </div>

          {/* Asset Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMedia.map((asset) => (
              <Card key={asset.id} className="overflow-hidden border-slate-200 bg-white shadow-xs">
                <div className="relative aspect-[16/10] bg-slate-100">
                  {asset.type === "image" ? (
                    <img src={asset.url} alt={asset.title} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-slate-900 text-white">
                      {asset.type === "video" ? (
                        <Film className="size-8 text-amber-400" />
                      ) : (
                        <FileText className="size-8 text-emerald-400" />
                      )}
                      <span className="mt-2 font-mono text-[11px] uppercase">{asset.type}</span>
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-slate-900/85 text-[10px] text-white">
                    {asset.folder}
                  </Badge>
                </div>

                <CardContent className="space-y-2 p-3.5">
                  <p className="truncate text-xs font-bold text-slate-900">{asset.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {asset.sizeLabel} · {asset.uploadedAt}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-xs bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        const ok = await copyToClipboard(asset.url);
                        if (ok) toast.success("Asset reference copied.");
                      }}
                      className="h-8 gap-1 px-2 text-[11px] font-semibold"
                    >
                      <Copy className="size-3" />
                      Copy Ref
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!canManageMedia}
                      onClick={() => {
                        setMediaAssets(deleteMediaAsset(asset.id));
                        toast.success(`Removed "${asset.title}" from Media Library.`);
                      }}
                      className="size-8 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* VERSION HISTORY & ROLLBACK SHEET */}
      <Sheet open={versionsSheetOpen} onOpenChange={setVersionsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>CMS Version History &amp; Rollback</SheetTitle>
            <SheetDescription>
              Restore any prior block &amp; SEO snapshot with one click.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3">
            {draftPage?.versions.length === 0 ? (
              <p className="rounded-md bg-slate-50 p-4 text-xs text-slate-500">
                Save or publish a draft to create your first version snapshot.
              </p>
            ) : (
              draftPage?.versions.map((ver) => (
                <div
                  key={ver.versionId}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">Version v{ver.versionNumber}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {ver.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-slate-600">{ver.note}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {ver.savedBy} · {ver.savedAt.slice(0, 16).replace("T", " ")}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!canPublish}
                    onClick={() => handleRollback(ver.versionId, ver.versionNumber)}
                    className="mt-3 h-8 w-full gap-1.5 text-xs font-bold"
                  >
                    <RotateCcw className="size-3.5" />
                    Restore v{ver.versionNumber}
                  </Button>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* MEDIA PICKER MODAL FOR BLOCK EDITOR */}
      <Dialog
        open={pickerTarget !== null}
        onOpenChange={(open) => {
          if (!open) setPickerTarget(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Media Asset</DialogTitle>
            <DialogDescription>
              Choose an optimized image from the Foundation CDN Media Library.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2 sm:grid-cols-3">
            {mediaAssets
              .filter((a) => a.type === "image")
              .map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    if (!pickerTarget) return;
                    updateBlock(pickerTarget.blockId, (b) => {
                      if (b.type === "hero" && pickerTarget.field === "bg") {
                        return { ...b, backgroundImageUrl: img.url };
                      }
                      if (b.type === "rich_split" && pickerTarget.field === "split") {
                        return { ...b, imageUrl: img.url };
                      }
                      if (b.type === "media_video" && pickerTarget.field === "gallery") {
                        return { ...b, galleryUrls: [...b.galleryUrls, img.url] };
                      }
                      return b;
                    });
                    setPickerTarget(null);
                    toast.success(`Attached "${img.title}".`);
                  }}
                  className="group cursor-pointer overflow-hidden rounded-md border border-slate-200 text-left hover:border-emerald-600"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <p className="truncate p-2 text-[11px] font-bold text-slate-800">{img.title}</p>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE NEW CMS PAGE DIALOG */}
      <Dialog open={createPageOpen} onOpenChange={setCreatePageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create No-Code Public Page</DialogTitle>
            <DialogDescription>
              Create a dedicated subpage accessible at <span className="font-mono">/p/slug</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePage} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Page Title *</Label>
              <Input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Women Enterprise Micro-Grant 2026"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL Slug *</Label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="women-micro-grant-2026"
                className="font-mono text-xs"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nav Menu Label</Label>
                <Input
                  value={newNavLabel}
                  onChange={(e) => setNewNavLabel(e.target.value)}
                  placeholder="Women Micro-Grant"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Top Nav Group</Label>
                <select
                  value={newNavGroup}
                  onChange={(e) => setNewNavGroup(e.target.value as NavGroup["id"])}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  <option value="initiatives">Initiatives</option>
                  <option value="network">Network</option>
                  <option value="accountability">Accountability</option>
                  <option value="foundation">Foundation</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>SEO Description</Label>
              <Textarea
                value={newSeoDesc}
                onChange={(e) => setNewSeoDesc(e.target.value)}
                placeholder="Brief summary for search results and dropdown tooltip..."
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreatePageOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-800 text-white hover:bg-emerald-700">
                Create Draft Page
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* SCHEDULE PUBLISH DIALOG */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Schedule Automatic Publish</DialogTitle>
            <DialogDescription>Select date and time to mark this page active.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Publish Timestamp</Label>
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSchedulePublish}
              className="bg-slate-900 text-white"
            >
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REGISTER EXTERNAL VIDEO / PDF DIALOG */}
      <Dialog open={addMediaOpen} onOpenChange={setAddMediaOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Video Link or Audit PDF</DialogTitle>
            <DialogDescription>
              Attach YouTube/Vimeo/MP4 streams or downloadable Foundation reports.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddExternalMedia} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Asset Title *</Label>
              <Input
                required
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                placeholder="e.g. Dutse Humanitarian Outreach Documentary"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Asset Type</Label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as "video" | "pdf")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="video">Video Stream (YouTube / Vimeo / MP4)</option>
                <option value="pdf">Audit Report / Guidelines PDF</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Asset URL *</Label>
              <Input
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input value={mediaTags} onChange={(e) => setMediaTags(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddMediaOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-800 text-white">
                Save Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
