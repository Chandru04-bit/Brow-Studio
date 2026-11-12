import glob, re
from collections import Counter

for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8') as f:
        c = f.read()
    imgs = [img for img in re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', c) if not img.endswith('.svg')]
    counts = Counter(imgs)
    dupes = {k: v for k, v in counts.items() if v > 1}
    print(f'=== {html} ===')
    if dupes:
        for k, v in dupes.items():
            print(f'   DUPE ({v}x): {k}')
    else:
        print('   No duplicated images.')
