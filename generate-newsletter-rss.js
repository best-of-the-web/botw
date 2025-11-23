// generate-newsletter-rss.js
// Run by Netlify build (or manually with: node generate-newsletter-rss.js)

const fs = require("fs");
const path = require("path");

// CHANGE THIS to your real domain (no trailing slash)
const SITE_URL = "https://best-of-the-web.netlify.app"; // or your custom domain

const jsonPath = path.join(__dirname, "newsletter-index.json");
const rssPath = path.join(__dirname, "newsletter-rss.xml");

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function generateRss() {
  if (!fs.existsSync(jsonPath)) {
    console.error("newsletter-index.json not found, skipping RSS generation.");
    return;
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw);

  const issues = Array.isArray(data.issues) ? data.issues.slice() : [];

  // Sort newest first by date (YYYY-MM-DD) or fallback to id
  issues.sort((a, b) => {
    if (a.date && b.date) return String(b.date).localeCompare(String(a.date));
    return (b.id || 0) - (a.id || 0);
  });

  const latestIssues = issues.slice(0, 20); // cap at 20 items

  const itemsXml = latestIssues
    .map(issue => {
      const title = escapeXml(issue.title || `Issue #${issue.id}`);
      const link = `${SITE_URL}/newsletter.html?issue=${issue.id}`;
      const guid = link;
      const description = escapeXml(issue.intro || "");
      const pubDate = issue.date
        ? new Date(issue.date).toUTCString()
        : new Date().toUTCString();

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Greg's Best of the Web — Newsletter</title>
    <link>${SITE_URL}/newsletter.html</link>
    <description>Weekly picks: videos, tools, games, and links from Greg's Best of the Web.</description>
    <language>en-gb</language>${itemsXml}
  </channel>
</rss>
`;

  fs.writeFileSync(rssPath, rss.trim() + "\n", "utf8");
  console.log("Generated", rssPath);
}

generateRss();
