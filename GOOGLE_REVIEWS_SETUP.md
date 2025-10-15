# Google Reviews Banner Setup Guide

This guide will help you set up the Google Reviews Banner on your Vercel deployment.

## 📋 What's Been Added

### New Files Created:
1. **`/api/reviews.js`** - Vercel serverless function to fetch reviews securely
2. **`/js/google-reviews-banner.js`** - Vanilla JavaScript component for the reviews banner
3. **`/css/google-reviews-banner.css`** - Styles for the reviews banner
4. **`.env.local`** - Local environment variables (⚠️ DO NOT commit this file)

### Modified Files:
1. **`index.html`** - Updated testimonials section with new Google Reviews Banner
2. **`css/styles.css`** - Added responsive styles for new layout

## 🚀 Deployment Steps

### Step 1: Verify .gitignore

The `.env.local` file should NOT be committed to your repository. Verify it's in your `.gitignore`:

```bash
# Check if .env.local is ignored
grep -q ".env.local" .gitignore && echo "✓ .env.local is ignored" || echo "✗ Add .env.local to .gitignore"
```

### Step 2: Configure Vercel Environment Variable

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **roofwithsunrise.com**
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Key**: `GOOGLE_PLACES_API_KEY`
   - **Value**: `AIzaSyBvvwXnVB5WxLjHG091gU0R-uOBodS8pMM`
   - **Environment**: Check all (Production, Preview, Development)
5. Click **Save**

### Step 3: Commit and Deploy

```bash
# Add the new files (excluding .env.local)
git add api/ js/google-reviews-banner.js css/google-reviews-banner.css
git add index.html css/styles.css GOOGLE_REVIEWS_SETUP.md

# Commit the changes
git commit -m "Add Google Reviews Banner to testimonials section"

# Push to trigger Vercel deployment
git push origin main
```

### Step 4: Verify Deployment

After Vercel deploys your changes:

1. Visit your website at https://roofwithsunrise.com
2. Scroll down to the "What Our Customers Say" section
3. You should see:
   - A two-column layout on desktop (credibility text on left, Google rating badge on right)
   - A full-width slow-scrolling Google Reviews banner below
4. The banner should show reviews with Google branding

## 🔍 How It Works

### Architecture

```
Browser Request
     ↓
JavaScript calls /api/reviews
     ↓
Vercel Serverless Function (reviews.js)
     ↓
Google Places API (with secure API key)
     ↓
Reviews returned to browser
     ↓
Rendered in animated banner
```

### Security

✅ **API Key is Server-Side Only**
- The Google Places API key is stored in Vercel environment variables
- It's never exposed to the client/browser
- All API calls go through your serverless function

✅ **Fallback Reviews**
- If the API fails, the banner shows placeholder reviews
- Users always see content, even if Google API is down

## 🎨 Customization

### Adjust Banner Speed

In `js/google-reviews-banner.js`, line with animation CSS:

```javascript
animation: scrollReviews 60s linear infinite;
```

Change `60s` to make it faster (30s) or slower (90s).

### Change Banner Colors

In `css/google-reviews-banner.css`:

```css
.google-reviews-banner {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%);
}
```

Update the gradient colors to match your brand.

### Filter Reviews by Rating

In `js/google-reviews-banner.js`, line ~73:

```javascript
// Only show 5-star reviews
this.reviews = data.reviews.filter(review => review.rating === 5);

// Show 4 and 5-star reviews:
// this.reviews = data.reviews.filter(review => review.rating >= 4);
```

## 🐛 Troubleshooting

### Issue: Banner shows "Using demo reviews"

**Cause**: The API endpoint isn't working or environment variable isn't set.

**Fix**:
1. Check Vercel environment variable is set correctly
2. Redeploy after adding the environment variable
3. Check browser console for errors (F12 → Console tab)

### Issue: Banner isn't scrolling

**Cause**: CSS animation not loading or JavaScript error.

**Fix**:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors
3. Verify CSS file loaded correctly

### Issue: Reviews cards look broken on mobile

**Cause**: CSS media queries not applying.

**Fix**:
1. Clear browser cache
2. Check responsive styles in `css/google-reviews-banner.css`
3. Test in Chrome DevTools responsive mode

## 📱 Mobile Responsiveness

The banner automatically adjusts:
- **Desktop (> 768px)**: 380px wide cards
- **Tablet (768px - 480px)**: 320px wide cards
- **Mobile (< 480px)**: 280px wide cards

The two-column testimonials layout becomes single-column on screens < 992px.

## 🔗 Related Files

- **API Endpoint**: `/api/reviews.js`
- **JavaScript**: `/js/google-reviews-banner.js`
- **CSS**: `/css/google-reviews-banner.css`
- **HTML Integration**: `index.html` (lines 563-626)

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for JavaScript errors
3. Verify Google Places API key is valid and has Places API enabled
4. Test the API endpoint directly: `https://your-site.com/api/reviews`

## ✨ Features

- ✅ Smooth infinite scroll animation
- ✅ Pause on hover
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Secure API key handling
- ✅ Fallback to demo reviews if API fails
- ✅ Clean, modern UI with Google branding
- ✅ Fast loading (deferred JavaScript)

---

**Last Updated**: October 15, 2025
**Created by**: AI Assistant for Sunrise Roofers LLC

