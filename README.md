# Oandu–Ikla 360° Project — website

Static, dark-mode version of the former Streamlit app (https://oandu-ikla.streamlit.app/).
No build step, no dependencies — plain HTML/CSS/JS.

```
index.html     page content (all Street View links and videos)
styles.css     dark theme
app.js         click-to-load YouTube players, location search, mobile menu
favicon.svg
images/        photos used on the page
vercel.json    clean URLs + long caching for images
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (either as the repo root, or as a subfolder).
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
   If this folder is not the repo root, set **Root Directory** to `vercel-site`.
4. Deploy.

Or from the CLI: `cd vercel-site && npx vercel` (then `npx vercel --prod`).

## Preview locally

```
cd vercel-site
python -m http.server 8000
```
Open http://localhost:8000
