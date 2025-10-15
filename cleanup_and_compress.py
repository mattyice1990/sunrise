#!/usr/bin/env python3
"""
Image folder cleanup and compression script
- Removes backup files
- Removes duplicates
- Compresses large images using TinyPNG API
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

IMAGE_DIR = "images"

def get_file_size_kb(filepath):
    """Get file size in KB"""
    return os.path.getsize(filepath) / 1024

def delete_file(filepath):
    """Delete a file"""
    try:
        os.remove(filepath)
        print(f"   ✅ Deleted: {filepath}")
        return True
    except Exception as e:
        print(f"   ❌ Error deleting {filepath}: {e}")
        return False

def compress_image(source_path):
    """Compress a single image using TinyPNG"""
    original_size = get_file_size_kb(source_path)
    print(f"\n📸 Compressing: {source_path}")
    print(f"   Original size: {original_size:.1f} KB")
    
    try:
        source = tinify.from_file(source_path)
        source.to_file(source_path)
        
        new_size = get_file_size_kb(source_path)
        savings = original_size - new_size
        percent_saved = (savings / original_size) * 100
        
        print(f"   ✅ Compressed size: {new_size:.1f} KB")
        print(f"   💰 Saved: {savings:.1f} KB ({percent_saved:.1f}% reduction)")
        
        return True, original_size, new_size
        
    except tinify.AccountError as e:
        print(f"   ❌ API Error: {e}")
        return False, original_size, original_size
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False, original_size, original_size

def main():
    print("=" * 70)
    print("🧹 SUNRISE ROOFERS - IMAGE CLEANUP & COMPRESSION")
    print("=" * 70)
    
    # Step 1: Delete backup files
    print("\n🗑️  STEP 1: Removing backup files...")
    backup_files = [f for f in os.listdir(IMAGE_DIR) if f.endswith('.backup')]
    for backup in backup_files:
        delete_file(os.path.join(IMAGE_DIR, backup))
    print(f"✅ Removed {len(backup_files)} backup files")
    
    # Step 2: Remove duplicate GAF logo (keep one)
    print("\n🔄 STEP 2: Removing duplicate files...")
    duplicate = os.path.join(IMAGE_DIR, "GAF_CERTIFIED_LOGO-2.png")
    if os.path.exists(duplicate):
        delete_file(duplicate)
    
    # Step 3: Compress large images (over 200 KB)
    print("\n🗜️  STEP 3: Compressing large images...")
    print("Looking for images over 200 KB that need compression...\n")
    
    images_to_compress = []
    for filename in os.listdir(IMAGE_DIR):
        filepath = os.path.join(IMAGE_DIR, filename)
        if os.path.isfile(filepath) and filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            size_kb = get_file_size_kb(filepath)
            if size_kb > 200:  # Compress anything over 200 KB
                images_to_compress.append(filepath)
    
    print(f"Found {len(images_to_compress)} images to compress:\n")
    for img in images_to_compress:
        size = get_file_size_kb(img)
        print(f"  • {os.path.basename(img)} ({size:.1f} KB)")
    
    print(f"\n{'='*70}")
    print("Starting compression...")
    print(f"{'='*70}")
    
    success_count = 0
    total_original = 0
    total_compressed = 0
    
    for image_path in images_to_compress:
        original_size = get_file_size_kb(image_path)
        total_original += original_size
        
        success, orig, compressed = compress_image(image_path)
        if success:
            success_count += 1
            total_compressed += compressed
        else:
            total_compressed += orig
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 FINAL SUMMARY")
    print("=" * 70)
    print(f"🗑️  Backup files removed: {len(backup_files)}")
    print(f"🔄 Duplicate files removed: 1")
    print(f"✅ Images compressed: {success_count}/{len(images_to_compress)}")
    print(f"\n📦 Total original size: {total_original:.1f} KB ({total_original/1024:.1f} MB)")
    print(f"📦 Total compressed size: {total_compressed:.1f} KB ({total_compressed/1024:.1f} MB)")
    print(f"💰 Total saved: {total_original - total_compressed:.1f} KB ({(total_original - total_compressed)/1024:.1f} MB)")
    
    if total_original > 0:
        percent_saved = ((total_original - total_compressed) / total_original) * 100
        print(f"🎉 Overall reduction: {percent_saved:.1f}%")
    
    try:
        compression_count = tinify.compression_count
        print(f"\n📈 API Usage: {compression_count} compressions used this month")
        print(f"   Remaining: {500 - compression_count} (free tier: 500/month)")
    except:
        pass
    
    print("\n✨ Your images folder is now clean and optimized!")
    print("=" * 70)

if __name__ == "__main__":
    main()

