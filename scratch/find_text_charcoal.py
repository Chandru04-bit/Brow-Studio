import glob, re

for f in sorted(glob.glob('*.html')):
    with open(f, 'r', encoding='utf-8') as file:
        c = file.read()
    matches = re.findall(r'class=[\'"][^\'"]*text-charcoal[^\'"]*[\'"]', c)
    if matches:
        print(f'{f}: {len(matches)} occurrences')
        for m in matches:
            print('  ', m)
