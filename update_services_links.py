#!/usr/bin/env python3
"""
Update all /services links to /roofing-services
"""
import re
import glob

def update_links(filename):
    """Update services links in a file"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Update href="/services" - be careful not to match /tucson-roofing-services
    content = re.sub(
        r'href="/services"',
        r'href="/roofing-services"',
        content
    )
    
    # Update canonical and sitemap
    content = re.sub(
        r'roofwithsunrise\.com/services"',
        r'roofwithsunrise.com/roofing-services"',
        content
    )
    
    content = re.sub(
        r'roofwithsunrise\.com/services<',
        r'roofwithsunrise.com/roofing-services<',
        content
    )
    
    # If content changed, write it back
    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Get all files
html_files = [f for f in glob.glob('*.html') if 'backup' not in f.lower()]
xml_files = glob.glob('*.xml')

all_files = html_files + xml_files

print("=" * 70)
print("🔗 UPDATING /services LINKS TO /roofing-services")
print("=" * 70)
print("New URL: /roofing-services\n")

updated = 0
for filename in sorted(all_files):
    if update_links(filename):
        print(f"✅ Updated: {filename}")
        updated += 1
    else:
        print(f"⏭️  No changes: {filename}")

print("\n" + "=" * 70)
print("📊 SUMMARY")
print("=" * 70)
print(f"✅ Files updated: {updated}")
print(f"📄 Files checked: {len(all_files)}")
print("\n🎯 SEO Benefits:")
print("   • URL includes 'roofing' keyword")
print("   • More descriptive than generic 'services'")
print("   • Better search visibility")
print("=" * 70)

