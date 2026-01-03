import re
import os
import requests
from PIL import Image
from io import BytesIO

# Configuration
CONFIG_PATH = 'src/config/HeroConfig.js'
OUTPUT_DIR = 'downloaded_images'

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def extract_urls(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Extract Full Images (wallpaperUrls section)
    # Format: 'key': "url"
    # We look for the wallpaperUrls block specifically to be safe
    wp_urls_block = re.search(r"wallpaperUrls:\s*\{(.*?)\}", content, re.DOTALL)
    full_images = []
    if wp_urls_block:
        block_content = wp_urls_block.group(1)
        # Matches: 'rainy_window': "https://..."
        # or "rainy_window": "https://..."
        # Keys can be quoted with ' or "
        matches = re.findall(r"['\"]([^'\"]+)['\"]\s*:\s*[\"'](https?://[^\"']+)[\"']", block_content)
        full_images = matches
    
    # 2. Extract Thumbnails (wallpapers array)
    # Since parsing JSON-like JS with regex is hard due to nested structures and ']' in strings,
    # we will use a state-based approach or just simpler global regexes if the order is guaranteed.
    # The file structure is highly regular:
    # {
    #    id: '...',
    #    ...
    #    thumbUrl: "...",
    # }
    # We can iterate through the file and capture id and thumbUrl pairs.
    
    parsed_thumbs = []
    
    # Find the wallpapers array start
    start_match = re.search(r"wallpapers:\s*\[", content)
    if start_match:
        start_index = start_match.end()
        # We assume the array continues until we see "wallpaperUrls" or similar, 
        # but simpler is just to scan for id/thumbUrl patterns from here.
        
        # We will use a sliding window or iterator to find pairs.
        # Find all id matches
        # id: '...'
        id_pattern = re.compile(r"id:\s*['\"]([^'\"]+)['\"]")
        thumb_pattern = re.compile(r"thumbUrl:\s*['\"](https?://[^'\"]+)['\"]")
        
        # We process the string by looking for "id:" then searching forward for "thumbUrl:"
        # This assumes they are in order and grouped correctly (which they are in the file).
        
        current_pos = start_index
        while True:
            id_match = id_pattern.search(content, current_pos)
            if not id_match:
                break
            
            # Check if we've gone too far (e.g. into another section)
            # Actually, "id:" property is likely unique to this array in this file context
            
            current_id = id_match.group(1)
            id_end = id_match.end()
            
            # Find corresponding thumbUrl
            thumb_match = thumb_pattern.search(content, id_end)
            if thumb_match:
                current_thumb = thumb_match.group(1)
                parsed_thumbs.append((current_id, current_thumb))
                current_pos = thumb_match.end()
            else:
                break
                
    else:
        print("Could not find wallpapers array start")

    return full_images, parsed_thumbs

def process_image(url, filename):
    print(f"Processing {filename} from {url}...")
    save_path = os.path.join(OUTPUT_DIR, filename)
    
    # User requested re-do, so we force overwrite (removed check)

    try:
        response = requests.get(url, timeout=20)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            
            # Use quality 90 and method=6 as requested
            img.save(save_path, 'WEBP', quality=90, method=6)
            print(f"Saved {save_path}")
        else:
            print(f"Failed to download {url}: Status {response.status_code}")
    except Exception as e:
        print(f"Error processing {url}: {e}")

def main():
    full_images, thumbs = extract_urls(CONFIG_PATH)
    
    print(f"Found {len(full_images)} full images and {len(thumbs)} thumbnails.")
    
    # Process full images
    for img_id, url in full_images:
        filename = f"{img_id}.webp"
        process_image(url, filename)
        
    # Process thumbnails
    for img_id, url in thumbs:
        filename = f"{img_id}_thumb.webp"
        process_image(url, filename)

if __name__ == "__main__":
    main()
