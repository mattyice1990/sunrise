#!/usr/bin/env python3
"""
Extract critical above-the-fold CSS for inline insertion
This eliminates render-blocking CSS
"""

critical_css = """
/* Critical CSS - Above the fold only */
*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#333;background:#fff}:root{--color-orange:#F5A623;--color-black:#1A1A1A;--color-gray:#666;--color-background-light:#f4f4f4}.site-header{background:#fff;position:sticky;top:0;z-index:1000;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.top-bar{background:var(--color-black);color:#fff;padding:10px 0;font-size:13px}.top-bar-container{max-width:1400px;margin:0 auto;padding:0 20px;display:flex;justify-content:flex-end;align-items:center;gap:20px;flex-wrap:wrap}.top-contact,.top-social,.top-social-instagram,.top-social-google{color:#fff;text-decoration:none;transition:color 0.3s}.main-nav{background:#fff;border-bottom:1px solid #e0e0e0}.nav-container{max-width:1400px;margin:0 auto;padding:15px 20px;display:flex;justify-content:space-between;align-items:center}.logo img{height:60px;width:auto}.nav-links{display:flex;list-style:none;gap:30px;align-items:center}.nav-links a{text-decoration:none;color:var(--color-black);font-family:'Oswald',sans-serif;font-weight:500;font-size:16px;text-transform:uppercase;letter-spacing:0.5px;transition:color 0.3s}.btn{display:inline-block;padding:12px 30px;background:var(--color-orange);color:#fff;text-decoration:none;border-radius:5px;font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;transition:all 0.3s;cursor:pointer;border:none;font-size:16px}.hero-with-inset{padding:60px 20px 240px;background:#f5f5f5;position:relative;z-index:2}.hero-content-box{max-width:1400px;margin:0 auto;background-size:cover;background-position:center;border-radius:20px;padding:120px 40px;position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.2)}.hero-content-box::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(26,26,26,0.75) 0%,rgba(245,166,35,0.85) 100%);z-index:1}.hero-content-box h1{font-family:'Bebas Neue',sans-serif;font-size:56px;color:#fff;text-transform:uppercase;letter-spacing:2px;text-shadow:3px 3px 6px rgba(0,0,0,0.5);line-height:1.1}.cta-buttons{display:flex;gap:20px;justify-content:center;flex-wrap:wrap}.icon{display:inline-block;width:1em;height:1em;fill:currentColor;vertical-align:middle}
"""

print("=" * 70)
print("💎 CRITICAL CSS EXTRACTION")
print("=" * 70)
print("\nCritical CSS ready for inline insertion.")
print(f"Size: {len(critical_css)} bytes ({len(critical_css)/1024:.1f} KB)")
print("\nThis includes:")
print("  • Reset and base styles")
print("  • Header and navigation")
print("  • Hero section (above the fold)")
print("  • Buttons and icons")
print("\nNext: Insert this into <head> as inline <style>")
print("Then: Load full styles.css asynchronously")
print("=" * 70)

with open('critical.css', 'w') as f:
    f.write(critical_css)
    
print("\n✅ Saved to: critical.css")

