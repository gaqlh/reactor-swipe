"""Genera los íconos PNG de la extensión (círculo ámbar con una tarjeta de feed) sin dependencias."""
import math
import os
import struct
import zlib

AMBER = (245, 165, 36)
INK = (26, 18, 6)
OUT = os.path.join(os.path.dirname(__file__), "..", "extension", "icons")


def png(size, pixels):
    raw = b"".join(b"\x00" + bytes(c for px in row for c in px) for row in pixels)

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def inside_round_rect(x, y, x0, y0, x1, y1, r):
    if x < x0 or x > x1 or y < y0 or y > y1:
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def draw(size):
    ss = 4  # supersampling para bordes suaves
    rows = []
    for py in range(size):
        row = []
        for px in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(ss):
                for sx in range(ss):
                    x = (px + (sx + 0.5) / ss) / size * 24
                    y = (py + (sy + 0.5) / ss) / size * 24
                    color, alpha = None, 0
                    if (x - 12) ** 2 + (y - 12) ** 2 <= 11.5 ** 2:
                        color, alpha = AMBER, 255
                        # tarjeta del feed y dos líneas de texto
                        if inside_round_rect(x, y, 6.2, 4.6, 17.8, 13.4, 1.8) and not inside_round_rect(x, y, 7.8, 6.2, 16.2, 11.8, 0.8):
                            color = INK
                        if 6.2 <= x <= 17.8 and 15.4 <= y <= 17.0:
                            color = INK
                        if 6.2 <= x <= 13.6 and 18.6 <= y <= 20.2:
                            color = INK
                    if color:
                        acc[0] += color[0]
                        acc[1] += color[1]
                        acc[2] += color[2]
                        acc[3] += alpha
            n = ss * ss
            a = acc[3] / n
            if a == 0:
                row.append((0, 0, 0, 0))
            else:
                k = acc[3] / 255
                row.append((round(acc[0] / k), round(acc[1] / k), round(acc[2] / k), round(a)))
        rows.append(row)
    return rows


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for s in (48, 96, 128):
        with open(os.path.join(OUT, f"icon-{s}.png"), "wb") as f:
            f.write(png(s, draw(s)))
        print("icon", s)
