import glob, os
from PIL import Image

for pattern in ['assets/images/*/*.jpg', 'assets/images/*/*.png', 'scratch/*.jpg', 'scratch/lookbook/*.jpg']:
    files = glob.glob(pattern)
    print(f"\nPattern: {pattern} ({len(files)} files)")
    for f in sorted(files):
        try:
            im = Image.open(f)
            print(f"  {f}: size={im.size}")
        except Exception as e:
            print(f"  {f}: error={e}")
