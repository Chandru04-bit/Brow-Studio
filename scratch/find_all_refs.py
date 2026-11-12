import glob, re

for f in ['css/components.css', 'css/style.css', 'css/responsive.css']:
    with open(f, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    for i, line in enumerate(lines):
        if 'hero-floating-badge' in line or 'about-tag' in line:
            print(f'{f}:{i+1}: {line.strip()}')
