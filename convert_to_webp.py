#!/usr/bin/env python3
"""
Convert images to WebP format using TinyPNG API
WebP provides 25-35% better compression than JPEG/PNG
"""

import os
import sys

try:
    import tinify
except ImportError:
    print("Installing tinify library...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "tinify", "-q"])
    import tinify

# Set API key
tinify.key = "bldCdVNLxQxqG50cjTTJ25nRFkQ92LLk"

# Images to convert to WebP (the ones still flagged by PageSpeed)
images_to_convert = [
    "images/Tucson Roof Replacement.jpeg",
    "images/GAF Shingle Roof Replacement in Tucson.jpg",
    "images/SunriseRoofersRepairingaRoof.png",
    "images/Concrete Tile Install Tucson AZ.jpeg",
    "SunriseLogo.jpeg",
]

def get_file_size_kb(filepath):
    """Get file size in KB"""
    if not os.path.exists(filepath):
        return 0
    return os.path.getsize(filepath) / 1024

def convert_to_webp(source_path):
    """Convert an image to WebP format using TinyPNG"""
    if not os.path.exists(source_path):
        print(f"❌ File not found: {source_path}")
        return False, 0, 0
    
    original_size = get_file_size_kb(source_path)
    webp_path = os.path.splitext(source_path)[0] + '.webp'
    
    print(f"\n🔄 Converting: {source_path}")
    print(f"   Original size: {original_size:.1f} KB")
    
    try:
        # Convert to WebP using TinyPNG
        source = tinify.from_file(source_path)
        converted = source.convert(type=["image/webp"])
        converted.to_file(webp_path)
        
        new_size = get_file_size_kb(webp_path)
        savings = original_size - new_size
        percent_saved = (savings / original_size) * 100 if original_size > 0 else 0
        
        print(f"   ✅ WebP size: {new_size:.1f} KB")
        print(f"   💰 Saved: {savings:.1f} KB ({percent_saved:.1f}% reduction)")
        print(f"   📁 Created: {webp_path}")
        
        return True, original_size, new_size
        
    except tinify.AccountError as e:
        print(f"   ❌ API Error: {e}")
        return False, original_size, original_size
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False, original_size, original_size

def main():
    print("=" * 70)
    print("🖼️  SUNRISE ROOFERS - WEBP CONVERSION")
    print("=" * 70)
    print(f"Converting {len(images_to_convert)} images to WebP format...\n")
    
    success_count = 0
    total_original = 0
    total_webp = 0
    
    for source_path in images_to_convert:
        if os.path.exists(source_path):
            success, original, webp = convert_to_webp(source_path)
            total_original += original
            total_webp += webp
            if success:
                success_count += 1
        else:
            print(f"\n⚠️  Skipping (not found): {source_path}")
    
    print("\n" + "=" * 70)
    print("📊 CONVERSION SUMMARY")
    print("=" * 70)
    print(f"✅ Successfully converted: {success_count}/{len(images_to_convert)} images")
    print(f"📦 Total original size: {total_original:.1f} KB ({total_original/1024:.1f} MB)")
    print(f"📦 Total WebP size: {total_webp:.1f} KB ({total_webp/1024:.1f} MB)")
    print(f"💰 Total saved: {total_original - total_webp:.1f} KB ({(total_original - total_webp)/1024:.1f} MB)")
    
    if total_original > 0:
        percent_saved = ((total_original - total_webp) / total_original) * 100
        print(f"🎉 Overall reduction: {percent_saved:.1f}%")
    
    try:
        compression_count = tinify.compression_count
        print(f"\n📈 API Usage: {compression_count} compressions used this month")
        print(f"   Remaining: {500 - compression_count} (free tier: 500/month)")
    except:
        pass
    
    print("\n✨ WebP images created!")
    print("📝 Next: Update HTML to use <picture> tags with WebP + fallback")
    print("🎯 Expected: Additional 25-35% size reduction from WebP format")
    print("=" * 70)

if __name__ == "__main__":
    main()

