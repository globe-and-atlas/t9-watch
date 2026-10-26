"""Rasterize the licensed Nokja recreation into the watch's bitmap font table."""

import argparse
from pathlib import Path

from PIL import ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/font/NokjaOriginalSmallBold.ttf"
OUTPUT = ROOT / "watchface/src/c/lcd_font.h"
CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:'"
PIXEL_SIZE = 12
THRESHOLD = 128


def render_header() -> str:
    font = ImageFont.truetype(str(SOURCE), PIXEL_SIZE)
    glyphs = []
    height = 0
    for char in CHARS:
        mask = font.getmask(char)
        width, rows = mask.size
        height = max(height, rows)
        if width > 16:
            raise ValueError(f"Glyph {char!r} exceeds 16 columns")
        bitmap = [
            sum(1 << (width - 1 - x) for x in range(width)
                if mask.getpixel((x, y)) >= THRESHOLD)
            for y in range(rows)
        ]
        glyphs.append((char, width, round(font.getlength(char)), bitmap))
    lines = [
        "/* Generated from Nokja Original Small Bold (MIT, deejayy.hu). */",
        "/* Run: python3 execution/generate_lcd_font.py */",
        "#ifndef LCD_FONT_H",
        "#define LCD_FONT_H",
        "#include <stdint.h>",
        f"#define LCD_GLYPH_HEIGHT {height}",
        "typedef struct { uint8_t width; uint8_t advance; uint16_t rows[LCD_GLYPH_HEIGHT]; } LcdGlyph;",
        f"static const char LCD_CHARS[] = \"{CHARS}\";",
        "static const LcdGlyph LCD_GLYPHS[] = {",
    ]
    for char, width, advance, bitmap in glyphs:
        bitmap += [0] * (height - len(bitmap))
        rows = ", ".join(f"0x{row:04x}" for row in bitmap)
        lines.append(f"  {{{width}, {advance}, {{{rows}}}}}, /* {char} */")
    lines += ["};", "#endif", ""]
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="check the generated header without writing")
    args = parser.parse_args()
    content = render_header()
    if args.dry_run:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != content:
            raise SystemExit("LCD font header is missing or stale")
        print("LCD font header matches source")
        return
    OUTPUT.write_text(content, encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
