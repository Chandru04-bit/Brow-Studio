with open('css/components.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'subpage-hero-badge' in l:
        for j in range(max(0, i-2), min(len(lines), i+30)):
            print(f'{j+1}: {lines[j].strip()}')
        break
