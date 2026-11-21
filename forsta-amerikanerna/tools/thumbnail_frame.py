"""Tar en ren bakgrundsbild ur filmläget (utan filmskyltar och HUD), som underlag för en YouTube-miniatyr.
Kör samma återupptagning som render_film.py: kamerans sista 150 rutor före vald ruta.
Kräver: Python-paketet playwright med Chromium.
Usage: python3 tools/thumbnail_frame.py <sv|en> <ruta> <ut.png>
Exempel: python3 tools/thumbnail_frame.py en 4800 bg-en.png   (ruta 4800 = 2:40, kapitel 4)"""
import asyncio, os, sys
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = "file://" + os.path.join(HERE, "index.html") + "?film=1&lang={lang}"
ARGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]


async def main(lang, frame, out):
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=ARGS)
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto(PAGE.format(lang=lang))
        await page.wait_for_function("window.FA && FA.film && FA.film.ok")
        total = await page.evaluate("FA.film.total")
        if not 0 <= frame < total:
            raise SystemExit(f"ruta {frame} utanför 0..{total - 1}")
        await page.evaluate(f"(function(){{for(var i={max(0, frame - 150)};i<={frame};i++) FA.film.frame(i);}})()")
        await page.evaluate("document.getElementById('film').style.visibility='hidden';"
                            "document.getElementById('hud').style.visibility='hidden'")
        await page.screenshot(path=out)
        await browser.close()
        if errors:
            raise SystemExit("sidfel: " + "; ".join(errors[:3]))
    print(out)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    asyncio.run(main(sys.argv[1], int(sys.argv[2]), sys.argv[3]))
