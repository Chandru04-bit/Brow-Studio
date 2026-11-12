import glob, re

for html in sorted(glob.glob('*.html')):
    with open(html, 'r', encoding='utf-8') as f:
        c = f.read()
    imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', c)
    unique_imgs = set(imgs)
    print(f'{html}: {len(imgs)} imgs, {len(unique_imgs)} unique')
