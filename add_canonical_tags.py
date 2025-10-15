#!/usr/bin/env python3
"""
Add canonical tags to all HTML pages for SEO
"""
import os
import re

# Base URL for the website
BASE_URL = "https://roofwithsunrise.com"

# Map of HTML files to their canonical URLs
PAGES = {
    'index.html': '/',
    'about.html': '/about',
    'services.html': '/services',
    'contact.html': '/contact',
    'gallery.html': '/gallery',
    'thank-you.html': '/thank-you',
    'privacy-policy.html': '/privacy-policy',
    'why-choose-sunrise-roofers.html': '/why-choose-sunrise-roofers',
    
    # Service pages
    'arizona-roof-replacement.html': '/arizona-roof-replacement',
    'roof-repair-tucson.html': '/roof-repair-tucson',
    'roof-inspection.html': '/roof-inspection',
    'shingle-roof-replacement-tucson.html': '/shingle-roof-replacement-tucson',
    'concrete-tile-roof-replacement.html': '/concrete-tile-roof-replacement',
    'metal-roofing-tucson.html': '/metal-roofing-tucson',
    'flat-roof-coating-tucson.html': '/flat-roof-coating-tucson',
    
    # Location pages
    'tucson-roofing-services.html': '/tucson-roofing-services',
    'marana-roofing.html': '/marana-roofing',
    'oro-valley-roofing.html': '/oro-valley-roofing',
    'catalina-foothills-roofing.html': '/catalina-foothills-roofing',
    'sahuarita-roofing.html': '/sahuarita-roofing',
    'green-valley-roofing.html': '/green-valley-roofing',
}

def add_canonical_tag(filename, canonical_url):
    """Add canonical tag to an HTML file"""
    
    if not os.path.exists(filename):
        print(f"⚠️  Skipping {filename} - file not found")
        return False
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if canonical tag already exists
    if 'rel="canonical"' in content:
        print(f"✓ {filename} already has canonical tag")
        return False
    
    # Create the canonical tag
    canonical_tag = f'    <link rel="canonical" href="{BASE_URL}{canonical_url}">'
    
    # Find the </head> tag and insert before it
    # Look for common patterns before </head>
    patterns_to_try = [
        (r'(    <!-- Open Graph Tags -->)', f'{canonical_tag}\n    \n\\1'),  # Before Open Graph
        (r'(    <!-- Schema Markup)', f'{canonical_tag}\n    \n\\1'),  # Before Schema
        (r'(</head>)', f'{canonical_tag}\n    \\1'),  # Right before </head>
    ]
    
    modified = False
    for pattern, replacement in patterns_to_try:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
            modified = True
            break
    
    if not modified:
        print(f"❌ Could not find insertion point in {filename}")
        return False
    
    # Write back the modified content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Added canonical tag to {filename} → {BASE_URL}{canonical_url}")
    return True

def main():
    print("=" * 70)
    print("🔗 ADDING CANONICAL TAGS FOR SEO")
    print("=" * 70)
    print(f"Base URL: {BASE_URL}\n")
    
    added_count = 0
    skipped_count = 0
    
    for filename, canonical_path in PAGES.items():
        if add_canonical_tag(filename, canonical_path):
            added_count += 1
        else:
            skipped_count += 1
    
    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    print(f"✅ Canonical tags added: {added_count}")
    print(f"⚠️  Skipped: {skipped_count}")
    print(f"\n🎯 Total pages processed: {len(PAGES)}")
    print("\n📝 Benefits:")
    print("   • Prevents duplicate content penalties")
    print("   • Consolidates page authority")
    print("   • Improves search engine rankings")
    print("   • Clarifies preferred URL version")
    print("=" * 70)

if __name__ == "__main__":
    main()

