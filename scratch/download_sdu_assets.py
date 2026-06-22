import urllib.request
import os
from PIL import Image

# Setup directories
PUBLIC_DIR = "public"
LOGOS_DIR = os.path.join(PUBLIC_DIR, "images-optimized", "logos")
UNIV_DIR = os.path.join(PUBLIC_DIR, "images-optimized", "universities")

os.makedirs(LOGOS_DIR, exist_ok=True)
os.makedirs(UNIV_DIR, exist_ok=True)

# URLs
logo_url = "https://upload.wikimedia.org/wikipedia/en/9/9c/University-of-southern-denmark.png"
campus_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Luftfoto_SDU_Odense.jpg/1280px-Luftfoto_SDU_Odense.jpg"

temp_logo = "scratch/sdu_logo_temp.png"
temp_campus = "scratch/sdu_campus_temp.jpg"

# Headers to prevent block
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

def download_file(url, target_path):
    print(f"Downloading {url} to {target_path}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response, open(target_path, 'wb') as out_file:
        out_file.write(response.read())

try:
    download_file(logo_url, temp_logo)
    download_file(campus_url, temp_campus)
    
    # 1. Optimize Logo
    print("Optimizing SDU Logo...")
    with Image.open(temp_logo) as img:
        img = img.convert("RGBA")
        img.thumbnail((300, 300), Image.Resampling.LANCZOS)
        logo_webp_path = os.path.join(LOGOS_DIR, "SDU.webp")
        img.save(logo_webp_path, "WEBP", quality=85)
        print(f"Saved optimized logo to {logo_webp_path}")

    # 2. Optimize Campus Photo
    print("Optimizing SDU Campus Photo...")
    with Image.open(temp_campus) as img:
        img = img.convert("RGB")
        img.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
        campus_webp_path = os.path.join(UNIV_DIR, "DK_SDU.webp")
        img.save(campus_webp_path, "WEBP", quality=80)
        print(f"Saved optimized campus background to {campus_webp_path}")

except Exception as e:
    print(f"Error occurred: {e}")
finally:
    # Cleanup temp files
    if os.path.exists(temp_logo):
        os.remove(temp_logo)
    if os.path.exists(temp_campus):
        os.remove(temp_campus)
