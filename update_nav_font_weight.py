#!/usr/bin/env python3
"""
Update navigation menu font-weight to 500 (not bold) on all pages to match homepage
"""
import re
import glob

def update_nav_styles(filename):
    """Update nav font-weight in inline styles"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Find and update nav link styles in inline <style> blocks
    # Look for .nav-links > li > a patterns and change font-weight to 500
    
    # Pattern 1: font-weight: 700 or font-weight: 600 in nav links
    content = re.sub(
        r'(\.nav-links\s*>\s*li\s*>\s*a\s*\{[^}]*font-weight:\s*)(?:600|700)',
        r'\1500',
        content
    )
    
    # Pattern 2: In more specific selectors
    content = re.sub(
        r'(font-family:\s*["\']Roboto["\'],\s*sans-serif;\s*font-size:\s*16px;\s*font-weight:\s*)(?:600|700)',
        r'\1500',
        content
    )
    
    # If content changed, write it back
    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Get all HTML files (exclude backups and homepage which is already correct)
html_files = [f for f in glob.glob('*.html') if 'backup' not in f.lower() and f != 'index.html']

print("=" * 70)
print("📝 UPDATING NAVIGATION FONT WEIGHT - ALL PAGES")
print("=" * 70)
print("Setting nav menu to font-weight: 500 (to match homepage)\n")

updated = 0
for filename in sorted(html_files):
    if update_nav_styles(filename):
        print(f"✅ Updated: {filename}")
        updated += 1
    else:
        print(f"⏭️  No changes: {filename}")

print("\n" + "=" * 70)
print("📊 SUMMARY")
print("=" * 70)
print(f"✅ Files updated: {updated}")
print(f"📄 Files checked: {len(html_files)}")
print("\n🎯 Result:")
print("   • Navigation text now regular weight (not bold)")
print("   • Consistent styling across all pages")
print("   • Matches homepage appearance")
print("=" * 70)

