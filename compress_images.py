#!/usr/bin/env python3
"""
Image compression script using TinyPNG API
Compresses large images to reduce page load times
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

# Images to compress (the largest ones from PageSpeed report)
images_to_compress = [
    "images/GAF Shingle Roof Replacement in Tucson.jpg",
    "images/Tucson Roof Replacement.jpeg",
    "images/Concrete Tile Install Tucson AZ.jpeg",
    "images/Roofing In The Desert.jpg",
    "images/SunriseRoofersRepairingaRoof.png",
    "images/BBB.png",
]

def get_file_size_kb(filepath):
    """Get file size in KB"""
    return os.path.getsize(filepath) / 1024

def compress_image(source_path):
    """Compress a single image using TinyPNG"""
    if not os.path.exists(source_path):
        print(f"❌ File not found: {source_path}")
        return False
    
    original_size = get_file_size_kb(source_path)
    print(f"\n📸 Compressing: {source_path}")
    print(f"   Original size: {original_size:.1f} KB")
    
    try:
        # Create backup
        backup_path = source_path + ".backup"
        if not os.path.exists(backup_path):
            with open(source_path, 'rb') as src:
                with open(backup_path, 'wb') as dst:
                    dst.write(src.read())
            print(f"   ✅ Backup created: {backup_path}")
        
        # Compress using TinyPNG
        source = tinify.from_file(source_path)
        source.to_file(source_path)
        
        new_size = get_file_size_kb(source_path)
        savings = original_size - new_size
        percent_saved = (savings / original_size) * 100
        
        print(f"   ✅ Compressed size: {new_size:.1f} KB")
        print(f"   💰 Saved: {savings:.1f} KB ({percent_saved:.1f}% reduction)")
        
        return True
        
    except tinify.AccountError as e:
        print(f"   ❌ API Error: {e}")
        print(f"   The API key may be invalid or you've reached the free tier limit (500 images/month)")
        return False
    except tinify.ClientError as e:
        print(f"   ❌ Client Error: {e}")
        return False
    except tinify.ServerError as e:
        print(f"   ❌ Server Error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def main():
    print("=" * 60)
    print("🖼️  SUNRISE ROOFERS - IMAGE COMPRESSION TOOL")
    print("=" * 60)
    print(f"Using TinyPNG API to compress {len(images_to_compress)} images...\n")
    
    success_count = 0
    total_original = 0
    total_compressed = 0
    
    for image_path in images_to_compress:
        if os.path.exists(image_path):
            original_size = get_file_size_kb(image_path)
            total_original += original_size
            
            if compress_image(image_path):
                success_count += 1
                total_compressed += get_file_size_kb(image_path)
        else:
            print(f"\n⚠️  Skipping (not found): {image_path}")
    
    print("\n" + "=" * 60)
    print("📊 COMPRESSION SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully compressed: {success_count}/{len(images_to_compress)} images")
    print(f"📦 Total original size: {total_original:.1f} KB ({total_original/1024:.1f} MB)")
    print(f"📦 Total compressed size: {total_compressed:.1f} KB ({total_compressed/1024:.1f} MB)")
    print(f"💰 Total saved: {total_original - total_compressed:.1f} KB ({(total_original - total_compressed)/1024:.1f} MB)")
    
    if success_count > 0:
        percent_saved = ((total_original - total_compressed) / total_original) * 100
        print(f"🎉 Overall reduction: {percent_saved:.1f}%")
        print("\n✨ Your images are now optimized for web!")
        print("💡 Backup files (.backup) have been created in case you need to restore originals")
    
    try:
        compression_count = tinify.compression_count
        print(f"\n📈 API Usage: {compression_count} compressions used this month")
        print(f"   Remaining: {500 - compression_count} (free tier: 500/month)")
    except:
        pass
    
    print("=" * 60)

if __name__ == "__main__":
    main()

