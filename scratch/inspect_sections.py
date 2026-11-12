import re

for page in ['index.html', 'index2.html']:
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f'=== {page} ===')
    sections = re.findall(r'<section([^>]*)>(.*?)</section>', content, re.DOTALL)
    for i, (attrs, body) in enumerate(sections):
        id_m = re.search(r'id=[\"\']([^\"\']+)[\"\']', attrs)
        sec_id = id_m.group(1) if id_m else f'sec-{i}'
        imgs = re.findall(r'<img[^>]+src=[\"\']([^\"\']+)[\"\'][^>]*>', body)
        print(f'  Section {i}: id={sec_id} ({len(imgs)} imgs)')
        for img in imgs:
            print(f'    src={img}')
