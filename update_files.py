#!/usr/bin/env python3
"""
Script to extract CSS and JavaScript from index.html into separate files
"""

import re

def extract_css_and_js(input_file, css_output, js_output):
    """Extract all CSS and JavaScript from HTML file"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all <style> blocks
    css_pattern = r'<style>(.*?)</style>'
    css_blocks = re.findall(css_pattern, content, re.DOTALL)
    
    # Combine all CSS
    all_css = '\n\n'.join([block.strip() for block in css_blocks])
    
    # Write CSS to file
    with open(css_output, 'w', encoding='utf-8') as f:
        f.write(all_css)
    
    # Extract all <script> blocks (excluding external scripts like Google Maps)
    script_pattern = r'<script(?![^>]*src=)>(.*?)</script>'
    script_blocks = re.findall(script_pattern, content, re.DOTALL)
    
    # Combine all JavaScript
    all_js = '\n\n'.join([block.strip() for block in script_blocks if block.strip() and 'application/ld+json' not in block])
    
    # Write JavaScript to file
    with open(js_output, 'w', encoding='utf-8') as f:
        f.write(all_js)
    
    print(f"✅ Extracted CSS to {css_output}")
    print(f"✅ Extracted JavaScript to {js_output}")
    print(f"CSS: {len(all_css)} characters")
    print(f"JS: {len(all_js)} characters")

if __name__ == '__main__':
    extract_css_and_js('index.html', 'css/styles.css', 'js/main.js')
