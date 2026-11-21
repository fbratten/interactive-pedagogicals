"""Renderar filmläget (index.html?film=1) till MP4 per språk: segment om 900 rutor (30 s),
återupptagbart, H.264 1920x1080 i 30 bilder/s, plus ett ljudspår som renderas offline i sidan.
Kräver: Python-paketet playwright med Chromium, samt ffmpeg.
Usage: python3 tools/render_film.py <utmapp> sv en
Ljudet normaliseras inte här; för YouTube: ffmpeg loudnorm (I=-16, TP=-1.5) innan muxning."""
import asyncio, subprocess, sys, os, time, base64, json
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(HERE, "film-out")
PAGE = "file://" + os.path.join(HERE, "index.html") + "?film=1&lang={lang}"
SEG = 900
FF = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-vcodec", "mjpeg",
      "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30"]

def log(msg):
    with open(f"{ROOT}/render.log", "a") as f: f.write(time.strftime("%H:%M:%S ") + msg + "\n")

async def render(lang, browser):
    out = f"{ROOT}/{lang}"; os.makedirs(out, exist_ok=True)
    pg = await browser.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto(PAGE.format(lang=lang)); await pg.wait_for_function("window.FA && FA.film && FA.film.ok")
    info = await pg.evaluate("FA.film.info()"); total = info["total"]
    json.dump(info, open(f"{out}/info.json", "w"), ensure_ascii=False, indent=1)
    nseg = (total + SEG - 1) // SEG
    log(f"{lang}: total {total} frames, {nseg} segments")
    if not os.path.exists(f"{ROOT}/audio.wav"):
        n = await pg.evaluate("FA.film.soundtrack()")
        with open(f"{ROOT}/audio.tmp.wav", "wb") as f:
            for off in range(0, n, 4_000_000):
                f.write(base64.b64decode(await pg.evaluate(f"FA.film.wavChunk({off}, 4000000)")))
        os.rename(f"{ROOT}/audio.tmp.wav", f"{ROOT}/audio.wav"); log(f"audio.wav {n} bytes")
    cur = 0
    for s in range(nseg):
        a, b = s * SEG, min(total, (s + 1) * SEG)
        final = f"{out}/seg_{s:03d}.mp4"
        if os.path.exists(final): continue
        warm = max(cur, a - 150)  # återuppta: kör kamerans sista 150 rutor utan bild
        if warm < a: await pg.evaluate(f"(function(){{for(var i={warm};i<{a};i++) FA.film.frame(i);}})()")
        tmp = f"{out}/seg_{s:03d}.tmp.mp4"
        p = subprocess.Popen(FF + [tmp], stdin=subprocess.PIPE)
        t0 = time.time()
        for i in range(a, b):
            await pg.evaluate(f"FA.film.frame({i})")
            p.stdin.write(await pg.screenshot(type="jpeg", quality=92))
        p.stdin.close(); rc = p.wait()
        if rc != 0: log(f"{lang} seg {s} ffmpeg rc {rc}"); raise SystemExit(1)
        os.rename(tmp, final); cur = b
        log(f"{lang} seg {s+1}/{nseg} done in {time.time()-t0:.0f}s errors={len(errs)}")
    with open(f"{out}/list.txt", "w") as f:
        for s in range(nseg): f.write(f"file 'seg_{s:03d}.mp4'\n")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{out}/list.txt", "-c", "copy", f"{out}/video.tmp.mp4"], check=True)
    os.rename(f"{out}/video.tmp.mp4", f"{out}/video.mp4")
    name = "de-forsta-amerikanerna-sv.mp4" if lang == "sv" else "the-first-americans-en.mp4"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", f"{out}/video.mp4", "-i", f"{ROOT}/audio.wav",
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", f"{out}/final.tmp.mp4"], check=True)
    os.rename(f"{out}/final.tmp.mp4", f"{ROOT}/{name}")
    log(f"{lang} FINISHED {name} errors={errs[:3]}")
    await pg.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        os.makedirs(ROOT, exist_ok=True)
        for lang in sys.argv[2:]: await render(lang, b)
        await b.close()
    log("ALL DONE")
asyncio.run(main())
