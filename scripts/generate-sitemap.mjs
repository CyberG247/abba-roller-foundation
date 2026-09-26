import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const siteDataPath = path.join(rootDir, "src", "data", "site.ts");
const publicDir = path.join(rootDir, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

// Default base domain if not overridden via env
const BASE_URL = (process.env.SITE_URL || "https://arffoundation.org").replace(/\/+$/, "");
const TODAY = new Date().toISOString().split("T")[0];

function extractBetween(str, startMarker, endMarker) {
  const start = str.indexOf(startMarker);
  if (start === -1) return "";
  const end = str.indexOf(endMarker, start);
  return end === -1 ? str.slice(start) : str.slice(start, end);
}

function parseSiteData() {
  const content = fs.readFileSync(siteDataPath, "utf8");

  const programsSection = extractBetween(content, "export const programs", "export type Campaign");
  const campaignsSection = extractBetween(content, "export const campaigns", "export type Story");
  const storiesSection = extractBetween(
    content,
    "export const stories",
    "export const impactMetrics",
  );

  const programSlugs = [...programsSection.matchAll(/slug:\s*["\x27]([^"\x27]+)["\x27]/g)].map(
    (m) => m[1],
  );
  const campaignSlugs = [...campaignsSection.matchAll(/slug:\s*["\x27]([^"\x27]+)["\x27]/g)].map(
    (m) => m[1],
  );

  const storyRegex = /slug:\s*["\x27]([^"\x27]+)["\x27][\s\S]*?date:\s*["\x27]([^"\x27]+)["\x27]/g;
  const stories = [...storiesSection.matchAll(storyRegex)].map((m) => ({
    slug: m[1],
    date: m[2],
  }));

  return { programSlugs, campaignSlugs, stories };
}

export function generateSitemap() {
  const { programSlugs, campaignSlugs, stories } = parseSiteData();

  const staticRoutes = [
    { path: "/", priority: "1.0", changefreq: "daily", lastmod: TODAY },
    { path: "/about", priority: "0.8", changefreq: "monthly", lastmod: TODAY },
    { path: "/founder", priority: "0.8", changefreq: "monthly", lastmod: TODAY },
    { path: "/work", priority: "0.8", changefreq: "weekly", lastmod: TODAY },
    { path: "/programs", priority: "0.9", changefreq: "weekly", lastmod: TODAY },
    { path: "/campaigns", priority: "0.9", changefreq: "weekly", lastmod: TODAY },
    { path: "/stories", priority: "0.9", changefreq: "daily", lastmod: TODAY },
    { path: "/impact", priority: "0.8", changefreq: "monthly", lastmod: TODAY },
    { path: "/get-involved", priority: "0.8", changefreq: "monthly", lastmod: TODAY },
    { path: "/volunteer", priority: "0.8", changefreq: "monthly", lastmod: TODAY },
    { path: "/membership", priority: "0.8", changefreq: "monthly", lastmod: TODAY },
    { path: "/donate", priority: "0.9", changefreq: "monthly", lastmod: TODAY },
    { path: "/gallery", priority: "0.7", changefreq: "weekly", lastmod: TODAY },
    { path: "/media", priority: "0.7", changefreq: "monthly", lastmod: TODAY },
    { path: "/partners", priority: "0.7", changefreq: "monthly", lastmod: TODAY },
    { path: "/contact", priority: "0.7", changefreq: "monthly", lastmod: TODAY },
    { path: "/privacy", priority: "0.3", changefreq: "yearly", lastmod: TODAY },
    { path: "/terms", priority: "0.3", changefreq: "yearly", lastmod: TODAY },
    { path: "/accessibility", priority: "0.3", changefreq: "yearly", lastmod: TODAY },
  ];

  const programRoutes = programSlugs.map((slug) => ({
    path: `/programs/${slug}`,
    priority: "0.8",
    changefreq: "monthly",
    lastmod: TODAY,
  }));

  const campaignRoutes = campaignSlugs.map((slug) => ({
    path: `/campaigns/${slug}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: TODAY,
  }));

  const storyRoutes = stories.map((story) => ({
    path: `/stories/${story.slug}`,
    priority: "0.8",
    changefreq: "monthly",
    lastmod: story.date || TODAY,
  }));

  const allUrls = [...staticRoutes, ...programRoutes, ...campaignRoutes, ...storyRoutes];

  const xmlEntries = allUrls
    .map(
      (entry) => `  <url>
    <loc>${BASE_URL}${entry.path === "/" ? "/" : entry.path}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>
`;

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemapXml.trim() + "\n", "utf8");
  console.log(`[sitemap] Successfully generated ${allUrls.length} URLs in ${sitemapPath}`);
}

generateSitemap();
