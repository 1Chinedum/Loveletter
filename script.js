/* =====================================================================
   A LOVE LETTER TO BABE
   ---------------------------------------------------------------------
   1) EDIT THIS CONFIG to personalise the site.
   2) Everything below the config is the engine — you shouldn't need to
      touch it.
   ===================================================================== */

const birthdayConfig = {
  // Name shown everywhere on the page (hero, letter greeting, finale…)
  recipient: "Babe",
  // Signature under the letter
  sender: "Your girl",

  // Background music. Put your mp3 here (or change this path).
  // If the file is missing the site still works — the music control just hides.
  music: "assets/music/birthday-song.mp3",
  musicVolume: 0.5,            // 0 (silent) … 1 (full)

  // The big photo that appears after the envelope opens
  heroPhoto: {
    src: "assets/images/photo-01.jpg",
    alt: "A smiling portrait of the birthday boy",
    position: "50% 28%"        // which part of the photo stays in view when cropped (x y)
  },

  // The photo behind the final birthday moment
  finalPhoto: {
    src: "assets/images/photo-10.jpg",
    position: "50% 30%"
  },
  // Music & other things live above. Photos and videos live in `birthdayMedia` below.
};

/* ---------------------------------------------------------------------
   MEMORIES — photos and videos, in the order they appear.
   Add, remove or rearrange entries freely; the gallery rebuilds itself.

   type:      "image" or "video"
   src:       file path (for videos: the .mp4)
   webm:      (videos, optional) a .webm version, tried first if present
   poster:    (videos) the cover image shown before playing
   caption:   the line shown under it
   alt:       (optional) description for screen readers
   position:  (optional) which part stays in view when cropped, e.g. "50% 25%"
   shape:     (optional) "portrait" | "landscape" | "square" — overrides the layout
                          rhythm for that item (landscape photos are detected automatically)
   duration:  (videos, optional) label such as "0:12"

   Missing files are skipped gracefully. Videos are only downloaded when opened.
   --------------------------------------------------------------------- */
const birthdayMedia = [
  { type: "image", src: "assets/images/photo-02.jpg", caption: "One of my favourite views.",              alt: "Smiling at the camera, braids and a gold cross necklace", position: "50% 25%" },
  { type: "video", src: "assets/videos/memory-01.mp4", poster: "assets/images/video-cover-01.jpg", caption: "A moment I wish I could relive.",       duration: "0:12", position: "50% 25%" },
  { type: "image", src: "assets/images/photo-03.jpg", caption: "A moment worth keeping.",                  alt: "A calm side profile in a bright yellow shirt",            position: "50% 28%" },
  { type: "image", src: "assets/images/photo-04.jpg", caption: "Your smile, my favourite distraction.",    alt: "A big warm smile in a white outfit",                      position: "50% 30%" },
  { type: "video", src: "assets/videos/memory-02.mp4", poster: "assets/images/video-cover-02.jpg", caption: "A memory worth keeping forever.",       duration: "0:23", position: "50% 30%" },
  { type: "image", src: "assets/images/photo-05.jpg", caption: "Another memory I wouldn't trade.",         alt: "Standing tall at golden hour with his reflection below",  position: "50% 40%" },
  { type: "image", src: "assets/images/photo-06.jpg", caption: "Simply you, and that's enough.",           alt: "A thoughtful look, hand on chin, in a checked shirt",     position: "50% 30%" },
  { type: "video", src: "assets/videos/memory-03.mp4", poster: "assets/images/video-cover-03.jpg", caption: "Little moments, big feelings.",         duration: "0:11", position: "50% 30%" },
  { type: "image", src: "assets/images/photo-07.jpg", caption: "Some pictures hold entire stories.",       alt: "Laughing with a hand over his forehead in the sun",       position: "50% 30%" },
  { type: "video", src: "assets/videos/memory-04.mp4", poster: "assets/images/video-cover-04.jpg", caption: "The kind of happy that's contagious.",  duration: "0:09", position: "50% 28%" },
  { type: "image", src: "assets/images/photo-08.jpg", caption: "Always, exactly as you are.",              alt: "A cheerful glance upward with a gentle smile",            position: "50% 28%" },
  { type: "image", src: "assets/images/photo-09.jpg", caption: "Golden hour suits you.",                   alt: "Standing under a dramatic evening sky",                   position: "50% 35%" },
  { type: "video", src: "assets/videos/memory-05.mp4", poster: "assets/images/video-cover-05.jpg", caption: "Just you, being you.",                  duration: "0:05", position: "50% 30%" }
];

/* =====================================================================
   ENGINE
   ===================================================================== */
(() => {
  "use strict";

  const cfg = birthdayConfig;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const html = document.documentElement;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  const canAnimate = hasGsap && hasST && !reduced;
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (canAnimate) html.classList.add("has-anim");

  try { history.scrollRestoration = "manual"; } catch (e) { /* ignore */ }
  window.scrollTo(0, 0);

  /* ---------- 0. personalisation ---------- */
  $$("[data-recipient]").forEach(n => (n.textContent = cfg.recipient));
  $$("[data-sender]").forEach(n => (n.textContent = cfg.sender));
  document.title = `Happy Birthday, ${cfg.recipient} ❤️`;
  const ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", document.title);

  /* ---------- helpers ---------- */
  function splitWords(el) {
    // Wraps each word in a span (for staggered reveals) while keeping a
    // screen-reader-friendly copy of the original text.
    const original = el.textContent.replace(/\s+/g, " ").trim();
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    const walk = (node, into) => {
      node.childNodes.forEach(child => {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) into.appendChild(document.createTextNode(" "));
            else { const w = document.createElement("span"); w.className = "w"; w.textContent = part; into.appendChild(w); }
          });
        } else if (child.nodeType === 1) {
          const clone = child.cloneNode(false);
          walk(child, clone);
          into.appendChild(clone);
        }
      });
    };
    walk(el, visual);
    const sr = document.createElement("span");
    sr.className = "sr-only"; sr.textContent = original;
    el.textContent = "";
    el.append(sr, visual);
    return $$(".w", visual);
  }

  /* ---------- 1. floating particles / petals ---------- */
  function makeParticles(canvas, opt = {}) {
    const none = { start() {}, stop() {} };
    if (!canvas || reduced || !canvas.getContext) return none;
    const o = Object.assign({ count: 28, petals: 0, rgb: "196,164,119", alpha: 0.55, size: [1, 2.6], petalRgb: "185,130,131" }, opt);
    const ctx = canvas.getContext("2d");
    const small = window.matchMedia("(max-width: 700px)").matches;
    const nDust = Math.round(o.count * (small ? 0.55 : 1));
    const nPetal = Math.round(o.petals * (small ? 0.6 : 1));
    let w = 0, h = 0, raf = 0, running = false, last = 0;
    const parts = [];
    const rnd = (a, b) => a + Math.random() * (b - a);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function dust(initial) {
      return { t: "d", x: rnd(0, w), y: initial ? rnd(0, h) : h + 10, r: rnd(o.size[0], o.size[1]), vy: rnd(0.12, 0.38), sway: rnd(8, 26), ph: rnd(0, 6.28), sp: rnd(0.0006, 0.0016), a: rnd(0.25, 1) };
    }
    function petal(initial) {
      return { t: "p", x: rnd(0, w), y: initial ? rnd(-20, h) : -24, s: rnd(5, 9.5), vy: rnd(0.28, 0.7), sway: rnd(18, 48), ph: rnd(0, 6.28), sp: rnd(0.0004, 0.0011), rot: rnd(0, 6.28), vr: rnd(-0.01, 0.01), flip: rnd(0, 6.28), a: rnd(0.35, 0.7) };
    }
    function populate() {
      parts.length = 0;
      for (let i = 0; i < nDust; i++) parts.push(dust(true));
      for (let i = 0; i < nPetal; i++) parts.push(petal(true));
    }
    function tick(now) {
      if (!running) return;
      const dt = Math.min(40, now - (last || now)) / 16.7; last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p.t === "d") {
          p.y -= p.vy * dt;
          const x = p.x + Math.sin(now * p.sp + p.ph) * p.sway;
          const tw = 0.5 + 0.5 * Math.sin(now * 0.0017 + p.ph);
          if (p.y < -10) parts[i] = dust(false);
          ctx.fillStyle = `rgba(${o.rgb},${(o.alpha * p.a * (0.35 + 0.65 * tw)).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.fill();
        } else {
          p.y += p.vy * dt; p.rot += p.vr * dt; p.flip += 0.012 * dt;
          const x = p.x + Math.sin(now * p.sp + p.ph) * p.sway;
          if (p.y > h + 24) parts[i] = petal(false);
          ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.rot); ctx.scale(Math.cos(p.flip) * 0.55 + 0.6, 1);
          ctx.fillStyle = `rgba(${o.petalRgb},${p.a})`;
          const s = p.s;
          ctx.beginPath(); ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s * 0.95, -s * 0.5, s * 0.7, s * 0.75, 0, s);
          ctx.bezierCurveTo(-s * 0.7, s * 0.75, -s * 0.95, -s * 0.5, 0, -s);
          ctx.fill(); ctx.restore();
        }
      }
      raf = requestAnimationFrame(tick);
    }
    function start() { if (running) return; resize(); if (!parts.length) populate(); running = true; last = 0; raf = requestAnimationFrame(tick); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    if ("ResizeObserver" in window) new ResizeObserver(() => { resize(); }).observe(canvas);
    return { start, stop };
  }

  // Run a particle system only while its section is on screen (saves battery)
  function runWhenVisible(system, target) {
    if (!("IntersectionObserver" in window)) { system.start(); return; }
    new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? system.start() : system.stop())), { rootMargin: "100px" }).observe(target);
  }

  /* ---------- 2. memories gallery (photos + videos) ---------- */
  const galleryGrid = $("#galleryGrid");
  const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"/></svg>';
  const mediaList = (typeof birthdayMedia !== "undefined" ? birthdayMedia : []);

  function dropItem(fig) { if (fig && fig.isConnected) { fig.remove(); if (hasST) ScrollTrigger.refresh(); } }

  function buildGallery() {
    mediaList.forEach((m, i) => {
      const isVideo = m.type === "video";
      const fig = document.createElement("figure");
      fig.className = "g-item" + (isVideo ? " is-video" : "");
      if (m.shape) fig.classList.add("shape-" + m.shape);

      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "gallery__frame";
      btn.setAttribute("aria-label", (isVideo ? "Play video: " : "Open photo: ") + (m.caption || m.alt || i + 1));
      fig.appendChild(btn);

      const coverSrc = isVideo ? m.poster : m.src;
      if (coverSrc) {
        const img = document.createElement("img");
        img.src = coverSrc; img.alt = isVideo ? "" : (m.alt || m.caption || "");
        img.loading = "lazy"; img.decoding = "async";
        if (m.position) img.style.objectPosition = m.position;
        img.addEventListener("load", () => {
          if (!m.shape && img.naturalWidth > img.naturalHeight * 1.15) fig.classList.add("shape-landscape");
        });
        img.addEventListener("error", () => { if (isVideo) { img.remove(); fig.classList.add("no-poster"); } else dropItem(fig); });
        btn.appendChild(img);
      } else if (isVideo) fig.classList.add("no-poster");

      if (isVideo) {
        const play = document.createElement("span");
        play.className = "g-play"; play.setAttribute("aria-hidden", "true"); play.innerHTML = PLAY_SVG;
        btn.appendChild(play);
        if (m.duration) { const d = document.createElement("span"); d.className = "g-dur"; d.setAttribute("aria-hidden", "true"); d.textContent = m.duration; btn.appendChild(d); }
      }

      if (m.caption) {
        const cap = document.createElement("figcaption");
        if (isVideo) { const tag = document.createElement("span"); tag.className = "g-tag"; tag.textContent = "A little film"; cap.appendChild(tag); }
        cap.appendChild(document.createTextNode(m.caption));
        fig.appendChild(cap);
      }
      fig._media = m;
      btn.addEventListener("click", () => lightbox.open($$(".g-item", galleryGrid).indexOf(fig), btn));
      galleryGrid.appendChild(fig);
    });
  }
  buildGallery();

  // After load, quietly check for missing files so gaps close immediately.
  // (Videos are checked with a tiny HEAD request — nothing is downloaded.)
  window.addEventListener("load", () => {
    $$(".g-item", galleryGrid).forEach(fig => {
      const m = fig._media;
      if (m.type === "video") {
        if (location.protocol === "file:") return;
        fetch(m.src, { method: "HEAD" }).then(r => { if (!r.ok) dropItem(fig); }).catch(() => {});
      } else {
        const img = $("img", fig);
        if (img && !img.complete) {
          const probe = new Image();
          probe.onerror = () => dropItem(fig);
          probe.src = img.currentSrc || img.src;
        }
      }
    });
    if (hasST) ScrollTrigger.refresh();
  });

  // Hero & final photos: show a clear placeholder if the file is missing
  function guardPhoto(img, container, name) {
    img.addEventListener("error", () => {
      const ph = document.createElement("div");
      ph.className = "photo-missing"; ph.textContent = `Add your photo: ${name}`;
      img.replaceWith(ph);
    });
  }
  const heroImg = $("#heroImg");
  heroImg.src = cfg.heroPhoto.src; heroImg.alt = cfg.heroPhoto.alt || "";
  heroImg.style.objectPosition = cfg.heroPhoto.position || "50% 30%";
  guardPhoto(heroImg, $("#heroArch"), cfg.heroPhoto.src.split("/").pop());
  const finalImg = $("#finalImg");
  finalImg.src = cfg.finalPhoto.src;
  finalImg.style.objectPosition = cfg.finalPhoto.position || "50% 30%";
  finalImg.addEventListener("error", () => finalImg.remove());

  /* ---------- 3. cinematic lightbox (photos + videos) ---------- */
  const lightbox = (() => {
    const root = $("#lightbox"), img = $("#lbImg"), vid = $("#lbVideo"), media = $("#lbMedia");
    const cap = $("#lbCap"), count = $("#lbCount"), err = $("#lbError");
    const btnClose = $("#lbClose"), btnPrev = $("#lbPrev"), btnNext = $("#lbNext");
    const ctrls = $("#lbControls"), bigPlay = $("#lbBigPlay"), btnPlay = $("#lbPlay");
    const seek = $("#lbSeek"), vol = $("#lbVol"), btnMute = $("#lbMute"), btnFs = $("#lbFs"), time = $("#lbTime");
    let items = [], idx = 0, trigger = null, isOpen = false, savedY = 0, seeking = false;
    const ease = "cubic-bezier(.22,.61,.36,1)";
    const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

    function resetVideo() {
      vid.pause();
      vid.removeAttribute("poster");
      vid.querySelectorAll("source").forEach(s => s.remove());
      vid.removeAttribute("src");
      vid.load();                       // stops any download in progress
      seek.value = 0; time.textContent = "0:00 / 0:00";
      media.classList.remove("is-playing");
    }
    function showVideo(m) {
      img.hidden = true; vid.hidden = false; ctrls.hidden = false; bigPlay.hidden = false; err.hidden = true;
      resetVideo();
      vid.poster = m.poster || "";
      vid.preload = "metadata";
      [["webm", m.webm, "video/webm"], ["mp4", m.src, "video/mp4"]].forEach(([, src, type]) => {
        if (!src) return;
        const s = document.createElement("source"); s.src = src; s.type = type; vid.appendChild(s);
      });
      vid.load();
    }
    function showImage(m) {
      resetVideo();
      vid.hidden = true; ctrls.hidden = true; bigPlay.hidden = true; err.hidden = true; img.hidden = false;
      img.src = m.src; img.alt = m.alt || m.caption || "";
    }
    function render(dir) {
      const m = items[idx]._media;
      if (m.type === "video") showVideo(m); else showImage(m);
      cap.textContent = m.caption || "";
      count.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      btnPrev.hidden = btnNext.hidden = items.length < 2;
      const el = m.type === "video" ? vid : img;
      if (dir && !reduced && el.animate) {
        el.animate([{ opacity: 0, transform: `translateX(${dir * 44}px) scale(.98)` }, { opacity: 1, transform: "none" }], { duration: 520, easing: ease });
        cap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: ease });
      }
      [idx - 1, idx + 1].forEach(n => { const it = items[(n + items.length) % items.length]; if (it && it._media.type === "image") new Image().src = it._media.src; });
    }

    function open(i, from) {
      items = $$(".g-item", galleryGrid);
      if (!items.length) return;
      idx = Math.max(0, i); trigger = from || document.activeElement; isOpen = true;
      savedY = window.scrollY;
      render(0);
      root.hidden = false; void root.offsetWidth;
      root.classList.add("is-open"); html.classList.add("lb-open");
      btnClose.focus({ preventScroll: true });
    }
    function close() {
      if (!isOpen) return; isOpen = false;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      resetVideo();                      // pauses + releases the video
      root.classList.remove("is-open"); html.classList.remove("lb-open");
      window.scrollTo({ top: savedY, behavior: "instant" });   // exactly where they were
      setTimeout(() => { if (!isOpen) root.hidden = true; }, reduced ? 0 : 480);
      if (trigger && trigger.focus) trigger.focus({ preventScroll: true });
      music.resumeAfterVideo();
    }
    function go(dir) {
      if (!isOpen || items.length < 2) return;
      idx = (idx + dir + items.length) % items.length;
      render(dir);
    }

    /* --- video controls --- */
    const togglePlay = () => { if (vid.hidden) return; if (vid.paused) vid.play().catch(() => {}); else vid.pause(); };
    vid.addEventListener("play", () => { media.classList.add("is-playing"); bigPlay.hidden = true; btnPlay.setAttribute("aria-label", "Pause"); music.suspendForVideo(); });
    vid.addEventListener("pause", () => { media.classList.remove("is-playing"); if (!vid.hidden && !vid.ended) bigPlay.hidden = false; btnPlay.setAttribute("aria-label", "Play"); music.resumeAfterVideo(); });
    vid.addEventListener("ended", () => { bigPlay.hidden = false; media.classList.remove("is-playing"); music.resumeAfterVideo(); });
    vid.addEventListener("loadedmetadata", () => { time.textContent = `0:00 / ${fmt(vid.duration)}`; });
    vid.addEventListener("timeupdate", () => {
      if (!vid.duration) return;
      if (!seeking) seek.value = Math.round((vid.currentTime / vid.duration) * 1000);
      seek.style.setProperty("--p", (vid.currentTime / vid.duration) * 100 + "%");
      time.textContent = `${fmt(vid.currentTime)} / ${fmt(vid.duration)}`;
    });
    vid.addEventListener("error", () => { if (!vid.getAttribute("src") && !vid.querySelector("source")) return; err.hidden = false; bigPlay.hidden = true; });
    vid.addEventListener("click", togglePlay);
    bigPlay.addEventListener("click", togglePlay);
    btnPlay.addEventListener("click", togglePlay);
    seek.addEventListener("input", () => { seeking = true; if (vid.duration) vid.currentTime = (seek.value / 1000) * vid.duration; });
    seek.addEventListener("change", () => { seeking = false; });
    vol.addEventListener("input", () => { vid.volume = +vol.value; vid.muted = +vol.value === 0; syncVol(); });
    btnMute.addEventListener("click", () => { vid.muted = !vid.muted; if (!vid.muted && vid.volume === 0) { vid.volume = 0.6; } syncVol(); });
    function syncVol() {
      media.classList.toggle("is-muted", vid.muted || vid.volume === 0);
      vol.value = vid.muted ? 0 : vid.volume;
      vol.style.setProperty("--p", (vid.muted ? 0 : vid.volume * 100) + "%");
      btnMute.setAttribute("aria-label", vid.muted ? "Unmute" : "Mute");
    }
    function toggleFs() {
      if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      const t = media;
      if (t.requestFullscreen) t.requestFullscreen().catch(() => {});
      else if (t.webkitRequestFullscreen) t.webkitRequestFullscreen();
      else if (vid.webkitEnterFullscreen) vid.webkitEnterFullscreen();   // iPhone Safari
    }
    btnFs.addEventListener("click", toggleFs);
    if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled || vid.webkitEnterFullscreen)) btnFs.hidden = true;
    vid.volume = 0.8; syncVol();

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => go(-1));
    btnNext.addEventListener("click", () => go(1));
    $(".lightbox__backdrop", root).addEventListener("click", close);

    document.addEventListener("keydown", e => {
      if (!isOpen) return;
      const onRange = e.target && e.target.type === "range";
      if (e.key === "Escape") { if (!document.fullscreenElement) close(); }
      else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !onRange) go(e.key === "ArrowLeft" ? -1 : 1);
      else if ((e.key === " " || e.key === "k") && !vid.hidden && e.target.tagName !== "BUTTON" && !onRange) { e.preventDefault(); togglePlay(); }
      else if (e.key === "m" && !vid.hidden) btnMute.click();
      else if (e.key === "f" && !vid.hidden) toggleFs();
      else if (e.key === "Tab") {
        const f = $$("button, input", root).filter(b => !b.hidden && b.offsetParent !== null && !b.closest("[hidden]"));
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    // swipe between memories (not while dragging a slider)
    let sx = 0, sy = 0, down = false;
    root.addEventListener("pointerdown", e => { down = !(e.target.closest && e.target.closest(".lb-controls")); sx = e.clientX; sy = e.clientY; });
    root.addEventListener("pointerup", e => {
      if (!down) return; down = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    });
    return { open, close };
  })();

  /* ---------- 4. music ---------- */
  const music = (() => {
    const root = $("#music"), toggle = $("#musicToggle"), mute = $("#musicMute");
    let audio = null, usable = !!cfg.music, fadeRaf = 0;

    if (usable) {
      audio = new Audio();
      audio.loop = true; audio.preload = "auto"; audio.volume = 0;
      audio.addEventListener("error", () => { usable = false; root.hidden = true; });
      audio.src = cfg.music;
    }
    function fade(to, ms = 1800) {
      cancelAnimationFrame(fadeRaf);
      const from = audio.volume, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / ms);
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        if (k < 1) fadeRaf = requestAnimationFrame(step);
      };
      fadeRaf = requestAnimationFrame(step);
    }
    function setUi(playing) {
      root.classList.toggle("is-playing", playing);
      toggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    }
    async function play() {
      if (!audio || !usable) return;
      try { await audio.play(); fade(cfg.musicVolume); setUi(true); }
      catch (e) { setUi(false); }
    }
    function pause() { if (!audio) return; audio.pause(); setUi(false); }

    toggle.addEventListener("click", () => (audio.paused ? play() : pause()));
    mute.addEventListener("click", () => {
      if (!audio) return;
      audio.muted = !audio.muted;
      root.classList.toggle("is-muted", audio.muted);
      mute.setAttribute("aria-pressed", String(audio.muted));
      mute.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
    });
    let suspended = false;
    return {
      get usable() { return usable; },
      play,
      suspendForVideo() { if (audio && !audio.paused) { suspended = true; pause(); } },
      resumeAfterVideo() { if (suspended) { suspended = false; play(); } },
      reveal() {
        if (!usable) return;
        root.hidden = false;
        if (canAnimate) gsap.fromTo(root, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.4 });
      }
    };
  })();

  /* ---------- 4b. optional auto-scroll (a gentle reading mode) ---------- */
  const autoscroll = (() => {
    const btn = $("#autoBtn");
    // pixels per second, by section — slower while he's reading the letter
    const speeds = { hero: 38, letter: 26, gallery: 58, adore: 44, wishes: 40, finale: 36 };
    let on = false, raf = 0, last = 0, pos = 0;

    function currentSpeed() {
      const y = window.innerHeight * 0.4;
      for (const id in speeds) { const r = document.getElementById(id).getBoundingClientRect(); if (r.top <= y && r.bottom > y) return speeds[id]; }
      return 40;
    }
    function frame(now) {
      if (!on) return;
      const dt = Math.min(64, now - (last || now)) / 1000; last = now;
      if (!html.classList.contains("lb-open") && !html.classList.contains("is-locked")) {
        if (Math.abs(window.scrollY - pos) > 3) pos = window.scrollY;          // he moved it himself → resync
        pos += currentSpeed() * dt;
        window.scrollTo({ top: pos, behavior: "instant" });
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (pos >= max - 1) { set(false); return; }                           // reached the end
      }
      raf = requestAnimationFrame(frame);
    }
    function set(v) {
      on = v; btn.setAttribute("aria-pressed", String(v));
      btn.setAttribute("aria-label", v ? "Stop auto-scroll" : "Start auto-scroll");
      cancelAnimationFrame(raf);
      if (v) { pos = window.scrollY; last = 0; raf = requestAnimationFrame(frame); }
    }
    btn.setAttribute("aria-label", "Start auto-scroll");
    btn.addEventListener("click", () => set(!on));
    // any manual scrolling or navigation hands control straight back to him
    ["wheel", "touchmove"].forEach(ev => window.addEventListener(ev, () => { if (on) set(false); }, { passive: true }));
    window.addEventListener("keydown", e => { if (on && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key) && e.target === document.body) set(false); });
    return { stop: () => set(false), reveal() { btn.hidden = false; if (canAnimate) gsap.fromTo(btn, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.5 }); } };
  })();

  /* ---------- 5. hero intro (runs when the letter opens) ---------- */
  const main = $("#main");
  main.setAttribute("inert", "");

  if (canAnimate) {
    gsap.set("#heroArch", { clipPath: "inset(0 0 100% 0)" });
    gsap.set("#heroImg", { scale: 1.35 });
    gsap.set(".hero__ring", { opacity: 0 });
    gsap.set("[data-hero]", { opacity: 0, y: 30 });
  }
  function heroIntro() {
    if (!canAnimate) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("#heroArch", { clipPath: "inset(0 0 0% 0)", duration: 1.7, ease: "power3.inOut" }, 0.2)
      .to("#heroImg", { scale: 1, duration: 2.6 }, 0.2)
      .to(".hero__ring", { opacity: 1, duration: 1.4 }, 0.9)
      .to("[data-hero]", { opacity: 1, y: 0, duration: 1.3, stagger: 0.18, clearProps: "transform" }, 0.7);
  }

  /* ---------- 6. the envelope ---------- */
  const intro = $("#intro"), env = $("#envelope");
  const introParticles = makeParticles($("#introParticles"), { count: 34, alpha: 0.7, size: [1, 2.8] });
  introParticles.start();
  html.classList.add("is-locked");
  $("#openBtn").focus({ preventScroll: true });

  let opened = false;
  function unlock() {
    html.classList.remove("is-locked");
    main.removeAttribute("inert");
    window.scrollTo(0, 0);
  }
  function finishIntro() {
    intro.hidden = true;
    introParticles.stop();
    music.reveal();
    autoscroll.reveal();
    if (hasST) ScrollTrigger.refresh();
    const h1 = $("#heroTitle"); h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true });
  }
  function shatterSeal() {
    const seal = $("#seal");
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("i");
      s.className = "shard"; s.style.margin = "-3px 0 0 -3px";
      env.appendChild(s);
      const a = (Math.PI * 2 * i) / 10 + Math.random() * 0.5, d = 38 + Math.random() * 46;
      gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d + 18, rotation: Math.random() * 360, scale: 0.4 + Math.random(), opacity: 0, duration: 0.95, ease: "power2.out", onComplete: () => s.remove() });
    }
    gsap.to(seal, { opacity: 0, scale: 0.72, duration: 0.45, ease: "power2.in" });
  }

  function openLetter(skip) {
    if (opened) return; opened = true;
    music.play();                                   // user gesture → allowed to start audio
    $("#openBtn").disabled = true;

    if (!hasGsap || skip || reduced) {              // quick elegant fade
      if (hasGsap) {
        unlock(); heroIntro();
        gsap.to(intro, { opacity: 0, duration: reduced ? 0.01 : 0.7, ease: "power2.out", onComplete: finishIntro });
      } else {
        intro.style.transition = "opacity .6s"; intro.style.opacity = "0"; unlock();
        setTimeout(finishIntro, 620);
      }
      return;
    }

    const vh = window.innerHeight;
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finishIntro });
    tl.to('[data-intro="fade"]', { opacity: 0, y: 10, duration: 0.6, stagger: 0.05, ease: "power2.out" }, 0)
      .to("#seal", { scale: 1.16, duration: 0.28, ease: "power2.out" }, 0.05)
      .add(shatterSeal, ">-0.02")
      .to("#envFlap", { rotateX: 180, duration: 1.05 }, ">+0.2")
      .set("#envFlap", { zIndex: 1 }, "<0.5")
      .to("#envLetter", { yPercent: -64, duration: 1.25, ease: "power2.out" }, ">-0.4")
      .to("#envLetter", { yPercent: -108, scale: 1.22, duration: 1.05 }, ">+0.25")
      .to([".env__back", ".env__front", "#envFlap"], { opacity: 0, y: vh * 0.1, duration: 0.9 }, "<")
      .add(() => { unlock(); heroIntro(); }, ">-0.35")
      .to("#envLetter", { opacity: 0, duration: 0.8, ease: "power1.out" }, "<")
      .to(intro, { opacity: 0, duration: 1.1, ease: "power1.inOut" }, "<0.1");
  }
  $("#openBtn").addEventListener("click", () => openLetter(false));
  $("#seal").addEventListener("click", () => openLetter(false));
  $("#skipBtn").addEventListener("click", () => openLetter(true));

  /* ---------- 7. scroll animations ---------- */
  function setupScroll() {
    if (!canAnimate) return;

    // Generic fade-up reveals, gently staggered when several arrive together
    gsap.set("[data-reveal]", { opacity: 0, y: 30 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%", once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12, overwrite: true })
    });

    // Handwritten highlights draw themselves in once their line is read
    $$(".hl").forEach(el => ScrollTrigger.create({ trigger: el, start: "top 78%", once: true, onEnter: () => setTimeout(() => el.classList.add("is-on"), 450) }));

    // Signature writes itself
    const sig = $("#signature span");
    gsap.set(sig, { clipPath: "inset(0 100% 0 0)" });
    gsap.to(sig, { clipPath: "inset(0 0% 0 0)", duration: 2.6, ease: "power2.inOut", scrollTrigger: { trigger: "#signature", start: "top 92%", once: true } });

    // Gallery: reveal + subtle parallax
    $$(".g-item").forEach(fig => {
      const frame = $(".gallery__frame", fig), img = $("img", fig), cap = $("figcaption", fig);
      gsap.from(frame, { opacity: 0, y: 70, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: fig, start: "top 90%", once: true } });
      if (img) gsap.from(img, { scale: 1.22, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: fig, start: "top 90%", once: true } });
      if (cap) gsap.from(cap, { opacity: 0, y: 14, duration: 1.1, delay: 0.35, ease: "power2.out", scrollTrigger: { trigger: fig, start: "top 88%", once: true } });
    });
    const mm = gsap.matchMedia();
    mm.add({ desk: "(min-width: 900px)", mob: "(max-width: 899px)" }, ctx => {
      const amp = ctx.conditions.desk ? 5.5 : 3;
      $$(".g-item").forEach(fig => {
        const img = $("img", fig);
        if (!img) return;
        gsap.fromTo(img, { yPercent: -amp }, { yPercent: amp, ease: "none", immediateRender: false, scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    });

    // Appreciation cards
    gsap.set("[data-card]", { opacity: 0, y: 46 });
    ScrollTrigger.batch("[data-card]", {
      start: "top 90%", once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.16, overwrite: true })
    });

    // Hero: the portrait drifts a little as you leave it
    gsap.to("#heroMedia", { y: -50, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.6 } });

    // Wishes: word-by-word reveal, one at a time
    $$("[data-wish]").forEach(el => {
      const words = splitWords(el);
      gsap.set(words, { opacity: 0, y: 26 });
      gsap.to(words, { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", stagger: 0.085, scrollTrigger: { trigger: el, start: "top 72%", once: true } });
    });

    // Finale: a slow, unhurried sequence
    const finalEls = $$("[data-final]");
    const title = $("#finaleTitle");
    const tWords = splitWords(title);
    gsap.set(finalEls, { opacity: 0, y: 22 });
    gsap.set(title, { opacity: 1, y: 0 });
    gsap.set(tWords, { opacity: 0, y: 34 });
    const [lbl, , wish, thanks, sign, btn] = finalEls;
    gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: "#finale", start: "top 55%", once: true } })
      .to(lbl, { opacity: 1, y: 0, duration: 1.2 }, 0)
      .to(tWords, { opacity: 1, y: 0, duration: 1.5, stagger: 0.22 }, 1)
      .to(wish, { opacity: 1, y: 0, duration: 1.4 }, 2.6)
      .to(thanks, { opacity: 1, y: 0, duration: 1.4 }, 3.7)
      .to(sign, { opacity: 1, y: 0, duration: 1.6 }, 4.7)
      .to(btn, { opacity: 1, y: 0, duration: 1.2 }, 5.6);
    gsap.fromTo(".finale__bg img", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#finale", start: "top bottom", end: "bottom top", scrub: 0.6 } });
  }
  setupScroll();

  // Particles for the burgundy wishes section and the finale (petals too)
  const wishesP = makeParticles($("#wishesParticles"), { count: 46, alpha: 0.75, size: [1, 3] });
  runWhenVisible(wishesP, $("#wishes"));
  const finaleP = makeParticles($("#finaleParticles"), { count: 40, petals: 9, alpha: 0.8, size: [1, 3] });
  runWhenVisible(finaleP, $("#finale"));

  /* ---------- 8. read it again ---------- */
  let backTween = null;
  function killBack() { if (backTween) { backTween.kill(); backTween = null; } }
  ["wheel", "touchstart", "keydown"].forEach(ev => window.addEventListener(ev, killBack, { passive: true }));
  $("#againBtn").addEventListener("click", () => {
    autoscroll.stop();
    if (canAnimate) {
      killBack();
      const o = { y: window.scrollY };
      backTween = gsap.to(o, {
        y: 0, duration: Math.min(3.6, Math.max(1.8, window.scrollY / 3200)), ease: "power3.inOut",
        onUpdate: () => window.scrollTo({ top: o.y, behavior: "instant" }),
        onComplete: () => { backTween = null; const h1 = $("#heroTitle"); h1.focus({ preventScroll: true }); }
      });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  });

  window.addEventListener("load", () => { if (hasST) ScrollTrigger.refresh(); });
})();
