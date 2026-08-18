# Sunrise Roofers LLC - Official Website

Professional roofing services website for Sunrise Roofers LLC, serving Tucson, Phoenix, and surrounding areas in Arizona.

## 🏢 About

Sunrise Roofers LLC provides expert roofing services including:
- Roof Installation & Replacement
- Roof Repair & Maintenance
- Tile Roofing (Concrete & Clay)
- Shingle Roofing
- Metal Roofing
- Roof Coating
- Roof Inspections

**Service Areas:** Tucson, Phoenix, Marana, Oro Valley, Green Valley, Sahuarita, Catalina Foothills, and surrounding Arizona communities.

## 🛠️ Tech Stack

This is a static HTML website built with:
- HTML5
- CSS3 (inline styles)
- Vanilla JavaScript
- Google Fonts (Bebas Neue, Oswald, Roboto)
- Schema.org structured data for SEO

## 📁 Project Structure

```
sunrise-roofers/
├── index.html                          # Homepage
├── about.html                          # About Us page
├── contact.html                        # Contact page
├── services.html                       # Services overview
├── gallery.html                        # Project gallery
├── roof-inspection.html                # Roof inspection service
├── roof-repair-tucson.html             # Roof repair service
├── new-roof-tucson.html       # Roof replacement service
├── shingle-roof-replacement-tucson.html
├── concrete-tile-roof-replacement.html
├── metal-roofing-tucson.html
├── tucson-roofing-services.html
├── marana-roofing.html                 # Location-specific pages
├── oro-valley-roofing.html
├── green-valley-roofing.html
├── sahuarita-roofing.html
├── catalina-foothills-roofing.html
├── why-choose-sunrise-roofers.html
├── images/                             # Image assets
├── vercel.json                         # Vercel configuration
└── README.md                           # This file
```

## 🚀 Running Locally

Since this is a static HTML website, you have several options to run it locally:

### Option 1: Direct File Opening
Simply open `index.html` in your web browser.

### Option 2: Using Python's Built-in Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: `http://localhost:8000`

### Option 3: Using Node.js http-server
```bash
# Install globally (first time only)
npm install -g http-server

# Run server
http-server -p 8000
```
Then visit: `http://localhost:8000`

### Option 4: Using VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📦 Deployment to Vercel

### Prerequisites
- A [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional)

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (see Git Commands section below)

2. **Import to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `mattyice1990/sunrise`
   - Configure settings:
     - **Framework Preset:** Other
     - **Root Directory:** `./`
     - **Build Command:** Leave empty (static site)
     - **Output Directory:** Leave empty or `./`
   - Click "Deploy"

3. **Automatic Deployments:**
   - Every push to the `main` branch will automatically deploy
   - Pull requests will get preview deployments

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (first time only)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Custom Domain Setup

Once deployed, you can add a custom domain:
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your custom domain (e.g., `sunriseroofersaz.com`)
4. Follow DNS configuration instructions

## 📝 Git Commands to Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Sunrise Roofers website"

# Add your GitHub repository as remote
git remote add origin https://github.com/mattyice1990/sunrise.git

# Verify the remote was added correctly
git remote -v

# Push to GitHub (first time)
git push -u origin main

# If the branch is called 'master' instead of 'main', use:
# git push -u origin master

# For subsequent pushes (after the first time)
git push
```

### If You Encounter Branch Name Issues

```bash
# Check your current branch name
git branch

# If it's 'master' and you want 'main', rename it:
git branch -M main

# Then push
git push -u origin main
```

### If Repository Already Exists on GitHub

```bash
# If you've already created the repo on GitHub with files, pull first
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

## 🔒 Security Notes

The `.gitignore` file ensures that:
- No environment variables (`.env` files) are committed
- No operating system files are included
- No editor configuration files are shared
- No build artifacts or dependencies are tracked

## 📞 Contact Information

**Sunrise Roofers LLC**
- 📱 Phone: 520-753-1758
- 📧 Email: eddie@roofwithsunrise.com
- 🌐 Website: https://www.sunriseroofersaz.com
- 📍 Location: 7320 N La Cholla Blvd Ste 154-276, Tucson, AZ 85741

## 📄 License

© 2024 Sunrise Roofers LLC. All rights reserved.

## 🤝 Contributing

This is a private business website. For updates or changes, please contact the development team.

---

**Built with ❤️ for Sunrise Roofers LLC**


# Deployment trigger

# Deployment trigger
# Fresh deployment attempt 10/20/2025 00:25:01
# Redeploy with GitHub token
# Retry deployment 13:47:10
# Deploy attempt 2025-10-20 16:51:44
