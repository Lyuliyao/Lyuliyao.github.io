#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BIB_PATH = ROOT / "publications" / "mybib.bib"
LINKS_PATH = ROOT / "publications" / "links.json"
CORR_PATH = ROOT / "publications" / "corresponding.json"
OUTPUT_PATH = ROOT / "publications" / "publications.generated.html"
PAGE_PATH = ROOT / "publication.html"
START_MARK = "<!-- AUTO:PUBLICATIONS START -->"
END_MARK = "<!-- AUTO:PUBLICATIONS END -->"


def split_entries(text: str) -> list[str]:
    entries = []
    i = 0
    n = len(text)
    while i < n:
        at = text.find("@", i)
        if at == -1:
            break
        brace_start = text.find("{", at)
        if brace_start == -1:
            break
        depth = 0
        j = brace_start
        while j < n:
            ch = text[j]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    entries.append(text[at : j + 1])
                    i = j + 1
                    break
            j += 1
        else:
            break
    return entries


def split_top_level(text: str) -> list[str]:
    parts = []
    buf = []
    depth = 0
    in_quote = False
    escape = False
    for ch in text:
        if escape:
            buf.append(ch)
            escape = False
            continue
        if ch == "\\":
            buf.append(ch)
            escape = True
            continue
        if ch == '"' and depth == 0:
            in_quote = not in_quote
            buf.append(ch)
            continue
        if ch == "{" and not in_quote:
            depth += 1
        elif ch == "}" and not in_quote and depth > 0:
            depth -= 1
        if ch == "," and depth == 0 and not in_quote:
            part = "".join(buf).strip()
            if part:
                parts.append(part)
            buf = []
        else:
            buf.append(ch)
    tail = "".join(buf).strip()
    if tail:
        parts.append(tail)
    return parts


def clean_value(value: str) -> str:
    v = value.strip()
    if (v.startswith("{") and v.endswith("}")) or (v.startswith('"') and v.endswith('"')):
        v = v[1:-1].strip()
    while v.startswith("{") and v.endswith("}"):
        v = v[1:-1].strip()
    v = v.replace("\\&", "&").replace("~", " ")
    return v


def parse_entry(entry_text: str) -> dict | None:
    m = re.match(r"@\s*([a-zA-Z]+)\s*\{\s*([^,]+)\s*,", entry_text, re.S)
    if not m:
        return None
    entry_type = m.group(1).lower()
    if entry_type in {"comment", "preamble", "string"}:
        return None
    key = m.group(2).strip()
    body = entry_text[m.end() : -1].strip()
    fields: dict[str, str] = {}
    for part in split_top_level(body):
        if "=" not in part:
            continue
        name, value = part.split("=", 1)
        fields[name.strip().lower()] = clean_value(value)
    fields["type"] = entry_type
    fields["key"] = key
    return fields


def normalize_name(name: str) -> str:
    cleaned = re.sub(r"\s+", " ", name.strip())
    if "," in cleaned:
        last, first = [p.strip() for p in cleaned.split(",", 1)]
        cleaned = f"{first} {last}".strip()
    return cleaned.lower()


def strip_star(name: str) -> tuple[str, bool]:
    cleaned = name.strip()
    if cleaned.endswith("\\*"):
        return cleaned[:-2].rstrip(), True
    if cleaned.endswith("*"):
        return cleaned[:-1].rstrip(), True
    return cleaned, False


def format_authors(author_field: str, corresponding_names: list[str]) -> str:
    if not author_field:
        return ""
    corr_norm = {normalize_name(n) for n in corresponding_names if n}
    authors = [a.strip() for a in author_field.split(" and ") if a.strip()]
    formatted = []
    for author in authors:
        author_clean, star_mark = strip_star(author)
        if "," in author_clean:
            last, first = [p.strip() for p in author_clean.split(",", 1)]
            name = f"{first} {last}".strip()
        else:
            name = author_clean.strip()
        is_corr = star_mark or (normalize_name(name) in corr_norm)
        if name.lower() == "liyao lyu":
            rendered = f"<b>{html.escape(name)}</b>"
        else:
            rendered = html.escape(name)
        if is_corr:
            rendered = f"{rendered}<sup>*</sup>"
        formatted.append(rendered)
    return ", ".join(formatted)


def normalize_title(title: str) -> str:
    t = title.replace("{", "").replace("}", "").strip()
    t = re.sub(r"\s+", " ", t).strip()
    if t.endswith("."):
        t = t[:-1]
    return t


def link_html(url: str, label: str) -> str:
    safe_url = html.escape(url, quote=True)
    safe_label = html.escape(label.upper())
    return f'<a href="{safe_url}" class="logo">[{safe_label}]</a>'


def format_links(entry: dict, links_map: dict) -> str:
    links = []
    url = entry.get("url", "")
    doi = entry.get("doi", "")
    if url:
        label = "PDF" if url.lower().endswith(".pdf") else "LINK"
        links.append(link_html(url, label))
    elif doi:
        links.append(link_html(f"https://doi.org/{doi}", "DOI"))

    extra = links_map.get(entry.get("key", ""), {})
    if isinstance(extra, dict):
        for label, href in extra.items():
            if not href:
                continue
            links.append(link_html(str(href), str(label)))
    return " ".join(links)


def format_entry(entry: dict, links_map: dict, corr_map: dict) -> str:
    corr_names = get_corresponding_names(entry, corr_map)
    authors_html = format_authors(entry.get("author", ""), corr_names)
    year = entry.get("year", "").strip()
    title = normalize_title(entry.get("title", ""))
    venue = entry.get("journal") or entry.get("booktitle") or ""

    parts = []
    if authors_html:
        authors_block = authors_html
        if year or title or venue:
            authors_block += "."
        parts.append(authors_block)
    if year:
        parts.append(f"{html.escape(year)}.")
    if title:
        parts.append(f"\"{html.escape(title)}\"")
    if venue:
        parts.append(f"<em>{html.escape(venue)}</em>")

    text = " ".join(parts).strip()
    links_html = format_links(entry, links_map)
    if links_html:
        text = f"{text} {links_html}"
    return f"  <li>{text}</li>"


def load_links() -> dict:
    if LINKS_PATH.exists():
        try:
            return json.loads(LINKS_PATH.read_text())
        except json.JSONDecodeError:
            return {}
    return {}

def load_corresponding() -> dict:
    if CORR_PATH.exists():
        try:
            return json.loads(CORR_PATH.read_text())
        except json.JSONDecodeError:
            return {}
    return {}


def get_corresponding_names(entry: dict, corr_map: dict) -> list[str]:
    names: list[str] = []
    mapped = corr_map.get(entry.get("key", ""), None)
    if isinstance(mapped, str):
        names.append(mapped)
    elif isinstance(mapped, list):
        names.extend([n for n in mapped if isinstance(n, str)])
    field = entry.get("corresponding", "") or entry.get("correspondence", "")
    if field:
        raw_parts = re.split(r";|\\s+and\\s+", field, flags=re.I)
        names.extend([p.strip() for p in raw_parts if p.strip()])
    # De-dup by normalized name while preserving order
    seen = set()
    unique: list[str] = []
    for n in names:
        norm = normalize_name(n)
        if norm and norm not in seen:
            seen.add(norm)
            unique.append(n)
    return unique


def build_list_html(entries: list[dict], links_map: dict, corr_map: dict) -> str:
    items = [format_entry(e, links_map, corr_map) for e in entries]
    return "<ol reversed>\n" + "\n".join(items) + "\n</ol>"


def update_page(list_html: str) -> None:
    text = PAGE_PATH.read_text()
    if START_MARK not in text or END_MARK not in text:
        raise SystemExit("Markers not found in publication.html")
    before, rest = text.split(START_MARK, 1)
    _, after = rest.split(END_MARK, 1)
    new_text = f"{before}{START_MARK}\n{list_html}\n{END_MARK}{after}"
    PAGE_PATH.write_text(new_text)


def main() -> None:
    if not BIB_PATH.exists():
        raise SystemExit(f"Bib file not found: {BIB_PATH}")
    bib_text = BIB_PATH.read_text()
    entries = []
    for raw in split_entries(bib_text):
        parsed = parse_entry(raw)
        if parsed:
            year_text = parsed.get("year", "")
            year_num = int(re.sub(r"\\D", "", year_text) or 0)
            parsed["year_num"] = year_num
            entries.append(parsed)

    entries.sort(key=lambda e: (e.get("year_num", 0), e.get("title", "").lower()), reverse=True)
    links_map = load_links()
    corr_map = load_corresponding()
    list_html = build_list_html(entries, links_map, corr_map)
    OUTPUT_PATH.write_text(list_html)
    if "--write" in sys.argv:
        update_page(list_html)


if __name__ == "__main__":
    main()
