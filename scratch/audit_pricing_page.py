from html.parser import HTMLParser

with open('pricing.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

sections = re.findall(r'<section([^>]*)>(.*?)</section>', html, re.DOTALL)
for i, (attrs, body) in enumerate(sections):
    id_m = re.search(r'id=[\'"]([^\'"]+)[\'"]', attrs)
    class_m = re.search(r'class=[\'"]([^\'"]+)[\'"]', attrs)
    sec_id = id_m.group(1) if id_m else f'sec-{i}'
    sec_class = class_m.group(1) if class_m else ''
    print(f'\n=== Section {i}: id={sec_id} class="{sec_class}" ===')
    
    # Find badges
    badges = re.findall(r'<span[^>]*class=[\'"]([^\'"]*badge[^\'"]*)[\'"][^>]*>(.*?)</span>', body, re.DOTALL)
    for b_cls, b_text in badges:
        clean_text = re.sub(r'<[^>]+>', '', b_text).strip()
        print(f'   BADGE [{b_cls}]: "{clean_text}"')
    
    # Find prices
    prices = re.findall(r'(₹\s*\d+[^<\n]*)', body)
    if prices:
        print(f'   PRICES: {prices[:5]}')
