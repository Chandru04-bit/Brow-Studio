import glob, re
from collections import defaultdict

for filepath in sorted(glob.glob('*.html')):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    non_logo = [s for s in srcs if not s.endswith('.svg') and 'testimonials/client' not in s]
    counts = defaultdict(int)
    for s in non_logo:
        counts[s] += 1
    dups = {k: v for k, v in counts.items() if v > 1}
    print(f"{filepath}: total={len(non_logo)} non-logo images")
    if dups:
        for k, v in dups.items():
            print(f"   REPEAT ({v}x): {k}")
