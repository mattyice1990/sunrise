import re

files = ['about.html', 'contact.html', 'gallery.html', 'services.html', 'index.html']

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace style blocks with external CSS (using relative path)
    content = re.sub(
        r'    <style>.*?    </style>',
        '    <!-- External Stylesheet -->\n    <link rel="stylesheet" href="css/styles.css">',
        content,
        flags=re.DOTALL
    )
    
    # Replace script blocks with external JS (using relative path), but keep JSON-LD scripts
    # Only replace script blocks that don't have type="application/ld+json"
    def replace_script(match):
        full_match = match.group(0)
        if 'type="application/ld+json"' in full_match or 'application/ld+json' in full_match:
            return full_match  # Keep JSON-LD scripts
        return '    <!-- External JavaScript -->\n    <script src="js/main.js"></script>'
    
    content = re.sub(
        r'    <script>.*?    </script>',
        replace_script,
        content,
        flags=re.DOTALL
    )
    
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    
    print(f"Updated {filename}")

print("All files updated with relative paths!")

