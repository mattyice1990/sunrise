#!/usr/bin/env python3
"""
Minify CSS and JavaScript files for better performance
"""

import os
import re

def minify_css(css_content):
    """Basic CSS minification"""
    # Remove comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    # Remove whitespace
    css_content = re.sub(r'\s+', ' ', css_content)
    # Remove spaces around specific characters
    css_content = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css_content)
    # Remove trailing semicolons
    css_content = re.sub(r';}', '}', css_content)
    return css_content.strip()

def minify_js(js_content):
    """Basic JavaScript minification (preserves functionality)"""
    # Remove single-line comments (but preserve URLs)
    js_content = re.sub(r'(?<!:)//(?![/\s]).*$', '', js_content, flags=re.MULTILINE)
    # Remove multi-line comments
    js_content = re.sub(r'/\*.*?\*/', '', js_content, flags=re.DOTALL)
    # Remove extra whitespace (but keep at least one space between words)
    js_content = re.sub(r'\n\s*\n', '\n', js_content)
    js_content = re.sub(r'  +', ' ', js_content)
    return js_content.strip()

def get_file_size_kb(content):
    """Get content size in KB"""
    return len(content.encode('utf-8')) / 1024

def process_file(input_path, output_path, minify_func):
    """Process and minify a file"""
    if not os.path.exists(input_path):
        print(f"❌ File not found: {input_path}")
        return False
    
    print(f"\n📦 Processing: {input_path}")
    
    with open(input_path, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    original_size = get_file_size_kb(original_content)
    print(f"   Original size: {original_size:.1f} KB")
    
    # Create backup
    backup_path = input_path + '.backup-unminified'
    if not os.path.exists(backup_path):
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        print(f"   ✅ Backup created: {backup_path}")
    
    # Minify
    minified_content = minify_func(original_content)
    minified_size = get_file_size_kb(minified_content)
    
    # Write minified version
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(minified_content)
    
    savings = original_size - minified_size
    percent_saved = (savings / original_size) * 100 if original_size > 0 else 0
    
    print(f"   ✅ Minified size: {minified_size:.1f} KB")
    print(f"   💰 Saved: {savings:.1f} KB ({percent_saved:.1f}% reduction)")
    
    return True

def main():
    print("=" * 70)
    print("🗜️  SUNRISE ROOFERS - ASSET MINIFICATION")
    print("=" * 70)
    
    files_to_process = [
        ("css/styles.css", "css/styles.css", minify_css),
        ("js/main.js", "js/main.js", minify_js),
    ]
    
    success_count = 0
    for input_path, output_path, minify_func in files_to_process:
        if process_file(input_path, output_path, minify_func):
            success_count += 1
    
    print("\n" + "=" * 70)
    print("📊 MINIFICATION SUMMARY")
    print("=" * 70)
    print(f"✅ Successfully minified: {success_count}/{len(files_to_process)} files")
    print("\n✨ Your assets are now minified for better performance!")
    print("💡 Backup files (.backup-unminified) created for safety")
    print("🎯 This should improve your PageSpeed 'Minify CSS/JS' scores!")
    print("=" * 70)

if __name__ == "__main__":
    main()

