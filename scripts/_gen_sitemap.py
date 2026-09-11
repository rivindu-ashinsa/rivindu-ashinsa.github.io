from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://rivindu-ashinsa.github.io"
LASTMOD = "2026-09-11"

PAGES = [
    ("/", 1.0, "weekly"),
    ("/updates/", 0.9, "weekly"),
    ("/linkedin/", 0.8, "weekly"),
    ("/apps/", 0.9, "weekly"),
    ("/suggested/", 0.7, "monthly"),
    ("/learning/", 0.8, "weekly"),
    ("/work/", 0.9, "monthly"),
    ("/studio/", 0.7, "monthly"),
    ("/credentials/", 0.7, "monthly"),
    ("/contact/", 0.6, "yearly"),
]


def url_for(path: str) -> str:
    return f"{SITE}/{quote(path.lstrip('/'))}".replace("%2F", "/")


def collect_images() -> dict[str, list[tuple[str, str]]]:
    mapping: dict[str, list[tuple[str, str]]] = {loc: [] for loc, *_ in PAGES}

    def add(page: str, src: str | None, alt: str | None) -> None:
        if not src:
            return
        mapping[page].append((url_for(src), alt or "Rivindu Ashinsa portfolio image"))

    apps = json.loads((ROOT / "data/apps.json").read_text(encoding="utf-8"))
    for item in apps["items"]:
        add("/apps/", item.get("image"), item.get("imageAlt"))
        add("/", item.get("image"), item.get("imageAlt"))

    projects = json.loads((ROOT / "data/projects.json").read_text(encoding="utf-8"))
    for item in projects["items"]:
        add("/work/", item.get("image"), item.get("imageAlt"))
        for shot in item.get("gallery", []):
            add("/work/", shot.get("src"), shot.get("alt"))
        if item.get("demoThumb"):
            add("/work/", item.get("demoThumb"), item.get("demoThumbAlt"))

    linkedin = json.loads((ROOT / "data/linkedin.json").read_text(encoding="utf-8"))
    for item in linkedin["items"]:
        add("/linkedin/", item.get("image"), item.get("imageAlt"))

    creds = json.loads((ROOT / "data/credentials.json").read_text(encoding="utf-8"))
    for item in creds["certifications"] + creds["achievements"]:
        add("/credentials/", item.get("image"), item.get("imageAlt"))

    studio = json.loads((ROOT / "data/studio.json").read_text(encoding="utf-8"))
    ident = studio["identity"]
    add("/studio/", ident.get("photo"), ident.get("photoAlt"))
    add("/", ident.get("photo"), ident.get("photoAlt"))
    return mapping


def main() -> None:
    images = collect_images()
    chunks = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ]
    for loc, priority, freq in PAGES:
        chunks.append("  <url>")
        chunks.append(f"    <loc>{SITE}{loc}</loc>")
        chunks.append(f"    <lastmod>{LASTMOD}</lastmod>")
        chunks.append(f"    <changefreq>{freq}</changefreq>")
        chunks.append(f"    <priority>{priority:.1f}</priority>")
        seen = set()
        for src, alt in images.get(loc, []):
            if src in seen:
                continue
            seen.add(src)
            chunks.append("    <image:image>")
            chunks.append(f"      <image:loc>{escape(src)}</image:loc>")
            chunks.append(f"      <image:title>{escape(alt)}</image:title>")
            chunks.append(f"      <image:caption>{escape(alt)}</image:caption>")
            chunks.append("    </image:image>")
        chunks.append("  </url>")
    chunks.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(chunks) + "\n", encoding="utf-8")
    print("wrote sitemap.xml")


if __name__ == "__main__":
    main()
