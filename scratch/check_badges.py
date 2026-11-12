import glob, re

for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8') as f:
        c = f.read()
    badges = re.findall(r'class=[\'"][^\'"]*(?:badge|tag|float)[^\'"]*[\'"]', c)
    relevant = [b for b in badges if any(k in b for k in ['hero', 'about', 'floating', 'tag', 'atelier'])]
    if relevant:
        print(f'{html}:')
        for b in set(relevant):
            print('  ', b)
