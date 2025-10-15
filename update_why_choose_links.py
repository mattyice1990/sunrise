#!/usr/bin/env python3
"""
Update all /why-choose-sunrise-roofers links to new URL
"""
import re
import glob

def update_links(filename):
    """Update why-choose links in a file"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Update href="/why-choose-sunrise-roofers"
    content = re.sub(
        r'href="/why-choose-sunrise-roofers"',
        r'href="/why-choose-sunrise-roofers-in-tucson"',
        content
    )
    
    # Update canonical and sitemap
    content = re.sub(
        r'roofwithsunrise\.com/why-choose-sunrise-roofers',
        r'roofwithsunrise.com/why-choose-sunrise-roofers-in-tucson',
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
print("🔗 UPDATING /why-choose-sunrise-roofers LINKS")
print("=" * 70)
print("New URL: /why-choose-sunrise-roofers-in-tucson\n")

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
print("   • Adds 'in Tucson' keyword to URL")
print("   • Better local SEO targeting")
print("   • More descriptive URL structure")
print("=" * 70)

