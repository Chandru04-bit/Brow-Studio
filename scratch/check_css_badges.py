import glob, re

classes = [
    'hero-floating-badge',
    'about-tag',
    'about-collage-item',
    'about-collage-grid',
    'about-card-img',
    'subpage-hero-badge',
    'hero-floating-glass-card',
    'hero-editorial-badge',
    'atelier-badge-overlay'
]

for css_file in ['css/components.css', 'css/style.css', 'css/responsive.css']:
    with open(css_file, 'r', encoding='utf-8') as f:
        c = f.read()
    print(f'=== {css_file} ===')
    for cls in classes:
        # Match rules targeting this class
        matches = re.findall(rf'([^{{}}]*\.{cls}[^{{}}]*\{{[^}}]*\}})', c)
        for m in matches:
            clean = re.sub(r'\s+', ' ', m.strip())
            print(f'  {clean[:140]}...')
