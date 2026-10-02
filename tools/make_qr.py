"""QR para instalar Reactor Swipe en el teléfono, con el número de versión debajo.

Uso: python tools/make_qr.py 1.0.2   →   dist/reactor-swipe-qr.png
"""
import os
import sys

import qrcode
from PIL import Image, ImageDraw, ImageFont

URL = "https://github.com/gaqlh/reactor-swipe/releases/latest/download/reactor-swipe.apk"
ROOT = os.path.join(os.path.dirname(__file__), "..")


def font(size):
    for path in ("C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main():
    version = sys.argv[1] if len(sys.argv) > 1 else ""
    qr = qrcode.QRCode(box_size=12, border=3, error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(URL)
    qr.make(fit=True)
    code = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    w, h = code.size
    out = Image.new("RGB", (w, h + 110), "white")
    out.paste(code, (0, 0))
    draw = ImageDraw.Draw(out)
    title = "Reactor Swipe " + version if version else "Reactor Swipe"
    for text, f, y in ((title, font(40), h - 6), ("Escanéalo para instalar o actualizar", font(24), h + 52)):
        tw = draw.textlength(text, font=f)
        draw.text(((w - tw) / 2, y), text, fill="black", font=f)

    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    path = os.path.join(ROOT, "dist", "reactor-swipe-qr.png")
    out.save(path)
    print(os.path.abspath(path))


if __name__ == "__main__":
    main()
