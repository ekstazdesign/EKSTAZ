"""Site-ready versions of supplied files. Run from the repo root:

    python3 -I dev/prep-assets.py <kind> <source> <name> [--box x0,y0,x1,y1]

kinds
  art    JPEG pair: assets/art/<name>.jpg (<=2000 px) and <name>-sm.jpg (640 px wide)
  mark   red-on-black file cut to a transparent red PNG: assets/marks/<name>.png (<=1024 px)
  letter transparent PNG trimmed to its pixels: assets/letters/<name>.png (<=400x300)

Never upscales. Never recolours artwork. 'mark' keeps only the red channel as alpha, for
site use only; log it in docs/ASSET-SOURCES.md.
"""
import sys
from pathlib import Path
from PIL import Image

RED = (223, 5, 0)


def flatten(im):
    if im.mode == "RGBA":
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        return bg
    return im.convert("RGB")


def art(src, name):
    im = flatten(Image.open(src))
    full = im.copy(); full.thumbnail((2000, 2000))
    full.save(f"assets/art/{name}.jpg", quality=84, optimize=True, progressive=True)
    sm = im.copy(); sm.thumbnail((640, 1280))
    sm.save(f"assets/art/{name}-sm.jpg", quality=80, optimize=True, progressive=True)
    print(name, "full", full.size, "sm", sm.size)


def mark(src, name, box=None):
    im = Image.open(src).convert("RGB")
    if box:
        im = im.crop(box)
    w, h = im.size
    px = im.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            a = max(0, r - max(g, b)) if r > g + 40 else 0
            if a:
                op[x, y] = (*RED, min(255, int(a * 1.15)))
    out = out.crop(out.getbbox())
    out.thumbnail((1024, 1024))
    out.save(f"assets/marks/{name}.png", optimize=True)
    print(name, out.size)


def letter(src, name):
    im = Image.open(src).convert("RGBA")
    im = im.crop(im.getbbox())
    im.thumbnail((400, 300))
    im.save(f"assets/letters/{name}.png", optimize=True)
    print(name, im.size)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    kind, src, name = sys.argv[1:4]
    box = None
    if "--box" in sys.argv:
        box = tuple(int(v) for v in sys.argv[sys.argv.index("--box") + 1].split(","))
    for d in ("art", "marks", "letters"):
        Path(f"assets/{d}").mkdir(parents=True, exist_ok=True)
    {"art": art, "mark": lambda s, n: mark(s, n, box), "letter": letter}[kind](src, name)
