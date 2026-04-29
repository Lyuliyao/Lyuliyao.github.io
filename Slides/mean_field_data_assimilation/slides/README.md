# UCLA Beamer Template (Unofficial)

This is a minimal, **unofficial** Beamer template styled with UCLA-inspired colors.
It includes:
- `beamerthemeUCLA.sty`: theme file (colors, title, footline, section page)
- `main.tex`: example talk using the theme
- `references.bib`: sample BibLaTeX database
- `ucla_logo_placeholder.pdf`: placeholder; replace with official logo if you have permission

## Quick start

### Option A: pdfLaTeX + biber (recommended)
```bash
pdflatex main.tex
biber main
pdflatex main.tex
pdflatex main.tex
```

### Option B: Overleaf
Upload the whole folder (or the zip). Make sure the compiler is set to pdfLaTeX and bibliography tool is **biber**.

### Fonts
The theme uses Helvetica via `\usepackage[scaled]{helvet}` for broad compatibility.
If you prefer system fonts (and XeLaTeX/LuaLaTeX), comment those lines and use `fontspec` instead.

### Logo
Replace `ucla_logo_placeholder.pdf` with an officially provided UCLA logo **only if you have permission** and must follow UCLA Brand Guidelines. If you don't have the logo, simply remove the `\titlegraphic{...}` line in `main.tex`.

---
**Note:** This project is provided *as is*, without official endorsement.
