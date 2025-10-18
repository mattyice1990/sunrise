# How to Add New Blog Posts

Your blog is now **dynamic**! Here's how to add new posts:

## Step 1: Create the Blog Post HTML

Create a new folder in `/blog/` with your post slug:
```
blog/
  └── your-new-post-slug/
      └── index.html
```

## Step 2: Add Metadata to blog-posts.json

Open `/blog/blog-posts.json` and add your new post at the **top** of the array:

```json
[
  {
    "title": "Your New Blog Post Title",
    "slug": "your-new-post-slug",
    "excerpt": "A compelling 1-2 sentence description of your post.",
    "category": "Category Name",
    "categorySlug": "category-name",
    "image": "/path/to/featured-image.jpg",
    "imageAlt": "Alt text for the image",
    "date": "2025-10-19",
    "readTime": "5–7 min read",
    "featured": true
  },
  // ... existing posts
]
```

### Field Descriptions:

- **title**: The full title of your blog post
- **slug**: URL-friendly version (matches the folder name)
- **excerpt**: Short description shown on the card
- **category**: Display name for the category badge (e.g., "Homebuyer Guide")
- **categorySlug**: URL-friendly category (not currently used, but good for future filtering)
- **image**: Path to featured image (starts with `/`)
- **imageAlt**: Accessibility description of the image
- **date**: Publication date in YYYY-MM-DD format
- **readTime**: Estimated reading time
- **featured**: Set to `true` to show on blog index, `false` to hide

## Step 3: Save and Deploy

That's it! The blog index will automatically:
- ✅ Display your new post
- ✅ Sort posts by date (newest first)
- ✅ Show only featured posts
- ✅ Render with proper styling

## Optional: Update RSS Feed

If you maintain an RSS feed, also update `/feed.xml`:

```xml
<item>
  <title>Your New Blog Post Title</title>
  <link>https://roofwithsunrise.com/blog/your-new-post-slug/</link>
  <guid>https://roofwithsunrise.com/blog/your-new-post-slug/</guid>
  <pubDate>Sat, 19 Oct 2025 12:00:00 -0700</pubDate>
  <description><![CDATA[Your excerpt here]]></description>
</item>
```

## Testing Locally

To test before deploying:
1. Open `/blog/index.html` in a browser with a local server (required for JSON loading)
2. Verify your new post appears with correct image, title, and link
3. Click through to ensure the post page exists

---

**Pro Tip**: Keep the JSON file well-formatted for easy maintenance!

