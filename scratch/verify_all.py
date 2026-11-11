import glob, os, re

html_files = sorted(glob.glob('*.html'))
all_ok = True

print("=== 1. VERIFYING IMAGE PATHS ON DISK ===")
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    for img in imgs:
        clean_path = img.split('?')[0].split('#')[0]
        if not os.path.exists(clean_path):
            print(f"ERROR: Broken image in {hf}: {img}")
            all_ok = False

print("All image paths checked.")

print("\n=== 2. VERIFYING BUTTON CONSISTENCY (HOME 1 & 2 & ALL PAGES) ===")
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    btns = re.findall(r'class=["\']([^"\']*btn-luxury[^"\']*)["\']', content)
    for b in set(btns):
        has_primary = 'btn-luxury-primary' in b
        has_secondary = 'btn-luxury-secondary' in b or 'btn-luxury-outline' in b
        if not (has_primary or has_secondary):
            print(f"WARNING: btn-luxury without primary/secondary in {hf}: class='{b}'")

print("Button class audit complete.")

print("\n=== 3. CHECKING UNCLOSED TAGS (div, section, section-padding) ===")
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    div_open = len(re.findall(r'<div\b', content))
    div_close = len(re.findall(r'</div\b', content))
    sec_open = len(re.findall(r'<section\b', content))
    sec_close = len(re.findall(r'</section\b', content))
    if div_open != div_close:
        print(f"ERROR in {hf}: <div> open={div_open}, close={div_close}")
        all_ok = False
    if sec_open != sec_close:
        print(f"ERROR in {hf}: <section> open={sec_open}, close={sec_close}")
        all_ok = False

if all_ok:
    print("ALL INTEGRITY CHECKS PASSED PERFECTLY!")
else:
    print("SOME CHECKS FAILED - REVIEW ABOVE.")
