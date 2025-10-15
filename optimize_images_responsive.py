#!/usr/bin/env python3
"""
Sunrise Roofers - Responsive Image Optimizer
Resizes images to match their display dimensions for better performance
"""

from PIL import Image
import os

# Define target sizes based on Lighthouse report
IMAGE_CONFIGS = {
    'Tucson Roof Replacement.webp': [
        {'width': 280, 'height': 373, 'suffix': '-small'},
        {'width': 560, 'height': 746, 'suffix': '-medium'},
        {'width': 800, 'height': 1067, 'suffix': ''}  # Original size
    ],
    'GAF Shingle Roof Replacement in Tucson.webp': [
        {'width': 400, 'height': 300, 'suffix': '-small'},
        {'width': 560, 'height': 420, 'suffix': '-medium'}
    ],
    'Roofing In The Desert.webp': [
        {'width': 600, 'height': 600, 'suffix': '-small'},
        {'width': 800, 'height': 800, 'suffix': ''}
    ],
    'SunriseRoofersRepairingaRoof.webp': [
        {'width': 280, 'height': 374, 'suffix': '-small'},
        {'width': 560, 'height': 748, 'suffix': '-medium'}
    ],
    'Concrete Tile Install Tucson AZ.webp': [
        {'width': 400, 'height': 300, 'suffix': '-small'},
        {'width': 600, 'height': 450, 'suffix': ''}
    ]
}

def get_file_size_kb(filepath):
    """Get file size in KB"""
    return os.path.getsize(filepath) / 1024

def resize_image(input_path, output_path, width, height, quality=80):
    """Resize image to specified dimensions"""
    img = Image.open(input_path)
    
    # Convert RGBA to RGB if needed
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    
    # Resize with high-quality resampling
    img_resized = img.resize((width, height), Image.Resampling.LANCZOS)
    
    # Save as WebP
    img_resized.save(output_path, 'WEBP', quality=quality, method=6)
    
    return get_file_size_kb(output_path)

def main():
    images_dir = 'images'
    
    print("=" * 70)
    print("🖼️  SUNRISE ROOFERS - RESPONSIVE IMAGE OPTIMIZER")
    print("=" * 70)
    print(f"Creating responsive image variants...\n")
    
    total_saved = 0
    processed = 0
    
    for image_name, configs in IMAGE_CONFIGS.items():
        input_path = os.path.join(images_dir, image_name)
        
        if not os.path.exists(input_path):
            print(f"⚠️  Skipping {image_name} - file not found")
            continue
        
        original_size = get_file_size_kb(input_path)
        print(f"\n🔄 Processing: {image_name}")
        print(f"   Original size: {original_size:.1f} KB")
        
        for config in configs:
            width = config['width']
            height = config['height']
            suffix = config['suffix']
            
            # Generate output filename
            base_name = os.path.splitext(image_name)[0]
            output_name = f"{base_name}{suffix}.webp"
            output_path = os.path.join(images_dir, output_name)
            
            # Skip if this is the original size and it already exists
            if suffix == '' and output_name == image_name:
                print(f"   ✓ Keeping original: {width}x{height}")
                continue
            
            try:
                new_size = resize_image(input_path, output_path, width, height)
                savings = original_size - new_size
                total_saved += savings
                processed += 1
                
                print(f"   ✅ Created {output_name}")
                print(f"      Size: {width}x{height} | {new_size:.1f} KB | Saved: {savings:.1f} KB")
            except Exception as e:
                print(f"   ❌ Error creating {output_name}: {str(e)}")
    
    print("\n" + "=" * 70)
    print("📊 OPTIMIZATION SUMMARY")
    print("=" * 70)
    print(f"✅ Images processed: {processed}")
    print(f"💰 Total space saved: {total_saved:.1f} KB ({total_saved/1024:.2f} MB)")
    print("✨ Responsive images created!")
    print("📝 Next: Update HTML srcset attributes with new image variants")
    print("=" * 70)

if __name__ == "__main__":
    main()

