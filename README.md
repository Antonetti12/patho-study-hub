# Pathophysiology Study Hub

A self-hosted static site (HTML, CSS, and JavaScript only). No build step.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## GitHub Pages

Upload this folder as a repository (or a `docs/` folder / `gh-pages` branch). All links are relative, so it also works under a project-site subpath such as `https://username.github.io/repo-name/`.

The study-guide PDF is about 53 MB (under GitHub’s 100 MB per-file limit). The whole site is around 80–85 MB because of the lecture decks and that guide.

## Customize the name

Edit `js/config.js` and set `ownerName` (and optionally `title`).

Official answer keys (from the final-review packets, plus a few conservatively matched form items) are scored automatically. Suggested answers on other practice items stay hidden until you open them and are not scored.

This site does not link to the original course Google Site or to the original Google Docs / Slides / Forms URLs. Course files are stored under `files/`.
