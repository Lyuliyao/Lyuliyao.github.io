# Research_Overview_2025_Nov

35-minute research talk (reveal.js): **Structure-Preserving Machine Learning of Closures:
from coarse-grained molecular dynamics to density functionals**.

Structure (approx. timing):

| Part | Content | Slides | Time |
|---|---|---|---|
| Intro | title, multiscale background, roadmap (three closures) | 3 | 4 min |
| I | CGMD with many-body non-Markovian memory (from `topics/01-cgmd`, IPAM deck) | 15 | 12 min |
| II | Structure-preserving neural density functional for polymer electrolytes (`paper/ongoing_paper/CDFT_electrolytes`) | 11 | 14 min |
| III | Kinetic heat-flux closure, memory / thermodynamics / similarity (`paper/ongoing_paper/plasma-heatflux-closure`) | 3 | 4 min |
| End | summary, references | 2 | 1 min |

Assets: `figure/cdft_*.png` are rendered from the CDFT paper's `figures/*.pdf`;
`figure/plasma_*.png` are copied from the plasma paper's `figures/`; CGMD assets
(`figure/Q.png`, `hatQ.png`, `permutation.js`, `md.js`, `title.js`, `text/*.js`,
`html/vel_evol.html`) are copied from `IPAM/`. `cdft_system.png`, `cdft_gamma.png`
and `cdft_coupling.png` are crops of CDFT figures 1, 4 and 6.

Style: one message per slide, stated in the title; a figure carries the slide;
at most one line of text. Numbers and derivations are in the speaker notes.

Open `index.html` in a browser (needs network for MathJax / Plotly / d3 CDNs).
Press `S` for speaker notes.
