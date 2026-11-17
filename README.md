# A Love Letter to Babe — birthday website

A static website (HTML + CSS + JavaScript). No backend, no build step, no installs.
To preview it, just open `index.html` — or run `python3 -m http.server` in this folder and visit http://localhost:8000.

```
birthday-love-letter/
├── index.html      ← the page structure and the letter text
├── styles.css      ← colours, typography, layout
├── script.js       ← ✏️ the config lives at the very top of this file
└── assets/
    ├── images/     photo-01.jpg … photo-10.jpg, video-cover-01.jpg …
    ├── videos/     memory-01.mp4 … memory-05.mp4
    ├── music/      birthday-song.mp3   (you add this one)
    ├── vendor/     GSAP + ScrollTrigger (bundled, works offline)
    └── favicon.svg
```

## Add the music (needed!)
Drop your song at `assets/music/birthday-song.mp3` (or change `music:` in the config). It starts when he taps
**Open your letter** and loops quietly. Until the file exists the music button simply stays hidden.

## Replace photos
- **Hero photo** (after the envelope): replace `assets/images/photo-01.jpg`, or edit `heroPhoto` in `script.js`.
- **Closing photo**: `assets/images/photo-10.jpg` / `finalPhoto`.
- **Gallery photos & videos**: all in the `birthdayMedia` list in `script.js`.
Keep the same file name, or point `src` at your new file. Portrait or landscape both work (landscape is detected
automatically; you can force it with `shape: "landscape" | "portrait" | "square"`). `position: "50% 25%"` chooses which
part of a photo stays visible when cropped — raise the second number to show more of the bottom.
Tip: export photos around 1600px on the long edge (≈200–400 KB) so the site is fast on phones.

## Add, remove or reorder photos and videos
Edit `birthdayMedia`. Each entry is one memory; the gallery rebuilds itself, in this order.
```js
{ type: "image", src: "assets/images/photo-02.jpg", caption: "One of my favourite views." },
{ type: "video", src: "assets/videos/memory-01.mp4", poster: "assets/images/video-cover-01.jpg",
  caption: "A moment I wish I could relive.", duration: "0:12" },
```
Delete a line to remove it, move a line to reorder. Missing files are skipped, so there are never broken images.
5–10 photos plus a few videos works best.

## Videos
- Put MP4 (H.264/AAC) files in `assets/videos/`. Optionally add `webm: "assets/videos/memory-01.webm"` — it is tried first.
- `poster` is the cover image shown before playing (a still from the video works well).
- Videos never autoplay. They are only downloaded when opened, and they pause and release when closed.
- Keep clips short (under ~30 s, ~720p) so they load quickly on mobile data. A handy command:
  `ffmpeg -i in.mov -vf scale=720:-2 -c:v libx264 -crf 27 -c:a aac -movflags +faststart memory-06.mp4`
- Video keys in the viewer: **Space** play/pause · **← →** previous/next · **M** mute · **F** full screen · **Esc** close.
- While a video plays with sound, the background music pauses and resumes afterwards.

## Change the letter
Open `index.html` and find `<article class="paper">`. Edit the paragraphs directly. Wrap a phrase in
`<mark class="hl">…</mark>` for the handwritten highlight. The appreciation cards, wishes and closing words are in
`index.html` too.

## Change the name
In `script.js`: `recipient: "Babe"` (every "Babe" on the page and the browser tab title update) and
`sender: "Your girl"` (the signature).

## Deploy (free)
**Netlify (easiest):** go to app.netlify.com/drop and drag the whole `birthday-love-letter` folder onto the page.
You get a public link in seconds (rename it under *Site settings*).
**Vercel:** `npm i -g vercel`, then run `vercel` inside the folder and accept the defaults (framework: *Other*).
Afterwards, set `og:image` in `index.html` to the full address of the hero photo, e.g.
`https://your-site.netlify.app/assets/images/photo-01.jpg`, so the link shows a nice preview when shared.

## Good to know
- Accessibility: keyboard friendly, visible focus, descriptive labels, skip link, and `prefers-reduced-motion` is respected.
- The font files load from Google Fonts; without internet the site falls back to similar system fonts.
