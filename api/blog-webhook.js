// Vercel Serverless Function - Blog Webhook for outrank.so
// This endpoint receives blog posts from outrank.so and processes them

// Validate Bearer token
function validateAccessToken(req) {
  const ACCESS_TOKEN = process.env.OUTRANK_ACCESS_TOKEN;
  
  if (!ACCESS_TOKEN) {
    console.error('OUTRANK_ACCESS_TOKEN environment variable not set');
    return false;
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  
  const token = authHeader.split(" ")[1];
  return token === ACCESS_TOKEN;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Validate access token
    if (!validateAccessToken(req)) {
      return res.status(401).json({ 
        error: 'Invalid access token',
        message: 'Authentication failed. Please check your Bearer token.'
      });
    }
    
    // Get the webhook payload
    const payload = req.body;
    
    // Validate event type
    if (payload.event_type !== 'publish_articles') {
      return res.status(400).json({ 
        error: 'Bad request',
        message: `Unsupported event type: ${payload.event_type}`,
        supported: ['publish_articles']
      });
    }
    
    // Validate payload structure
    if (!payload.data || !payload.data.articles || !Array.isArray(payload.data.articles)) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Invalid payload structure. Expected data.articles array.'
      });
    }
    
    // Log the received webhook
    console.log('Received outrank.so webhook:', {
      event_type: payload.event_type,
      timestamp: payload.timestamp,
      article_count: payload.data.articles.length,
      articles: payload.data.articles.map(a => ({ id: a.id, title: a.title, slug: a.slug }))
    });
    
    // Process each article
    const processedArticles = payload.data.articles.map(article => {
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content_html: article.content_html,
        content_markdown: article.content_markdown,
        excerpt: article.meta_description,
        image: article.image_url,
        imageAlt: article.title,
        tags: article.tags,
        created_at: article.created_at,
        date: article.created_at ? article.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        category: article.tags && article.tags[0] ? article.tags[0] : 'Blog',
        readTime: estimateReadTime(article.content_markdown || article.content_html),
        featured: true
      };
    });
    
    // Return success response
    return res.status(200).json({ 
      success: true,
      message: 'Webhook processed successfully',
      received_at: new Date().toISOString(),
      event_type: payload.event_type,
      articles_processed: processedArticles.length,
      articles: processedArticles.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        date: a.date
      })),
      next_steps: processedArticles.map(a => ({
        article: a.title,
        instructions: [
          `1. Create directory: blog/${a.slug}/`,
          `2. Create blog post HTML file: blog/${a.slug}/index.html`,
          `3. Add entry to blog/blog-posts.json`,
          `4. Update sitemap.xml`,
          `5. Deploy to production`
        ]
      }))
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      type: error.name
    });
  }
}

// Helper function to estimate read time
function estimateReadTime(content) {
  if (!content) return '5 min read';
  
  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  
  // Average reading speed: 200-250 words per minute
  const minutes = Math.ceil(wordCount / 225);
  const minTime = Math.max(1, Math.floor(minutes * 0.8));
  const maxTime = Math.ceil(minutes * 1.2);
  
  if (minTime === maxTime) {
    return `${minTime} min read`;
  }
  return `${minTime}-${maxTime} min read`;
}

