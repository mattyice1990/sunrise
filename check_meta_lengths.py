#!/usr/bin/env python3
"""
Check meta tag lengths and identify which need adjustment
"""

PAGES_CONFIG = {
    'index.html': {
        'title': 'Tucson Roofing Contractors | Sunrise Roofers AZ',
        'description': 'Expert Tucson roofing contractors. Roof repair, replacement & emergency service. Licensed & insured. Same-day estimates. Call 520-668-6638',
    },
    'roof-repair-tucson.html': {
        'title': 'Roof Repair Tucson AZ | Emergency Service 24/7',
        'description': 'Fast roof repair in Tucson. Emergency service available 24/7. Licensed contractors. Same-day repairs. Call 520-668-6638',
    },
    'arizona-roof-replacement.html': {
        'title': 'Roof Replacement Arizona | Expert Installation',
        'description': 'Complete roof replacement in Arizona. Expert installation, premium materials, lifetime warranties. Licensed & insured. Free estimates.',
    },
    'shingle-roof-replacement-tucson.html': {
        'title': 'Shingle Roof Replacement Tucson | GAF Certified',
        'description': 'Shingle roof replacement in Tucson. GAF certified contractors. Premium asphalt shingles. Lifetime warranties. Call 520-668-6638',
    },
    'concrete-tile-roof-replacement.html': {
        'title': 'Tile Roof Replacement Tucson | Concrete & Clay Tile',
        'description': 'Tile roof experts in Tucson. Concrete & clay tile installation. 30+ year lifespan. Licensed contractors. Free estimates.',
    },
    'metal-roofing-tucson.html': {
        'title': 'Metal Roofing Tucson | Energy Efficient Roofs',
        'description': 'Metal roof installation in Tucson. Energy efficient, 50+ year lifespan. Reduces cooling costs 30%. Licensed contractors.',
    },
    'flat-roof-coating-tucson.html': {
        'title': 'Flat Roof Coating Tucson | Foam & Elastomeric',
        'description': 'Flat roof coating in Tucson. Foam & elastomeric systems. Extend roof life 20+ years. Licensed contractors. Call today!',
    },
    'roof-inspection.html': {
        'title': 'Roof Inspection Tucson | Free Estimates Available',
        'description': 'Professional roof inspection in Tucson. Free estimates. Detailed reports with photos. Licensed inspectors. Call 520-668-6638',
    },
    'tucson-roofing-services.html': {
        'title': 'Tucson Roofing Services | Local Licensed Roofers',
        'description': 'Professional roofing in Tucson AZ. Repair, replacement & installation. Licensed & insured. Free estimates. Call 520-668-6638',
    },
    'marana-roofing.html': {
        'title': 'Marana Roofing Contractors | Expert Service',
        'description': 'Professional roofing in Marana AZ. Repair & replacement services. Licensed & insured. Free estimates. Call 520-668-6638',
    },
    'oro-valley-roofing.html': {
        'title': 'Oro Valley Roofing | Licensed Contractors',
        'description': 'Expert roofing in Oro Valley AZ. Repair, replacement & installation. Licensed & insured. Free estimates. Call 520-668-6638',
    },
    'catalina-foothills-roofing.html': {
        'title': 'Catalina Foothills Roofing | Premium Service',
        'description': 'Premium roofing in Catalina Foothills. Luxury home specialists. Licensed & insured. Free estimates. Call 520-668-6638',
    },
    'sahuarita-roofing.html': {
        'title': 'Sahuarita Roofing Contractors | Local Experts',
        'description': 'Trusted roofing in Sahuarita AZ. Repair & replacement. Licensed & insured. Free estimates. Call 520-668-6638 today!',
    },
    'green-valley-roofing.html': {
        'title': 'Green Valley Roofing | Senior-Friendly Service',
        'description': 'Expert roofing in Green Valley AZ. Senior discounts available. Licensed & insured. Free estimates. Call 520-668-6638',
    },
    'services.html': {
        'title': 'Roofing Services Tucson | Complete Solutions',
        'description': 'Complete roofing services in Tucson. Repair, replacement, inspection & more. Licensed & insured. Call 520-668-6638',
    },
    'about.html': {
        'title': 'About Sunrise Roofers | Tucson Roofing Experts',
        'description': 'Learn about Sunrise Roofers. 20+ years experience in Tucson. Licensed & insured. Hundreds of satisfied customers.',
    },
    'contact.html': {
        'title': 'Contact Sunrise Roofers | Free Estimates',
        'description': 'Contact Sunrise Roofers for free estimates. Serving Tucson & surrounding areas. Call 520-668-6638 or request online.',
    },
    'gallery.html': {
        'title': 'Roofing Gallery Tucson | Our Projects',
        'description': 'View our completed roofing projects in Tucson. Photo gallery of roof installations & repairs. Licensed contractors.',
    },
    'why-choose-sunrise-roofers.html': {
        'title': 'Why Choose Sunrise Roofers | Tucson\'s Best',
        'description': 'Why choose Sunrise Roofers? 20+ years experience, licensed & insured, A+ BBB rating. Tucson\'s trusted choice.',
    }
}

print("=" * 80)
print("📏 META TAG LENGTH CHECKER")
print("=" * 80)
print("\nTarget Ranges:")
print("  • Title: 50-60 characters")
print("  • Description: 140-160 characters")
print("\n" + "=" * 80)

needs_fix = []

for page, config in PAGES_CONFIG.items():
    title_len = len(config['title'])
    desc_len = len(config['description'])
    
    title_status = "✅" if 50 <= title_len <= 60 else "❌"
    desc_status = "✅" if 140 <= desc_len <= 160 else "❌"
    
    print(f"\n{page}")
    print(f"  Title ({title_len} chars): {title_status} {config['title']}")
    print(f"  Desc ({desc_len} chars): {desc_status} {config['description']}")
    
    if not (50 <= title_len <= 60) or not (140 <= desc_len <= 160):
        needs_fix.append({
            'page': page,
            'title': config['title'],
            'title_len': title_len,
            'description': config['description'],
            'desc_len': desc_len
        })

print("\n" + "=" * 80)
print("📊 SUMMARY")
print("=" * 80)
print(f"Total pages: {len(PAGES_CONFIG)}")
print(f"Pages needing fixes: {len(needs_fix)}")

if needs_fix:
    print("\n⚠️  PAGES NEEDING ADJUSTMENT:")
    for item in needs_fix:
        print(f"\n  {item['page']}")
        if not (50 <= item['title_len'] <= 60):
            print(f"    Title: {item['title_len']} chars (needs to be 50-60)")
        if not (140 <= item['desc_len'] <= 160):
            print(f"    Description: {item['desc_len']} chars (needs to be 140-160)")
else:
    print("\n✅ All pages have optimal meta tag lengths!")

print("=" * 80)

