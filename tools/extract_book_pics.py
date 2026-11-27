#!/usr/bin/env python3
"""Crop 寶寶猜詞語 / 寶寶猜句子 drawings from the scanned textbooks."""

import json
import os
import re
from pathlib import Path

import cv2
import numpy as np
import pymupdf
from ocrmac import ocrmac
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "pics"
SHEET = Path("/tmp/kuaidu-sheets")
OUT.mkdir(exist_ok=True)
SHEET.mkdir(exist_ok=True)

BOOKS = [
    (1, ROOT / "學前識字第一冊.pdf"),
    (2, ROOT / "學前識字第二冊.pdf"),
    (3, ROOT / "學前識字第三冊.pdf"),
    (4, ROOT / "學前識字第四冊.pdf"),
    (5, ROOT / "學前識字第五冊.pdf"),
    (6, ROOT / "學前識字第六冊.pdf"),
]

CN_NUM = {
    "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6,
    "七": 7, "八": 8, "九": 9, "十": 10, "十一": 11,
}


def page_type(png_path):
    img = Image.open(png_path).rotate(-90, expand=True)
    tmp = "/tmp/ocr-page.png"
    img.save(tmp)
    anns = ocrmac.OCR(tmp, language_preference=["zh-Hant", "zh-Hans"]).recognize()
    text = " ".join(a[0] for a in anns)
    kind = None
    if "猜詞" in text or "猜词" in text:
        kind = "word"
    elif "猜句" in text:
        kind = "sentence"
    lesson = None
    m = re.search(r"第([一二三四五六七八九十]+)課", text)
    if m:
        lesson = CN_NUM.get(m.group(1))
    return kind, lesson, text


def merge_boxes(boxes, gap=14):
    boxes = [list(b) for b in boxes]
    changed = True
    while changed:
        changed = False
        out = []
        used = [False] * len(boxes)
        for i, a in enumerate(boxes):
            if used[i]:
                continue
            ax, ay, aw, ah = a
            for j in range(i + 1, len(boxes)):
                if used[j]:
                    continue
                bx, by, bw, bh = boxes[j]
                area_a = aw * ah
                area_b = bw * bh
                small, big = (area_a, area_b) if area_a < area_b else (area_b, area_a)
                near = (
                    ax - gap <= bx + bw
                    and bx - gap <= ax + aw
                    and ay - gap <= by + bh
                    and by - gap <= ay + ah
                )
                if near and small < big * 0.4:
                    nx = min(ax, bx)
                    ny = min(ay, by)
                    ax, ay, aw, ah = (
                        nx,
                        ny,
                        max(ax + aw, bx + bw) - nx,
                        max(ay + ah, by + bh) - ny,
                    )
                    used[j] = True
                    changed = True
            out.append([ax, ay, aw, ah])
            used[i] = True
        boxes = out
    return boxes


def extract_boxes(bgr):
    h, w = bgr.shape[:2]
    y0, y1 = int(h * 0.07), int(h * 0.93)
    x0, x1 = int(w * 0.05), int(w * 0.78)
    roi = bgr[y0:y1, x0:x1]
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    paper = cv2.inRange(hsv, (0, 0, 208), (180, 45, 255))
    ink = cv2.bitwise_not(paper)
    orange = cv2.inRange(hsv, (5, 70, 140), (28, 255, 255))
    ink = cv2.bitwise_and(ink, cv2.bitwise_not(orange))
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    ink = cv2.morphologyEx(ink, cv2.MORPH_CLOSE, k, iterations=1)
    k2 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    ink = cv2.morphologyEx(ink, cv2.MORPH_OPEN, k2)
    n, _, stats, _ = cv2.connectedComponentsWithStats(ink, 8)
    boxes = []
    area_roi = roi.shape[0] * roi.shape[1]
    for i in range(1, n):
        x, y, bw, bh, area = stats[i]
        if area < 1200 or bw < 28 or bh < 28:
            continue
        if bw * bh > area_roi * 0.72:
            continue
        boxes.append([int(x), int(y), int(bw), int(bh)])
    boxes = merge_boxes(boxes, gap=14)
    boxes = [b for b in boxes if b[2] * b[3] < area_roi * 0.7]
    def sort_key(b):
        cx, cy = b[0] + b[2] / 2, b[1] + b[3] / 2
        row = int(cy / max(1, roi.shape[0] / 3.4))
        return (row, -(cx))
    boxes.sort(key=sort_key)
    crops = []
    for x, y, bw, bh in boxes:
        pad = 10
        xa, ya = max(0, x - pad), max(0, y - pad)
        xb, yb = min(roi.shape[1], x + bw + pad), min(roi.shape[0], y + bh + pad)
        crop = roi[ya:yb, xa:xb]
        crops.append(crop)
    return crops, roi, boxes


def save_upright_jpg(bgr, path, max_side=320):
    rot = cv2.rotate(bgr, cv2.ROTATE_90_COUNTERCLOCKWISE)
    rgb = cv2.cvtColor(rot, cv2.COLOR_BGR2RGB)
    im = Image.fromarray(rgb)
    w, h = im.size
    scale = max_side / max(w, h)
    if scale < 1:
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
    im.save(path, "JPEG", quality=82, optimize=True)


def contact_sheet(paths, out, labels=None):
    if not paths:
        return
    thumbs = []
    for i, p in enumerate(paths):
        im = Image.open(p).convert("RGB")
        im.thumbnail((160, 160))
        canvas = Image.new("RGB", (170, 190), (255, 255, 255))
        canvas.paste(im, ((170 - im.size[0]) // 2, 22))
        thumbs.append(canvas)
    cols = min(6, len(thumbs))
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 170, rows * 190), (255, 248, 240))
    for i, th in enumerate(thumbs):
        sheet.paste(th, ((i % cols) * 170, (i // cols) * 190))
    sheet.save(out)


def has_orange_frame(bgr):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    orange = cv2.inRange(hsv, (4, 60, 120), (30, 255, 255))
    h, w = bgr.shape[:2]
    contours, _ = cv2.findContours(orange, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in contours:
        x, y, bw, bh = cv2.boundingRect(c)
        if bw > w * 0.42 and bh > h * 0.42:
            return True
    return False


def main():
    catalog = []
    for book, pdf in BOOKS:
        doc = pymupdf.open(pdf)
        print(f"book {book} pages={doc.page_count}")
        for i in range(1, doc.page_count):
            low = doc[i].get_pixmap(matrix=pymupdf.Matrix(0.32, 0.32), alpha=False)
            samples = low.samples
            bpp = low.n
            colored = 0
            total = 0
            k = 0
            while k + 2 < len(samples):
                r, g, b = samples[k], samples[k + 1], samples[k + 2]
                mx, mn = max(r, g, b), min(r, g, b)
                if mx - mn > 28 and mx < 250:
                    colored += 1
                total += 1
                k += bpp * 14
            if colored / max(1, total) < 0.045:
                continue
            pix = doc[i].get_pixmap(matrix=pymupdf.Matrix(1.55, 1.55), alpha=False)
            tmp = "/tmp/kuaidu-page.png"
            pix.save(tmp)
            kind, lesson, ocr = page_type(tmp)
            if kind not in ("word", "sentence"):
                if "句" in ocr:
                    kind = "sentence"
                else:
                    kind = "word"
            bgr = cv2.imread(tmp)
            crops, roi, boxes = extract_boxes(bgr)
            if len(crops) < 1:
                continue
            saved = []
            for n, crop in enumerate(crops):
                name = f"b{book}p{i:02d}_{n:02d}.jpg"
                path = OUT / name
                save_upright_jpg(crop, path)
                catalog.append(
                    {
                        "file": name,
                        "book": book,
                        "page": i,
                        "kind": kind,
                        "lesson": lesson,
                        "index": n,
                    }
                )
                saved.append(path)
            contact_sheet(saved, SHEET / f"b{book}p{i:02d}_{kind}_L{lesson}.jpg")
            print(f"  p{i:02d} {kind} L{lesson} crops={len(crops)} ocr={ocr[:48]!r}")
    (OUT / "catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2))
    print("wrote", len(catalog), "images")


if __name__ == "__main__":
    main()
