"""Draw the pixel-art mascot and write its two 3x3 sprite sheets.

    python3 scripts/mascot.py

public/mascots/directions.png: frame (row, col) looks toward (col - 1, row - 1),
so the centre frame looks straight ahead.
public/mascots/reactions.png: nine expressions played when the mascot is clicked.
Every frame is drawn on a 44x44 grid and scaled up with nearest-neighbour.
"""

from pathlib import Path

from PIL import Image

N = 44
SCALE = 8
OUT = Path(__file__).resolve().parent.parent / "public" / "mascots"

PALETTE = {
    "K": (28, 20, 26),  # outline
    "N": (34, 44, 96),  # cap
    "n": (58, 74, 148),  # cap highlight
    "d": (20, 26, 62),  # cap shadow
    "Y": (236, 178, 46),  # tassel
    "y": (190, 132, 24),
    "H": (36, 26, 26),  # hair
    "h": (74, 58, 56),
    "S": (190, 132, 96),  # skin
    "s": (160, 106, 74),
    "L": (214, 160, 122),
    "b": (128, 88, 64),  # beard stubble
    "B": (58, 40, 34),  # moustache
    "e": (36, 22, 20),  # eye outline
    "i": (112, 64, 36),  # iris
    "w": (255, 255, 255),
    "P": (236, 140, 140),  # blush
    "M": (128, 52, 44),  # mouth
    "T": (230, 110, 110),  # tongue
    "G": (166, 172, 166),  # sweatshirt
    "g": (128, 134, 130),
    "l": (196, 200, 196),
    "C": (238, 240, 244),  # chain
    "R": (226, 60, 72),  # heart
    "Z": (96, 120, 255),  # sleepy z
}


class Frame:
    def __init__(self):
        self.g = [["." for _ in range(N)] for _ in range(N)]
        self.ox, self.oy = 0, 4  # character offset leaves room above the cap

    def put(self, x, y, c, raw=False):
        if not raw:
            x, y = x + self.ox, y + self.oy
        if 0 <= x < N and 0 <= y < N:
            self.g[y][x] = c

    def get(self, x, y):
        x, y = x + self.ox, y + self.oy
        return self.g[y][x] if 0 <= x < N and 0 <= y < N else "."

    def ellipse(self, cx, cy, rx, ry, c):
        for y in range(N):
            for x in range(N):
                if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1:
                    self.put(x, y, c)

    def pattern(self, x0, y0, rows, raw=False):
        for dy, row in enumerate(rows):
            for dx, c in enumerate(row):
                if c != ".":
                    self.put(x0 + dx, y0 + dy, c, raw)

    def outline(self):
        filled = [[c != "." for c in row] for row in self.g]
        for y in range(N):
            for x in range(N):
                if filled[y][x]:
                    continue
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    if 0 <= x + dx < N and 0 <= y + dy < N and filled[y + dy][x + dx]:
                        self.g[y][x] = "K"
                        break

    def image(self):
        img = Image.new("RGBA", (N, N), (0, 0, 0, 0))
        for y, row in enumerate(self.g):
            for x, c in enumerate(row):
                if c != ".":
                    img.putpixel((x, y), PALETTE[c] + (255,))
        return img.resize((N * SCALE, N * SCALE), Image.NEAREST)


# --- body, head and hair ------------------------------------------------------

def body(f):
    for y in range(32, 40):
        half = min(8 + (y - 32) * 2, 12)
        for x in range(20 - half, 21 + half):
            f.put(x, y, "G")
        f.put(20 - half, y, "g")
        f.put(20 + half, y, "g")
    for x in range(16, 25):
        f.put(x, 32, "l")
    f.put(15, 33, "l")
    f.put(25, 33, "l")
    for x, y in [(16, 34), (17, 35), (18, 36), (19, 37), (20, 37), (21, 37), (22, 36), (23, 35), (24, 34)]:
        f.put(x, y, "C")
    for y in range(30, 33):
        for x in range(17, 24):
            f.put(x, y, "s")


def head(f):
    f.ellipse(20.5, 22.5, 10.6, 9.4, "S")
    for x, y in [(9, 22), (9, 23), (31, 22), (31, 23), (9, 24), (31, 24)]:
        f.put(x, y, "S")
    f.put(10, 23, "s")
    f.put(30, 23, "s")
    for y in range(18, 31):  # soft shading on the right cheek
        for x in range(27, 31):
            if f.get(x, y) == "S" and x >= 29:
                f.put(x, y, "s")


def hair(f, dx):
    for y in range(9, 15):
        for x in range(9, 32):
            f.put(x, y, "H")
    # jagged fringe; parting follows where he looks
    fringe = {10: 17, 11: 17, 12: 16, 13: 16, 14: 15, 15: 14, 16: 15, 17: 14, 18: 15,
              19: 14, 20: 15, 21: 14, 22: 15, 23: 14, 24: 15, 25: 14, 26: 15, 27: 16, 28: 16, 29: 17, 30: 17}
    for x, bottom in fringe.items():
        for y in range(16, bottom + 1):
            f.put(x + (dx if 12 < x < 28 else 0), y, "H")
    for y in range(12, 22):  # sides falling over the ears
        for x in (8, 9, 10):
            f.put(x, y, "H")
        for x in (30, 31, 32):
            f.put(x, y, "H")
    for x, y in [(7, 13), (6, 15), (7, 18), (33, 13), (34, 16), (33, 19), (8, 22), (32, 22)]:
        f.put(x, y, "H")
    for x, y in [(12, 11), (13, 11), (17, 12), (18, 12), (23, 11), (24, 11), (27, 12), (28, 12), (9, 16), (31, 16), (14, 13), (21, 13)]:
        f.put(x + (dx if 12 < x < 28 else 0), y, "h")


def cap(f):
    board = {3: (15, 25), 4: (10, 30), 5: (5, 35), 6: (9, 31), 7: (14, 26)}
    for y, (a, b) in board.items():
        for x in range(a, b + 1):
            f.put(x, y, "n" if y <= 4 else "N")
    for y in (8, 9, 10):
        for x in range(10, 31):
            f.put(x, y, "d" if y == 8 else "N")
    f.put(20, 4, "Y")
    for x in range(21, 32):
        f.put(x, 5, "Y")
    for y in range(6, 12):
        f.put(32, y, "Y")
    f.pattern(31, 12, ["YYY", "YyY", "YyY", ".y."])


# --- faces --------------------------------------------------------------------

EYE_OPEN = ["eeee", "ewie", "eiie", "eiwe", ".ee."]


def eyes(f, kind, dx=0, dy=0):
    for ex in (13, 24):
        x, y = ex + dx, 19 + dy
        if kind == "open":
            f.pattern(x, y, EYE_OPEN)
        elif kind == "happy":
            f.pattern(x, y + 1, [".ee.", "e..e", "e..e"])
        elif kind == "closed":
            f.pattern(x, y + 3, ["eeee"])
        elif kind == "wide":
            f.pattern(x, y - 1, [".ee.", "ewwe", "ewie", "eiie", "ewwe", ".ee."])
        elif kind == "star":
            f.pattern(x - 1, y - 1, ["..Y..", ".YYY.", "YYYYY", ".YYY.", ".Y.Y."])
        elif kind == "spiral":
            f.pattern(x, y, ["eeee", "e..e", "e.ee", "e...", "eeee"])
    # soft, slightly arched eyebrows
    for x, y in [(13, 17), (14, 16), (15, 16)]:
        f.put(x + dx, y + dy, "H")
    for x, y in [(25, 16), (26, 16), (27, 17)]:
        f.put(x + dx, y + dy, "H")


def face(f, mouth="smile", blush=False, dx=0, dy=0):
    f.put(20 + dx, 24 + dy, "s")
    f.put(21 + dx, 25 + dy, "s")
    for y in range(28, 32):  # short beard along the jaw
        for x in range(10, 32):
            if f.get(x, y) in "SsL" and (y >= 30 or x <= 13 or x >= 28):
                f.put(x, y, "b")
    for x in range(18, 24):
        f.put(x + dx, 26 + dy, "B")
    if mouth == "smile":
        f.pattern(18 + dx, 27 + dy, ["M...M", ".MMM."])
    elif mouth == "o":
        f.pattern(19 + dx, 27 + dy, [".M.", "M.M", ".M."])
    elif mouth == "open":
        f.pattern(18 + dx, 27 + dy, ["MMMMM", "MTTTM", ".MMM."])
    elif mouth == "wavy":
        f.pattern(18 + dx, 28 + dy, [".M.M.", "M.M.M"])
    if blush:
        f.pattern(11, 25, ["PPP"])
        f.pattern(28, 25, ["PPP"])
    else:
        f.pattern(12 + dx, 25 + dy, ["PP"])
        f.pattern(28 + dx, 25 + dy, ["PP"])


def character(face_fn, dx=0, extra=None):
    f = Frame()
    body(f)
    head(f)
    hair(f, dx)
    cap(f)
    face_fn(f)
    f.outline()
    if extra:
        extra(f)
    return f.image()


def heart(f):
    f.pattern(18, 0, [".RR.RR.", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."], raw=True)


def stars(f):
    for x, y in [(11, 1), (20, 0), (29, 1)]:
        f.pattern(x, y, [".Y.", "YYY", ".Y."], raw=True)


def zzz(f):
    f.pattern(30, 0, ["ZZZ", "..Z", ".Z.", "ZZZ"], raw=True)
    f.pattern(35, 2, ["ZZ", ".Z", "ZZ"], raw=True)


def sheet(frames):
    w = N * SCALE
    out = Image.new("RGBA", (w * 3, w * 3), (0, 0, 0, 0))
    for i, img in enumerate(frames):
        out.paste(img, ((i % 3) * w, (i // 3) * w))
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    directions = []
    for row in range(3):
        for col in range(3):
            dx, dy = col - 1, row - 1
            directions.append(
                character(lambda f, dx=dx, dy=dy: (eyes(f, "open", dx, dy), face(f, dx=dx, dy=dy)), dx=dx)
            )
    reactions = [
        character(lambda f: (eyes(f, "happy"), face(f))),
        character(lambda f: (eyes(f, "happy"), face(f)), extra=heart),
        character(lambda f: (eyes(f, "happy"), face(f, "open")), extra=stars),
        character(lambda f: (eyes(f, "wide"), face(f, "o"))),
        character(lambda f: (eyes(f, "star"), face(f, "open"))),
        character(lambda f: (eyes(f, "happy"), face(f, blush=True))),
        character(lambda f: (eyes(f, "closed"), face(f, "o")), extra=zzz),
        character(lambda f: (eyes(f, "spiral"), face(f, "wavy"))),
        character(lambda f: (eyes(f, "happy"), face(f, "open", blush=True))),
    ]
    sheet(directions).save(OUT / "directions.png", optimize=True)
    sheet(reactions).save(OUT / "reactions.png", optimize=True)


if __name__ == "__main__":
    main()
