// Dynamic RSS Feed Generator for Sunrise Roofing Blog
// Auto-generates feed from blog-posts.json

import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    // Read blog posts from JSON
    const blogPostsPath = join(process.cwd(), 'blog', 'blog-posts.json');
    const blogPostsData = readFileSync(blogPostsPath, 'utf8');
    const posts = JSON.parse(blogPostsData);

    // Filter only featured posts and sort by date (newest first)
    const featuredPosts = posts
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the latest post date for lastBuildDate
    const latestDate = featuredPosts.length > 0 
      ? new Date(featuredPosts[0].date) 
      : new Date();

    // Format date to RSS format (RFC 822)
    function toRSSDate(dateString) {
      const date = new Date(dateString);
      return date.toUTCString();
    }

    // Generate RSS XML
    const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Sunrise Roofing Blog</title>
  <link>https://roofwithsunrise.com/blog/</link>
  <description>Expert roofing advice and project updates from Tucson's trusted contractors</description>
  <language>en-US</language>
  <lastBuildDate>${toRSSDate(latestDate)}</lastBuildDate>
  <atom:link href="https://roofwithsunrise.com/feed.xml" rel="self" type="application/rss+xml" />
  ${featuredPosts.map(post => `
  <item>
    <title>${escapeXML(post.title)}</title>
    <link>https://roofwithsunrise.com/blog/${post.slug}/</link>
    <guid isPermaLink="true">https://roofwithsunrise.com/blog/${post.slug}/</guid>
    <pubDate>${toRSSDate(post.date)}</pubDate>
    <description><![CDATA[${post.excerpt}]]></description>
    <category>${escapeXML(post.category)}</category>
  </item>`).join('')}
</channel>
</rss>`;

    // Set headers for RSS feed
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.status(200).send(rssXML);

  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Fallback to basic error RSS
    const errorXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Sunrise Roofing Blog</title>
  <link>https://roofwithsunrise.com/blog/</link>
  <description>Error loading blog posts</description>
</channel>
</rss>`;
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(500).send(errorXML);
  }
}

// Helper function to escape XML special characters
function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}


