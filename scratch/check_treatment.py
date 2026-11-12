for page in ['about.html', 'services.html']:
    with open(page, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f'=== {page} ===')
    for i, l in enumerate(lines):
        if 'hero-treatment' in l:
            print(f'{i+1}: {l.strip()[:100]}')
