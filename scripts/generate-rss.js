#!/usr/bin/env node

/**
 * generate-rss.js
 * Reads episodes.json and generates a podcast-spec RSS feed (feed.xml)
 * Compatible with Apple Podcasts, Spotify, Google Podcasts, Overcast, etc.
 *
 * Run: node scripts/generate-rss.js
 * Output: public/feed.xml
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─────────────────────────────────────────────
// SHOW METADATA (mirrors src/data/show.js)
// ─────────────────────────────────────────────
const SHOW = {
  title: "AI Market Intel",
  subtitle: "Curated, Not Overwhelming",
  description:
    "Your weekly intelligence briefing on AI and content creation. " +
    "No hype. No jargon. Just curated insights for busy content marketers " +
    "and SMB professionals. Hosted by Lonnie Rodriguez of Q'd Up Agency.",
  author: "Lonnie Rodriguez",
  ownerName: "Q'd Up Agency",
  ownerEmail: "hello@qd-up.com", // Update with real contact
  language: "en",
  explicit: false,
  category: "Technology",
  subcategory: "Tech News",
  type: "episodic",

  // URLs — update siteUrl when custom domain is added
  siteUrl: "https://market-intel.netlify.app",
  feedPath: "/feed.xml",
  artworkPath: "/milogo.png",

  // Copyright
  copyright: `© ${new Date().getFullYear()} Q'd Up Agency`,
};

// ─────────────────────────────────────────────
// LOAD EPISODES
// ─────────────────────────────────────────────
const episodesPath = join(ROOT, "src/data/episodes.json");
const episodes = JSON.parse(readFileSync(episodesPath, "utf-8"));

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Convert "12:00" or "1:02:30" duration string to total seconds */
function durationToSeconds(dur) {
  const parts = dur.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

/** Estimate MP3 file size in bytes from duration (128kbps CBR) */
function estimateFileSize(durationStr) {
  const seconds = durationToSeconds(durationStr);
  return Math.round(seconds * 16000); // 128kbps = 16,000 bytes/sec
}

/** Format ISO date string to RFC 2822 (required by RSS spec) */
function toRFC2822(isoDate) {
  // Parse YYYY-MM-DD and assume 09:00 CST (15:00 UTC) — show publishes Wed 9am CST
  const d = new Date(isoDate + "T15:00:00Z");
  return d.toUTCString();
}

/** Escape XML special characters */
function escXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wrap content in CDATA */
function cdata(str) {
  return `<![CDATA[${str}]]>`;
}

// ─────────────────────────────────────────────
// BUILD EPISODE DESCRIPTION HTML
// ─────────────────────────────────────────────
function buildDescription(ep) {
  let html = `<p>${escXml(ep.description)}</p>`;
  html += `<p><strong>Topics:</strong> ${ep.tags.map(escXml).join(", ")}</p>`;
  html += `<p><a href="${SHOW.siteUrl}/episodes/${ep.id}">Full show notes, timestamps & sources →</a></p>`;
  return html;
}

// ─────────────────────────────────────────────
// GENERATE XML
// ─────────────────────────────────────────────
function generateFeed() {
  const feedUrl = SHOW.siteUrl + SHOW.feedPath;
  const artworkUrl = SHOW.siteUrl + SHOW.artworkPath;
  const now = new Date().toUTCString();

  const items = episodes
    .map((ep) => {
      if (!ep.links?.audio) return null; // Skip episodes without audio

      const pubDate = toRFC2822(ep.date);
      const fileSize = estimateFileSize(ep.duration);
      const episodeUrl = `${SHOW.siteUrl}/episodes/${ep.id}`;

      return `    <item>
      <title>${escXml(ep.title)}</title>
      <description>${cdata(buildDescription(ep))}</description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${escXml(ep.links.audio)}" length="${fileSize}" type="audio/mpeg"/>
      <guid isPermaLink="false">${ep.id}</guid>
      <link>${episodeUrl}</link>
      <itunes:title>${escXml(ep.title)}</itunes:title>
      <itunes:episode>${ep.num}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:duration>${ep.duration}</itunes:duration>
      <itunes:summary>${escXml(ep.description)}</itunes:summary>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${artworkUrl}"/>
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.apple.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${escXml(SHOW.title)}</title>
    <description>${cdata(SHOW.description)}</description>
    <link>${SHOW.siteUrl}</link>
    <language>${SHOW.language}</language>
    <copyright>${escXml(SHOW.copyright)}</copyright>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>

    <!-- iTunes / Apple Podcasts -->
    <itunes:title>${escXml(SHOW.title)}</itunes:title>
    <itunes:subtitle>${escXml(SHOW.subtitle)}</itunes:subtitle>
    <itunes:author>${escXml(SHOW.author)}</itunes:author>
    <itunes:summary>${cdata(SHOW.description)}</itunes:summary>
    <itunes:owner>
      <itunes:name>${escXml(SHOW.ownerName)}</itunes:name>
      <itunes:email>${escXml(SHOW.ownerEmail)}</itunes:email>
    </itunes:owner>
    <itunes:image href="${artworkUrl}"/>
    <itunes:category text="${escXml(SHOW.category)}">
      <itunes:category text="${escXml(SHOW.subcategory)}"/>
    </itunes:category>
    <itunes:explicit>${SHOW.explicit ? "true" : "false"}</itunes:explicit>
    <itunes:type>${SHOW.type}</itunes:type>

    <!-- Podcast Index namespace -->
    <podcast:locked>no</podcast:locked>

    <!-- Episodes -->
${items}
  </channel>
</rss>`;

  return xml;
}

// ─────────────────────────────────────────────
// WRITE FILE
// ─────────────────────────────────────────────
const outputDir = join(ROOT, "public");
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, "feed.xml");
const xml = generateFeed();
writeFileSync(outputPath, xml, "utf-8");

console.log(`✓ RSS feed generated: public/feed.xml`);
console.log(`  ${episodes.length} episodes`);
console.log(`  Feed URL: ${SHOW.siteUrl}${SHOW.feedPath}`);
