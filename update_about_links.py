#!/usr/bin/env python3
"""
Update all /about links to /about-our-roofing-contractors-in-tucson
"""
import re
import glob

def update_about_links(filename):
    """Update about links in a file"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Update href="/about" to new URL
    content = re.sub(
        r'href="/about"',
        r'href="/about-our-roofing-contractors-in-tucson"',
        content
    )
    
    # Update href="/about " (with space)
    content = re.sub(
        r'href="/about\s',
        r'href="/about-our-roofing-contractors-in-tucson ',
        content
    )
    
    # If content changed, write it back
    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Get all HTML files (exclude backups and the renamed about page itself)
html_files = [f for f in glob.glob('*.html') if 'backup' not in f.lower()]

print("=" * 70)
print("🔗 UPDATING /about LINKS TO NEW SEO-FRIENDLY URL")
print("=" * 70)
print("New URL: /about-our-roofing-contractors-in-tucson\n")

updated = 0
for filename in sorted(html_files):
    if update_about_links(filename):
        print(f"✅ Updated: {filename}")
        updated += 1
    else:
        print(f"⏭️  No changes: {filename}")

print("\n" + "=" * 70)
print("📊 SUMMARY")
print("=" * 70)
print(f"✅ Files updated: {updated}")
print(f"📄 Files checked: {len(html_files)}")
print("\n🎯 SEO Benefits:")
print("   • Better keyword targeting (roofing contractors, Tucson)")
print("   • More descriptive URL structure")
print("   • Improved search engine visibility")
print("=" * 70)

