import glob, re, os

all_html = sorted(glob.glob('*.html'))
missing = []
total_imgs = 0

for h in all_html:
    with open(h, 'r', encoding='utf-8') as f:
        c = f.read()
    imgs = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', c)
    for src in imgs:
        total_imgs += 1
        clean_src = src.split('?')[0]
        if not os.path.exists(clean_src):
            missing.append((h, src))

print(f'Checked {total_imgs} images across {len(all_html)} HTML files.')
if missing:
    print('MISSING IMAGES:')
    for m in missing:
        print(' ', m)
else:
    print('ALL image paths exist on disk!')
