"""Gör en YouTube-miniatyr (1280x720 JPEG) av en bakgrundsbild från thumbnail_frame.py:
globen flyttas åt höger, titeln läggs till vänster på en mörk gradient.
Kräver: Pillow, samt typsnitten Gelasio (titel) och Inter (övrig text); sökvägar hittas med fc-match.
Usage: python3 tools/make_thumbnail.py <sv|en> <bakgrund.png> <ut.jpg>"""
import subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

AMBER, INK, MUTED = (246, 178, 74), (244, 246, 252), (196, 206, 226)
TEXT = {
    "sv": {"kicker": "INTERAKTIV HISTORIA", "title": ["De första", "amerikanerna"],
           "sub": "40 000 år på 5 minuter", "tag": "Arkeologi och genetik sida vid sida"},
    "en": {"kicker": "INTERACTIVE HISTORY", "title": ["The First", "Americans"],
           "sub": "40,000 years in 5 minutes", "tag": "Archaeology and genetics side by side"},
}


def font_file(pattern):
    path = subprocess.run(["fc-match", "-f", "%{file}", pattern], capture_output=True, text=True, check=True).stdout
    if not path:
        raise SystemExit(f"hittar inget typsnitt för {pattern}")
    return path


def serif(size):
    f = ImageFont.truetype(font_file("Gelasio:bold"), size)
    try:
        f.set_variation_by_axes([700])  # Gelasio levereras ofta som variabelt typsnitt
    except (OSError, AttributeError):
        pass  # statiskt typsnitt: redan fet
    return f


def spaced(draw, xy, text, font, fill, spacing):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing


def make(lang, background, out):
    t = TEXT[lang]
    bg = Image.open(background).convert("RGB")
    W, H, SHIFT = 1920, 1080, 400
    if bg.size != (W, H):
        raise SystemExit(f"bakgrunden ska vara {W}x{H}, är {bg.size}")
    im = Image.new("RGB", (W, H), (6, 9, 20))
    im.paste(bg.crop((0, 0, SHIFT, H)), (0, 0))          # stjärnhimmel till vänster
    im.paste(bg.crop((0, 0, W - SHIFT, H)), (SHIFT, 0))  # globen förskjuten åt höger
    shade = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(shade)
    for x in range(W):
        a = 235 if x < 760 else max(0, int(235 * (1 - (x - 760) / 520)))
        sd.line([(x, 0), (x, H)], fill=a)
    shade = shade.filter(ImageFilter.GaussianBlur(30))
    im = Image.composite(Image.new("RGB", (W, H), (5, 8, 18)), im, shade)
    X = 110
    spaced(ImageDraw.Draw(im), (X, 250), t["kicker"], ImageFont.truetype(font_file("Inter:semibold"), 40), AMBER, 7)
    fs, y = serif(150), 315
    for line in t["title"]:
        sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((X, y + 6), line, font=fs, fill=(0, 0, 0, 200))
        sh = sh.filter(ImageFilter.GaussianBlur(10))
        im.paste(sh, (0, 0), sh)
        ImageDraw.Draw(im).text((X, y), line, font=fs, fill=INK)
        y += 170
    d = ImageDraw.Draw(im)
    d.rectangle([X, y + 34, X + 120, y + 42], fill=AMBER)
    d.text((X, y + 70), t["sub"], font=ImageFont.truetype(font_file("Inter:bold"), 70), fill=INK)
    d.text((X, y + 168), t["tag"], font=ImageFont.truetype(font_file("Inter:semibold"), 40), fill=MUTED)
    im.resize((1280, 720), Image.LANCZOS).save(out, "JPEG", quality=90, optimize=True, progressive=True)
    print(out)


if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[1] not in TEXT:
        raise SystemExit(__doc__)
    make(*sys.argv[1:])
