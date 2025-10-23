// Vercel Serverless Function - Blog Webhook for outrank.so
// This endpoint receives blog posts from outrank.so and automatically publishes them

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

// GitHub API helper to commit files
async function commitToGitHub(filePath, content, message) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = 'mattyice1990';
  const GITHUB_REPO = 'sunrise';
  const GITHUB_BRANCH = 'main';
  
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable not set');
  }
  
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
  
  // Get current file SHA if it exists
  let sha = null;
  try {
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }
  } catch (e) {
    // File doesn't exist, that's okay
  }
  
  // Create or update the file
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha && { sha })
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${error.message}`);
  }
  
  return await response.json();
}

// Generate blog post HTML template
function generateBlogPostHTML(article) {
  const date = new Date(article.created_at);
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1351630159967766');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1351630159967766&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
    
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TXS7NL5W52');
    </script>
    
    <!-- Marketing Agent Website Tracking -->
    <script data-api-url="http://localhost:5000">
    (function() {
        'use strict';

        // Get API endpoint from script tag data attribute
        const scriptTag = document.currentScript;
        const ANALYTICS_API_BASE = scriptTag?.getAttribute('data-api-url') || 'http://localhost:5000';
        const ANALYTICS_API = \`\${ANALYTICS_API_BASE}/api/track-visit\`;

        // Generate unique session ID (UUID v4)
        function generateSessionId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // Get or create session ID with 30-minute rolling window
        function getSessionId() {
            let sessionId = localStorage.getItem('ma_session_id');
            let sessionStart = localStorage.getItem('ma_session_start');
            const now = Date.now();
            const sessionDuration = 30 * 60 * 1000; // 30 minutes

            // Create new session if none exists or if session expired
            if (!sessionId || !sessionStart || (now - parseInt(sessionStart)) > sessionDuration) {
                sessionId = generateSessionId();
                localStorage.setItem('ma_session_id', sessionId);
                localStorage.setItem('ma_session_start', now.toString());
            } else {
                // Update session start time (rolling window)
                localStorage.setItem('ma_session_start', now.toString());
            }

            return sessionId;
        }

        // Get UTM parameters from URL
        function getUTMParams() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                utm_source: urlParams.get('utm_source'),
                utm_medium: urlParams.get('utm_medium'),
                utm_campaign: urlParams.get('utm_campaign'),
                utm_content: urlParams.get('utm_content')
            };
        }

        // Track website visit
        function trackVisit() {
            const utmParams = getUTMParams();

            // Only track if we have UTM parameters from social media
            if (utmParams.utm_source && utmParams.utm_medium === 'social') {
                const sessionId = getSessionId();
                const trackingData = {
                    utm_source: utmParams.utm_source,
                    utm_medium: utmParams.utm_medium,
                    utm_campaign: utmParams.utm_campaign,
                    utm_content: utmParams.utm_content,
                    page_url: window.location.href,
                    session_id: sessionId,
                    timestamp: new Date().toISOString()
                };

                // Send to Marketing Agent analytics
                fetch(ANALYTICS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trackingData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        console.log('📊 Marketing Agent: Visit tracked from', utmParams.utm_source);
                    } else {
                        console.warn('Marketing Agent: Visit tracking failed -', data.message);
                    }
                })
                .catch(error => {
                    console.error('Marketing Agent: Could not track visit -', error.message);
                });
            }
        }

        // Track conversion (call this when someone fills out contact form)
        window.trackConversion = function(conversionType = 'contact_form') {
            const utmParams = getUTMParams();

            if (utmParams.utm_source && utmParams.utm_medium === 'social') {
                const sessionId = getSessionId();
                const conversionData = {
                    utm_source: utmParams.utm_source,
                    utm_campaign: utmParams.utm_campaign,
                    conversion_type: conversionType,
                    session_id: sessionId,
                    timestamp: new Date().toISOString()
                };

                fetch(\`\${ANALYTICS_API_BASE}/api/track-conversion\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(conversionData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        console.log('🎯 Marketing Agent: Conversion tracked from', utmParams.utm_source);
                    } else {
                        console.warn('Marketing Agent: Conversion tracking failed -', data.message);
                    }
                })
                .catch(error => {
                    console.error('Marketing Agent: Could not track conversion -', error.message);
                });
            }
        };

        // Track page view on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', trackVisit);
        } else {
            trackVisit();
        }

        // Auto-track contact form submissions
        document.addEventListener('submit', function(event) {
            if (event.target.matches('form[action*="contact"], form[action*="quote"], form[action*="inquiry"]')) {
                trackConversion('contact_form');
            }
        });

        // Auto-track phone number clicks
        document.addEventListener('click', function(event) {
            if (event.target.matches('a[href^="tel:"]')) {
                trackConversion('phone_call');
            }
        });

    })();
    </script>
    
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="${article.meta_description}">
    <meta name="theme-color" content="#F5A623">
    
    <title>${article.title}</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="../../SunriseLogo.jpeg">
    <link rel="apple-touch-icon" href="../../SunriseLogo.jpeg">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;600&family=Roboto:wght@400;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;600&family=Roboto:wght@400;700&display=swap" rel="stylesheet"></noscript>
    
    <!-- Critical inline CSS -->
    <style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#333;background:#fff}:root{--color-orange:#F5A623;--color-black:#1A1A1A;--color-gray:#666;--color-background-light:#f4f4f4}.site-header{background:#fff;position:sticky;top:0;z-index:1000}.top-bar{background:#F5F5F5;padding:10px 0;font-size:14px;border-bottom:1px solid #E0E0E0}.top-bar-container{max-width:1200px;margin:0 auto;padding:0 20px;display:flex;justify-content:flex-end;gap:30px;flex-wrap:wrap}.top-contact,.top-hours{color:#1A1A1A;text-decoration:none;transition:color 0.3s;font-weight:700;font-family:'Roboto',sans-serif;font-size:14px}.top-contact:hover{color:#D77A00}.top-social{color:#1877F2;font-size:18px;margin-left:15px;transition:all 0.3s;display:inline-flex;align-items:center}.top-social:hover{color:#0e5fc4;transform:scale(1.1)}.main-nav{background:white;box-shadow:0 2px 5px rgba(0,0,0,0.1)}.nav-container{max-width:1200px;margin:0 auto;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;position:relative}.logo{display:flex;align-items:center;text-decoration:none;margin-right:auto}.logo img{height:80px;width:auto;display:block}.nav-links{display:flex;gap:25px;list-style:none;align-items:center;margin:0;padding:0}.nav-links>li>a{font-family:'Roboto',sans-serif;font-size:16px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;text-decoration:none;color:#1A1A1A;transition:color 0.3s ease;padding:10px 5px;display:block}.nav-links>li>a:hover{color:#D77A00}.dropdown{position:relative;display:flex;align-items:center;gap:2px}.dropdown-header{display:flex;align-items:center;gap:2px;flex:1}.dropdown-label{font-family:'Roboto',sans-serif;font-size:16px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;color:#1A1A1A;padding:10px 5px;cursor:pointer;transition:color 0.3s ease}.dropdown-label:hover{color:#D77A00}.dropdown-link{font-family:'Roboto',sans-serif;font-size:16px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;color:#1A1A1A;text-decoration:none;padding:10px 5px;transition:color 0.3s ease}.dropdown-link:hover{color:#D77A00}.dropdown-toggle{font-family:'Roboto',sans-serif;font-size:16px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px;background:none;border:none;color:#1A1A1A;cursor:pointer;padding:10px 5px;display:flex;align-items:center;transition:color 0.3s ease}.dropdown-toggle:hover{color:#D77A00}.dropdown-arrow{font-size:10px;transition:transform 0.3s}.dropdown.active .dropdown-arrow{transform:rotate(180deg)}.dropdown-content{position:absolute;top:calc(100% + 2px);left:0;background:white;min-width:240px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border-radius:6px;padding:12px 0;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all 0.3s ease;z-index:1000}.dropdown-content::before{content:'';position:absolute;top:-10px;left:0;right:0;height:10px;background:transparent}.dropdown.active .dropdown-content{opacity:1;visibility:visible;transform:translateY(0)}.dropdown-content a{font-family:'Roboto',sans-serif;font-size:16px;font-weight:400;display:block;padding:12px 20px;color:#1A1A1A;text-decoration:none;transition:all 0.2s}.dropdown-content a:hover{background:#fef3e2;color:#D77A00;padding-left:25px}.cta-button{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:#D77A00!important;color:#FFFFFF!important;padding:12px 24px!important;border-radius:0;border:none;transition:all 0.3s ease}.cta-button:hover{background:#E89510!important;transform:translateY(-2px);box-shadow:0 4px 12px rgba(245,166,35,0.4)}.mobile-menu-toggle{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:5px;position:absolute;right:20px;top:50%;transform:translateY(-50%);z-index:1001}.mobile-menu-toggle span{width:25px;height:3px;background:#1A1A1A;transition:all 0.3s;border-radius:2px}@media(max-width:768px){.logo img{height:60px}.mobile-menu-toggle{display:flex}.nav-links{position:fixed;top:130px;left:0;width:100%;max-height:0;background:white;flex-direction:column;gap:0;padding:0;box-shadow:0 4px 12px rgba(0,0,0,0.1);transition:max-height 0.3s ease;overflow:hidden;z-index:999}.nav-links.active{max-height:calc(100vh - 130px);overflow-y:auto}.nav-links>li{width:100%;border-bottom:1px solid #E0E0E0}.dropdown{flex-direction:column;align-items:stretch}.dropdown-header{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;cursor:pointer;padding:0;gap:0}.dropdown-link{flex:0 0 auto;padding:15px 20px;text-align:left;cursor:pointer}.dropdown-label{flex:1;padding:15px 20px;text-align:left;min-width:0}.dropdown-toggle{padding:15px 20px;flex-shrink:0;margin-left:auto;pointer-events:auto}.nav-links>li>a{padding:15px 20px;width:100%;text-align:left;box-sizing:border-box}.dropdown-content{position:static;box-shadow:none;padding:0;opacity:1;visibility:visible;transform:none;max-height:0;overflow:hidden;transition:max-height 0.3s ease;background:#F5F5F5;width:100%}.dropdown.active .dropdown-content{max-height:500px;border-top:1px solid #E0E0E0}.dropdown-content a{padding:12px 20px 12px 40px;box-sizing:border-box}.cta-button{margin:10px 20px;text-align:center}}
    </style>
    
    <!-- Stylesheet -->
    <link rel="stylesheet" href="../../css/styles.css?v=20251019">
    
    <link rel="canonical" href="https://roofwithsunrise.com/blog/${article.slug}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.meta_description}">
    <meta property="og:url" content="https://roofwithsunrise.com/blog/${article.slug}">
    ${article.image_url ? `<meta property="og:image" content="${article.image_url}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">` : ''}
    <meta property="og:site_name" content="Sunrise Roofers LLC">

    <!-- JSON-LD BlogPosting -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${article.title}",
      "description": "${article.meta_description}",
      "datePublished": "${article.created_at}",
      "dateModified": "${article.created_at}",
      "author": {
        "@type": "Organization",
        "name": "Sunrise Roofers LLC"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sunrise Roofers LLC",
        "logo": {
          "@type": "ImageObject",
          "url": "https://roofwithsunrise.com/SunriseLogo.jpeg"
        }
      }${article.image_url ? `,
      "image": "${article.image_url}"` : ''},
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://roofwithsunrise.com/blog/${article.slug}"
      }
    }
    </script>
</head>
<body>
    <!-- Inline SVG Icon Sprites -->
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="icon-facebook" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></symbol>
        <symbol id="icon-google" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></symbol>
    </svg>
    
    <!-- Header with Navigation -->
    <header class="site-header">
        <div class="top-bar">
            <div class="top-bar-container">
                <a href="tel:520-668-6638" class="top-contact">📞 520-668-6638</a>
                <a href="mailto:sunriseroofer@outlook.com" class="top-contact">✉️ sunriseroofer@outlook.com</a>
                <span class="top-hours">🕒 Mon-Fri: 7AM-6PM, Sat 8AM-4PM</span>
                <a href="https://www.facebook.com/people/Sunrise-Roofers-LLC/61580211666613/" target="_blank" rel="noopener noreferrer" class="top-social" aria-label="Visit our Facebook page">
                    <svg class="icon" width="18" height="18"><use href="#icon-facebook"/></svg>
                </a>
                <a href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener noreferrer" class="top-social-google" aria-label="Visit our Google Business Profile">
                    <svg class="icon" width="18" height="18"><use href="#icon-google"/></svg>
                </a>
            </div>
        </div>
        
        <nav class="main-nav">
            <div class="nav-container">
                <a href="/" class="logo">
                    <img src="../../SunriseLogo.jpeg" alt="Sunrise Roofers LLC" width="200" height="200" loading="lazy">
                </a>
                
                <button class="mobile-menu-toggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    
                    <li class="dropdown">
                        <div class="dropdown-header">
                            <a href="/about-our-roofing-contractors-in-tucson" class="dropdown-link">About</a>
                            <button class="dropdown-toggle" aria-label="Toggle dropdown menu"><span class="dropdown-arrow">▼</span></button>
                        </div>
                        <div class="dropdown-content">
                            <a href="/why-choose-sunrise-roofers-in-tucson">Why Choose Us</a>
                            <a href="/gallery">Project Gallery</a>
                            <a href="/#testimonials">Customer Reviews</a>
                        </div>
                    </li>
                    
                    <li class="dropdown">
                        <div class="dropdown-header">
                            <a href="/roofing-services" class="dropdown-link">Services</a>
                            <button class="dropdown-toggle" aria-label="Toggle dropdown menu"><span class="dropdown-arrow">▼</span></button>
                        </div>
                        <div class="dropdown-content">
                            <a href="/residential-roofing-tucson">Residential Roofing</a>
                            <a href="/roofing-services/roof-repair-tucson">Roof Repair</a>
                            <a href="/roofing-services/roof-inspection">Roof Inspection</a>
                            <a href="/roofing-services/new-roof-tucson">Roof Replacement</a>
                            <a href="/roofing-services/shingle-roof-replacement-tucson">Shingle Roofing</a>
                            <a href="/roofing-services/concrete-tile-roof-replacement">Tile Roofing</a>
                            <a href="/roofing-services/metal-roofing-tucson">Metal Roofing</a>
                            <a href="/roofing-services/flat-roof-coating-tucson">Flat Roof Coating</a>
                        </div>
                    </li>
                    
                    <li class="dropdown">
                        <div class="dropdown-header">
                            <span class="dropdown-label">Service Areas</span>
                            <button class="dropdown-toggle" aria-label="Toggle dropdown menu"><span class="dropdown-arrow">▼</span></button>
                        </div>
                        <div class="dropdown-content">
                            <a href="/tucson-roofing-services">Tucson</a>
                            <a href="/marana-roofing">Marana</a>
                            <a href="/oro-valley-roofing">Oro Valley</a>
                            <a href="/catalina-foothills-roofing">Catalina Foothills</a>
                            <a href="/sahuarita-roofing">Sahuarita</a>
                            <a href="/green-valley-roofing">Green Valley</a>
                        </div>
                    </li>
                    
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/contact">Contact</a></li>
                    
                    <li><a href="/contact#estimate" class="cta-button">Free Estimate</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <article>
            <!-- Article Header -->
            <header style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); padding: 60px 40px; text-align: center;">
                <div style="max-width: 900px; margin: 0 auto;">
                    <h1 style="font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: #F5A623; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; line-height: 1.2;">${article.title}</h1>
                    <p style="font-size: 16px; color: rgba(255, 255, 255, 0.8); margin-bottom: 0;">By Sunrise Roofers LLC · ${formattedDate} · ${article.readTime}</p>
                </div>
            </header>

            ${article.image_url ? `<!-- Hero Image -->
            <div style="max-width: 800px; margin: 0 auto; padding: 0 40px;">
                <img
                    src="${article.image_url}"
                    alt="${article.imageAlt}"
                    loading="eager"
                    fetchpriority="high"
                    style="width: 100%; height: auto; display: block; border-radius: 8px;">
            </div>` : ''}

            <!-- Article Content -->
            <div style="max-width: 800px; margin: 0 auto; padding: 60px 40px;">
                ${article.content_html}

                <hr style="margin: 50px 0; border: none; border-top: 2px solid #E8E8E8;">

                <p style="font-size: 18px; line-height: 1.8; color: #333; margin-bottom: 25px;">
                    <strong>Need roofing services in Tucson?</strong> <a href="/contact" style="color: #F5A623; text-decoration: underline;">Request a free inspection</a> or call <a href="tel:+15206686638" style="color: #F5A623; text-decoration: underline;">520-668-6638</a>. Related pages: <a href="/roofing-services/roof-repair-tucson" style="color: #F5A623; text-decoration: underline;">Roof Repair</a> · <a href="/roofing-services/new-roof-tucson" style="color: #F5A623; text-decoration: underline;">Roof Replacement</a> · <a href="/tucson-roofing-services" style="color: #F5A623; text-decoration: underline;">Service Areas</a>.
                </p>

                <!-- Author Bio -->
                <div style="background: #fff; border: 2px solid #F5A623; border-radius: 8px; padding: 30px; margin: 50px 0;">
                    <p style="font-size: 16px; line-height: 1.7; color: #666; text-align: center; margin: 0;">
                        <strong style="color: #1A1A1A; font-size: 18px;">Published by Sunrise Roofers LLC</strong><br>
                        Licensed & Insured Roofing Contractor · Tucson, AZ
                    </p>
                </div>

            </div>
        </article>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Sunrise Roofers LLC</h3>
                <p>Licensed, bonded, and insured roofing contractor serving Greater Tucson, Arizona.</p>
                <p style="margin-top: 15px;"><a href="https://azroc.my.site.com/AZRoc/s/contractor-search?licenseId=a0ocs00000AArYMAA1" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;" title="Verify our license">ROC #358079</a></p>
            </div>
            <div class="footer-section footer-nav-section">
                <h3>Quick Links</h3>
                <ul class="footer-nav">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about-our-roofing-contractors-in-tucson">About</a></li>
                    <li><a href="/roofing-services">Services</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Service Areas</h3>
                <ul>
                    <li>Tucson, AZ</li>
                    <li>Oro Valley, AZ</li>
                    <li>Catalina Foothills, AZ</li>
                    <li>Vail, AZ</li>
                    <li>Sahuarita, AZ</li>
                    <li>Green Valley, AZ</li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact</h3>
                <ul>
                    <li><a href="tel:520-668-6638">📞 520-668-6638</a></li>
                    <li><a href="mailto:sunriseroofer@outlook.com">✉ sunriseroofer@outlook.com</a></li>
                    <li>📍 7320 N La Cholla Blvd Ste 154-276, Tucson, AZ 85741</li>
                    <li>🕒 Mon-Fri: 7AM-6PM</li>
                    <li>🕒 Sat: 8AM-4PM</li>
                    <li>🚨 Emergency Service Available</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Sunrise Roofers LLC. All rights reserved. | Licensed & Insured Roofing Contractor | <a href="/" style="color: #D0D0D0; text-decoration: underline;">Home</a> | Built by <a href="https://pursuitanalytics.com" target="_blank" style="color: #D77A00; text-decoration: underline; font-weight: 600;">Pursuit Analytics</a></p>
        </div>
    </footer>

    <!-- Main JavaScript -->
    <script defer src="../../js/main.min.js"></script>
    
    <!-- Analytics Scripts -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-TXS7NL5W52"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TXS7NL5W52');
    </script>
    
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "tqrdpuxath");
    </script>
</body>
</html>`;
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
  
  // Handle GET requests (for testing/verification)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Webhook endpoint is active',
      endpoint: '/api/blog-webhook',
      method: 'POST required for blog publishing',
      documentation: 'Send POST requests with outrank.so publish_articles event'
    });
  }
  
  // Only allow POST requests for actual webhook
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
      received_method: req.method,
      expected_method: 'POST'
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
    
    // Process each article and commit to GitHub
    const results = [];
    
    for (const article of payload.data.articles) {
      try {
        // Prepare article data
        const articleDate = article.created_at ? article.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
        const readTime = estimateReadTime(article.content_markdown || article.content_html);
        const category = article.tags && article.tags[0] ? article.tags[0] : 'Blog';
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
        
        const processedArticle = {
          id: article.id,
          title: article.title,
          slug: article.slug,
          content_html: article.content_html,
          meta_description: article.meta_description,
          image_url: article.image_url,
          imageAlt: article.title,
          created_at: article.created_at,
          date: articleDate,
          readTime: readTime,
          category: category,
          categorySlug: categorySlug
        };
        
        // 1. Create blog post HTML file
        const htmlContent = generateBlogPostHTML(processedArticle);
        await commitToGitHub(
          `blog/${article.slug}/index.html`,
          htmlContent,
          `Add blog post: ${article.title} (automated via outrank.so)`
        );
        
        // 2. Update blog-posts.json
        const blogPostsResponse = await fetch(`https://raw.githubusercontent.com/mattyice1990/sunrise/main/blog/blog-posts.json`);
        const currentBlogPosts = await blogPostsResponse.json();
        
        // Add new entry at the top
        const newEntry = {
          title: article.title,
          slug: article.slug,
          excerpt: article.meta_description,
          category: category,
          categorySlug: categorySlug,
          image: article.image_url || '/images/default-blog.jpg',
          imageAlt: article.title,
          date: articleDate,
          readTime: readTime,
          featured: true
        };
        
        // Check if slug already exists
        const existingIndex = currentBlogPosts.findIndex(p => p.slug === article.slug);
        if (existingIndex >= 0) {
          // Update existing
          currentBlogPosts[existingIndex] = newEntry;
        } else {
          // Add at top
          currentBlogPosts.unshift(newEntry);
        }
        
        await commitToGitHub(
          'blog/blog-posts.json',
          JSON.stringify(currentBlogPosts, null, 2) + '\n',
          `Update blog-posts.json: Add ${article.title} (automated via outrank.so)`
        );
        
        results.push({
          success: true,
          article: article.title,
          slug: article.slug,
          url: `https://roofwithsunrise.com/blog/${article.slug}`
        });
        
      } catch (error) {
        results.push({
          success: false,
          article: article.title,
          error: error.message
        });
      }
    }
    
    // Return success response
    return res.status(200).json({ 
      success: true,
      message: 'Blog posts published automatically',
      received_at: new Date().toISOString(),
      event_type: payload.event_type,
      articles_processed: results.length,
      results: results,
      deployment_note: 'Changes committed to GitHub. Vercel will auto-deploy in ~30 seconds.'
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

