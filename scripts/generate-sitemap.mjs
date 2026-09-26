import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

// Default canonical domain
const BASE_URL = (process.env.SITE_URL || "https://arffoundation.org").replace(/\/+$/, "");
const TODAY = new Date().toISOString().split("T")[0];

// Clean, high-value primary pages for Google indexing
const coreRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/founder", priority: "0.9", changefreq: "monthly" },
  { path: "/work", priority: "0.9", changefreq: "weekly" },
  { path: "/programs", priority: "0.9", changefreq: "weekly" },
  { path: "/campaigns", priority: "0.9", changefreq: "weekly" },
  { path: "/stories", priority: "0.9", changefreq: "daily" },
  { path: "/impact", priority: "0.8", changefreq: "monthly" },
  { path: "/get-involved", priority: "0.8", changefreq: "monthly" },
  { path: "/volunteer", priority: "0.8", changefreq: "monthly" },
  { path: "/membership", priority: "0.8", changefreq: "monthly" },
  { path: "/donate", priority: "0.9", changefreq: "monthly" },
  { path: "/gallery", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
];

export function generateSitemap() {
  const xmlEntries = coreRoutes
    .map(
      (entry) => `  <url>
    <loc>${BASE_URL}${entry.path === "/" ? "/" : entry.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemapXml.trim() + "\n", "utf8");
  console.log(
    `[sitemap] Generated clean sitemap with ${coreRoutes.length} core pages in ${sitemapPath}`,
  );
}

generateSitemap();
