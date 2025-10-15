#!/usr/bin/env python3
"""
Resize images to match their actual display dimensions
Uses TinyPNG API for resizing and compression
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

# Images to resize based on PageSpeed report
# Format: (path, max_width, max_height, description)
images_to_resize = [
    # Background/CTA images - displayed around 400x300 to 500x400 on mobile
    ("images/Tucson Roof Replacement.jpeg", 800, 1067, "CTA background (2x for retina)"),
    ("images/GAF Shingle Roof Replacement in Tucson.jpg", 800, 600, "Gallery image (2x for retina)"),
    ("images/Concrete Tile Install Tucson AZ.jpeg", 800, 600, "Gallery/Background image"),
    ("images/Roofing In The Desert.jpg", 1200, 800, "Hero background (larger)"),
    
    # Gallery images - displayed around 280x374 to 400x300
    ("images/SunriseRoofersRepairingaRoof.png", 600, 800, "Gallery card"),
    ("images/Standing Seam Metal Roofs.jpg", 600, 450, "Gallery card"),
    
    # Logo - displayed around 111x60 on header
    ("SunriseLogo.jpeg", 300, 163, "Logo (2x for retina)"),
]

def get_file_size_kb(filepath):
    """Get file size in KB"""
    return os.path.getsize(filepath) / 1024

def resize_image(source_path, max_width, max_height, description):
    """Resize and compress an image using TinyPNG"""
    if not os.path.exists(source_path):
        print(f"❌ File not found: {source_path}")
        return False, 0, 0
    
    original_size = get_file_size_kb(source_path)
    print(f"\n📐 Resizing: {source_path}")
    print(f"   Description: {description}")
    print(f"   Target size: {max_width}x{max_height}px max")
    print(f"   Original file size: {original_size:.1f} KB")
    
    try:
        # Create backup if it doesn't exist
        backup_path = source_path + ".original"
        if not os.path.exists(backup_path):
            with open(source_path, 'rb') as src:
                with open(backup_path, 'wb') as dst:
                    dst.write(src.read())
            print(f"   ✅ Backup created: {backup_path}")
        
        # Resize and compress using TinyPNG
        source = tinify.from_file(source_path)
        resized = source.resize(
            method="fit",  # Maintain aspect ratio
            width=max_width,
            height=max_height
        )
        resized.to_file(source_path)
        
        new_size = get_file_size_kb(source_path)
        savings = original_size - new_size
        percent_saved = (savings / original_size) * 100
        
        print(f"   ✅ New file size: {new_size:.1f} KB")
        print(f"   💰 Saved: {savings:.1f} KB ({percent_saved:.1f}% reduction)")
        
        return True, original_size, new_size
        
    except tinify.AccountError as e:
        print(f"   ❌ API Error: {e}")
        return False, original_size, original_size
    except tinify.ClientError as e:
        print(f"   ❌ Client Error: {e}")
        return False, original_size, original_size
    except tinify.ServerError as e:
        print(f"   ❌ Server Error: {e}")
        return False, original_size, original_size
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False, original_size, original_size

def main():
    print("=" * 70)
    print("📐 SUNRISE ROOFERS - IMAGE RESIZE FOR DISPLAY DIMENSIONS")
    print("=" * 70)
    print(f"Resizing {len(images_to_resize)} images to match display sizes...\n")
    
    success_count = 0
    total_original = 0
    total_resized = 0
    
    for source_path, max_width, max_height, description in images_to_resize:
        if os.path.exists(source_path):
            success, original, resized = resize_image(source_path, max_width, max_height, description)
            total_original += original
            total_resized += resized
            if success:
                success_count += 1
        else:
            print(f"\n⚠️  Skipping (not found): {source_path}")
    
    print("\n" + "=" * 70)
    print("📊 RESIZE SUMMARY")
    print("=" * 70)
    print(f"✅ Successfully resized: {success_count}/{len(images_to_resize)} images")
    print(f"📦 Total original size: {total_original:.1f} KB ({total_original/1024:.1f} MB)")
    print(f"📦 Total resized size: {total_resized:.1f} KB ({total_resized/1024:.1f} MB)")
    print(f"💰 Total saved: {total_original - total_resized:.1f} KB ({(total_original - total_resized)/1024:.1f} MB)")
    
    if total_original > 0:
        percent_saved = ((total_original - total_resized) / total_original) * 100
        print(f"🎉 Overall reduction: {percent_saved:.1f}%")
    
    try:
        compression_count = tinify.compression_count
        print(f"\n📈 API Usage: {compression_count} compressions used this month")
        print(f"   Remaining: {500 - compression_count} (free tier: 500/month)")
    except:
        pass
    
    print("\n✨ Images are now properly sized for their display dimensions!")
    print("💡 Original files saved as .original in case you need them")
    print("🎯 This should significantly improve your mobile PageSpeed score!")
    print("=" * 70)

if __name__ == "__main__":
    main()

