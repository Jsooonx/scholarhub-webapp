import os
import sys
from PIL import Image

SRC_DIR = "public/images"
DEST_DIR = "public/images-optimized"

def compress_image(src_path, dest_path, is_logo=False):
    try:
        with Image.open(src_path) as img:
            # Handle RGBA transparency conversion issues if any, but webp handles RGBA natively
            # We keep it as RGBA if it has transparency, otherwise convert to RGB
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')
            
            # Determine target size
            max_size = 300 if is_logo else 1000
            
            # Resize preserving aspect ratio
            width, height = img.size
            if width > max_size or height > max_size:
                if width > height:
                    new_width = max_size
                    new_height = int(height * (max_size / width))
                else:
                    new_height = max_size
                    new_width = int(width * (max_size / height))
                
                # Use Resampling.LANCZOS for Pillow 9+, fallback to ANTIALIAS for older versions
                try:
                    resample_filter = Image.Resampling.LANCZOS
                except AttributeError:
                    resample_filter = Image.ANTIALIAS
                
                img = img.resize((new_width, new_height), resample_filter)
            
            # Save as WebP
            quality = 85 if is_logo else 80
            # Ensure folder exists
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            img.save(dest_path, "WEBP", quality=quality)
            return True
    except Exception as e:
        print(f"Error compressing {src_path}: {e}")
        return False

def main():
    if not os.path.exists(SRC_DIR):
        print(f"Source directory {SRC_DIR} not found.")
        sys.exit(1)
        
    print("Starting bulk image compression...")
    total_original_size = 0
    total_optimized_size = 0
    compressed_count = 0
    
    # Supported formats
    extensions = ('.png', '.jpg', '.jpeg', '.webp')
    
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.lower().endswith(extensions):
                src_path = os.path.join(root, file)
                # Compute relative path
                rel_path = os.path.relpath(src_path, SRC_DIR)
                # Change extension to .webp
                rel_webp_path = os.path.splitext(rel_path)[0] + ".webp"
                dest_path = os.path.join(DEST_DIR, rel_webp_path)
                
                # Check if it's in a logo folder
                is_logo = "logos" in rel_path.lower() or "programlogos" in rel_path.lower()
                
                orig_size = os.path.getsize(src_path)
                total_original_size += orig_size
                
                success = compress_image(src_path, dest_path, is_logo=is_logo)
                if success:
                    opt_size = os.path.getsize(dest_path)
                    total_optimized_size += opt_size
                    compressed_count += 1
                    
                    # Print progress for very large files or occasionally
                    if orig_size > 1024 * 1024:  # > 1MB
                        print(f"Compressed {file}: {orig_size/(1024*1024):.2f}MB -> {opt_size/1024:.1f}KB")
                
    print("\nCompression Complete!")
    print(f"Total files processed: {compressed_count}")
    print(f"Original directory size: {total_original_size / (1024*1024):.2f} MB")
    print(f"Optimized directory size: {total_optimized_size / (1024*1024):.2f} MB")
    if total_original_size > 0:
        savings = (1 - (total_optimized_size / total_original_size)) * 100
        print(f"Total size savings: {savings:.2f}%")

if __name__ == "__main__":
    main()
