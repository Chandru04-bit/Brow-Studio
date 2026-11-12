import glob, re

for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8') as f:
        c = f.read()
    # Check all img tags
    imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', c)
    # Check for logo references
    logos = [img for img in imgs if 'logo' in img.lower()]
    print(f'=== {html} ===')
    print(f'  Logos found: {logos}')
    # Check for empty circular containers or placeholder classes
    circles = re.findall(r'class=[\'"][^\'"]*(?:privilege-icon|avatar|brand-logo|logo-wrap|circle)[^\'"]*[\'"]', c)
    if circles:
        print(f'  Circular/logo containers: {set(circles)}')
