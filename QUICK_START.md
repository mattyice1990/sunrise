# 🚀 Quick Start - Google Reviews Banner

## Overview
Your Google Reviews Banner is ready to deploy! Follow these 3 simple steps.

---

## Step 1️⃣: Add API Key to Vercel (REQUIRED)

1. Go to: https://vercel.com/dashboard
2. Click on your **roofwithsunrise.com** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** and enter:

```
Name:  GOOGLE_PLACES_API_KEY
Value: AIzaSyBvvwXnVB5WxLjHG091gU0R-uOBodS8pMM

✓ Production
✓ Preview  
✓ Development
```

5. Click **Save**

---

## Step 2️⃣: Deploy to Vercel

Open your terminal and run:

```bash
# Add all new files
git add .

# Commit with a message
git commit -m "Add Google Reviews Banner"

# Push to deploy
git push origin main
```

Vercel will automatically deploy your changes.

---

## Step 3️⃣: Verify It Works

1. Wait ~2 minutes for deployment
2. Visit: **https://roofwithsunrise.com**
3. Scroll to **"What Our Customers Say"** section
4. You should see:
   - Two columns on desktop (company info + Google rating)
   - Slow-scrolling review banner below
   - Reviews pause when you hover over them

---

## ✅ Success Checklist

- [ ] Environment variable added to Vercel
- [ ] Code pushed to git
- [ ] Vercel deployment completed
- [ ] Reviews banner visible on website
- [ ] Banner scrolls smoothly
- [ ] Reviews pause on hover

---

## 🆘 Troubleshooting

### Banner shows "Using demo reviews"
→ Environment variable not set in Vercel. Go back to Step 1.

### Banner not visible at all
→ Hard refresh the page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Still having issues?
→ Check detailed instructions in: **GOOGLE_REVIEWS_SETUP.md**

---

## 📱 What It Looks Like

### Desktop
```
Company Info     |    Google Rating
Credentials      |    ⭐ 5.0 Stars
BBB Logo         |    [Leave Review Button]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
← ← ← Reviews Scrolling Left ← ← ←
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Mobile
```
Company Info
Credentials
BBB Logo

Google Rating
⭐ 5.0 Stars
[Leave Review]

← Reviews Scroll ←
```

---

## 🎨 Customization (Optional)

Want to change the scroll speed or colors?
See: **REVIEWS_IMPLEMENTATION_SUMMARY.md** → Customization section

---

**That's it! Your Google Reviews Banner is live! 🎉**

