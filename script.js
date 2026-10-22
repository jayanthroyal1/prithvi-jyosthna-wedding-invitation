(() => {
  const C = window.INVITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mango-leaf thoranam with marigold strings ---------- */
  (function drawThoranam() {
    const w = 480, n = 14, step = w / n;
    let g = `<path d="M0 10 Q${w / 2} 22 ${w} 10" stroke="#c8962f" stroke-width="3" fill="none"/>`;
    for (let i = 0; i < n; i++) {
      const x = step * i + step / 2, y = 10 + 12 * Math.sin(Math.PI * (x / w));
      if (i % 2) {
        g += `<g transform="translate(${x} ${y}) rotate(${(i % 4) - 1.5})">
          <path d="M0 0 C-11 14 -9 34 0 46 C9 34 11 14 0 0Z" fill="#3f7a2a"/>
          <path d="M0 2 V44" stroke="#8cc063" stroke-width="1"/></g>`;
      } else {
        const len = 3 + (i % 3);
        for (let k = 0; k < len; k++) g += `<circle cx="${x}" cy="${y + 6 + k * 11}" r="5.5" fill="${k % 2 ? "#f2b51d" : "#ef7d14"}"/>`;
        g += `<circle cx="${x}" cy="${y + 6 + len * 11}" r="3.5" fill="#d6246b"/>`;
      }
    }
    $(".thoranam").innerHTML = `<svg viewBox="0 0 ${w} 92" preserveAspectRatio="none">${g}</svg>`;
  })();

  /* ---------- Music ---------- */
  const audio = $("#music"), mBtn = $("#musicBtn");
  audio.src = C.music.src;
  audio.volume = C.music.volume;
  const setPlaying = on => {
    mBtn.classList.toggle("playing", on);
    mBtn.classList.toggle("muted", !on);
    mBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  };
  mBtn.addEventListener("click", () => audio.paused ? audio.play().then(() => setPlaying(true)).catch(() => {}) : (audio.pause(), setPlaying(false)));

  // Smooth volume fades (the dhol card hushes the music, then brings it back)
  let fadeTimer = 0;
  const fadeMusic = (to, ms, done) => {
    clearInterval(fadeTimer);
    const from = audio.volume, steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    fadeTimer = setInterval(() => {
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * (++i / steps)));
      if (i >= steps) { clearInterval(fadeTimer); if (done) done(); }
    }, 40);
  };
  let musicHeld = false;
  const holdMusic = () => {
    if (audio.paused) return;
    musicHeld = true;
    fadeMusic(0, 400, () => { audio.pause(); setPlaying(false); });
  };
  const releaseMusic = () => {
    if (!musicHeld) return;
    musicHeld = false;
    audio.volume = 0;
    audio.play().then(() => { setPlaying(true); fadeMusic(C.music.volume, 1500); }).catch(() => {});
  };

  /* ---------- Envelope ---------- */
  const gate = $("#gate");
  const openInvite = () => {
    if (gate.classList.contains("s1")) return;
    const t = ms => reduce ? 0 : ms;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    mBtn.hidden = false;
    $("#invite").removeAttribute("aria-hidden");
    gate.classList.add("s1");                                       // seal gives way
    setTimeout(() => gate.classList.add("s2"), t(350));             // Lord Ganesha draws in gold
    setTimeout(() => gate.classList.add("s3"), t(3700));            // Ganesha rises and fades
    setTimeout(() => {                                              // the doors open
      gate.classList.add("opening");
      document.body.classList.add("opened");
      burst(45);
    }, t(4300));
    setTimeout(startReveals, t(4800));
    setTimeout(() => {
      gate.classList.add("gone");
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
    }, t(6100));
  };
  $("#openBtn").addEventListener("click", openInvite);

  /* ---------- Falling petals ---------- */
  const cv = $("#petals"), ctx = cv.getContext("2d");
  // Rose & marigold petals, talambralu (turmeric rice) and jasmine
  const colors = ["#c0392b", "#e0533c", "#a93226", "#e67e22", "#d35400", "#f1948a"];
  let petals = [], W = 0, H = 0, dpr = 1;
  const kindOf = () => { const r = Math.random(); return r < .6 ? "petal" : r < .85 ? "rice" : "jasmine"; };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
  };
  resize(); addEventListener("resize", resize);
  const petal = (top = true, kind = kindOf()) => ({
    kind, x: Math.random() * W, y: top ? -20 * dpr : Math.random() * H * 0.6,
    r: (kind === "rice" ? 2.2 + Math.random() : kind === "jasmine" ? 4 + Math.random() * 2 : 5 + Math.random() * 6) * dpr,
    vy: (kind === "rice" ? 1.2 + Math.random() : 0.6 + Math.random() * 1.1) * dpr, vx: (Math.random() - .5) * .6 * dpr,
    a: Math.random() * 6.28, va: (Math.random() - .5) * .06, sway: Math.random() * 6.28,
    c: kind === "rice" ? (Math.random() < .5 ? "#f2c230" : "#e8a915") : colors[(Math.random() * colors.length) | 0]
  });
  function burst(k, kind) { if (!reduce) for (let i = 0; i < k; i++) petals.push(petal(false, kind)); }
  const drawJasmine = r => {
    ctx.fillStyle = "#fffdf6";
    for (let i = 0; i < 5; i++) { ctx.rotate(1.2566); ctx.beginPath(); ctx.ellipse(0, -r * .6, r * .32, r * .6, 0, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = "#f2c230"; ctx.beginPath(); ctx.arc(0, 0, r * .18, 0, 6.283); ctx.fill();
  };
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    if (!reduce && gate.classList.contains("opening") && petals.length < 16 && Math.random() < .05) petals.push(petal());
    petals = petals.filter(p => p.y < H + 30 * dpr);
    for (const p of petals) {
      p.sway += .02; p.x += p.vx + Math.sin(p.sway) * .5 * dpr; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = .85;
      if (p.kind === "jasmine") { ctx.globalAlpha = .95; drawJasmine(p.r); }
      else if (p.kind === "rice") { ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .45, 0, 0, 6.283); ctx.fill(); }
      else {
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); ctx.fill();
        ctx.globalAlpha = .25; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(-p.r * .3, -p.r * .1, p.r * .4, p.r * .18, 0, 0, 6.283); ctx.fill();
      }
      ctx.restore();
    }
    requestAnimationFrame(loop);
  })();

  /* ---------- Scroll reveal (staggered within each section) ---------- */
  $$("main section, main footer").forEach(sec => $$(".reveal", sec).forEach((el, i) => el.style.setProperty("--i", Math.min(i, 6))));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -8% 0px" });
  // Started when the envelope opens, so nothing animates unseen behind the doors
  let revealsStarted = false;
  const startReveals = () => { revealsStarted = true; $$(".reveal").forEach(el => io.observe(el)); checkTera(); };
  // Once revealed, drop the stagger delay so later hovers/taps feel instant
  document.addEventListener("transitionend", e => e.target.classList?.contains("in") && e.target.style.removeProperty("--i"));

  /* ---------- Tera lowers as soon as the guest reaches it ---------- */
  const tera = $("#teraStage");
  let teraTimer = 0;
  const teraReached = () => {
    const r = tera.getBoundingClientRect(), vh = innerHeight;
    const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    // most of the curtain is on screen, or the guest has already scrolled past it
    return shown >= r.height * .7 || r.bottom < vh * .5;
  };
  const checkTera = () => {
    if (!revealsStarted || teraTimer || tera.classList.contains("lowered")) return;
    if (teraReached()) teraTimer = setTimeout(() => {
      tera.classList.add("lowered");
      setTimeout(() => burst(30, "rice"), 700);
    }, reduce ? 0 : 250);
  };

  /* ---------- Scroll-linked motion: timeline line, ritual lamps, hero parallax ---------- */
  const timeline = $(".timeline"), parallax = $$("[data-parallax]");
  const ritePath = $("#ritePath"), rites = $$(".rite", ritePath);
  const fill = (el, at) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--p", Math.min(1, Math.max(0, (innerHeight * at - r.top) / r.height)).toFixed(3));
  };
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const vh = innerHeight;
    fill(timeline, .75);
    fill(ritePath, .62);
    rites.forEach(li => li.classList.toggle("lit", li.getBoundingClientRect().top + 30 < vh * .62));
    if (!reduce) parallax.forEach(el => {
      const t = el.getBoundingClientRect().top;
      if (t < vh && t > -vh) el.style.transform = `translate3d(0, ${(-t * el.dataset.parallax).toFixed(1)}px, 0)`;
    });
  };
  addEventListener("scroll", () => {
    checkTera();
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();


  /* ---------- Calendar + directions ---------- */
  $$("[data-cal]").forEach(a => {
    const ev = C.events[a.dataset.cal];
    a.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(ev.title) + "&dates=" + ev.start + "/" + ev.end +
      "&location=" + encodeURIComponent(C.venueQuery);
  });
  $("#directions").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.venueQuery);

  /* ---------- Pick your side ---------- */
  let side = "";
  try { side = localStorage.getItem("pj-side") || ""; } catch (e) {}
  const showSide = () => {
    $$(".side").forEach(b => b.classList.toggle("on", b.dataset.side === side));
    $("#sideNote").textContent = side ? `You're cheering for ${side} ❤` : "";
  };
  $$(".side").forEach(b => b.addEventListener("click", () => {
    side = b.dataset.side; showSide(); burst(18);
    try { localStorage.setItem("pj-side", side); } catch (e) {}
  }));
  showSide();

  /* ---------- Countdown ---------- */
  const target = new Date(C.date).getTime();
  const cd = { D: $("#cdD"), H: $("#cdH"), M: $("#cdM"), S: $("#cdS") };
  const set = (el, v) => { if (el.textContent !== v) { el.textContent = v; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } };
  const tick = () => {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    set(cd.D, String(d).padStart(2, "0")); set(cd.H, String(h).padStart(2, "0"));
    set(cd.M, String(m).padStart(2, "0")); set(cd.S, String(s).padStart(2, "0"));
  };
  tick(); setInterval(tick, 1000);

  /* ---------- RSVP ---------- */
  let attend = "yes";
  $$(".opt").forEach(b => b.addEventListener("click", () => {
    attend = b.dataset.attend;
    $$(".opt").forEach(o => { o.classList.toggle("on", o === b); o.setAttribute("aria-checked", o === b); });
    $("#attendYes").classList.toggle("collapsed", attend === "no");
  }));
  $$(".chip").forEach(c => c.addEventListener("click", () => c.classList.toggle("on")));
  const count = $("#gCount");
  $$(".st-btn").forEach(b => b.addEventListener("click", () => {
    count.value = Math.min(20, Math.max(1, (+count.value || 1) + +b.dataset.step));
  }));
  $("#formLink").href = C.rsvpUrl;
  if (C.callNumber) $("#callLink").href = "tel:" + C.callNumber; else $("#callLine").hidden = true;

  $("#rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#gName").value.trim(), err = $("#fError");
    if (!name) { err.textContent = "Please tell us your name."; $("#gName").focus(); return; }
    const evs = $$(".chip.on").map(c => c.dataset.ev);
    if (attend === "yes" && !evs.length) { err.textContent = "Pick at least one celebration."; return; }
    err.textContent = "";
    const lines = [`RSVP — Prithvi & Jyosthna's wedding`, ``, `Name: ${name}`];
    if (attend === "yes") {
      lines.push(`Attending: Joyfully yes 🎉`, `Celebrations: ${evs.join(", ")}`, `Guests: ${Math.max(1, +$("#gCount").value || 1)}`);
    } else {
      lines.push(`Attending: Regretfully no — sending our blessings 🙏`);
    }
    if (side) lines.push(`Cheering for: ${side}`);
    const text = encodeURIComponent(lines.join("\n"));
    const num = (C.whatsappNumber || "").replace(/\D/g, "");
    window.open(`https://wa.me/${num}?text=${text}`, "_blank", "noopener");
  });

  /* ---------- Reveal modal ---------- */
  const modal = $("#modal");
  let current = null;
  const openCard = kind => {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    current = $(`[data-card="${kind}"]`, modal);
    current.hidden = false;
    if (kind === "rub") initScratch();
    if (kind === "dhol") { resetDhol(); holdMusic(); }
  };
  const closeCard = () => {
    modal.hidden = true; document.body.classList.remove("modal-open");
    if (current) current.hidden = true;
    if (current && current.dataset.card === "dhol") { Dhol.stop(); releaseMusic(); }
    current = null;
  };
  $$("[data-open]").forEach(b => b.addEventListener("click", () => openCard(b.dataset.open)));
  $("#modalClose").addEventListener("click", closeCard);
  modal.addEventListener("click", e => { if (e.target === modal) closeCard(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeCard(); });

  /* Rub to reveal — a turmeric-gold layer that wipes away */
  const scratch = $("#scratch"), sctx = scratch.getContext("2d", { willReadFrequently: true });
  const rubCard = $(".rcard-rub");
  function initScratch() {
    rubCard.classList.remove("done");
    const r = scratch.getBoundingClientRect(), k = Math.min(devicePixelRatio || 1, 2);
    scratch.width = r.width * k; scratch.height = r.height * k;
    sctx.setTransform(k, 0, 0, k, 0, 0);
    sctx.globalCompositeOperation = "source-over";
    const g = sctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#f2d06f"); g.addColorStop(.45, "#d29c2c"); g.addColorStop(.7, "#e8bd4f"); g.addColorStop(1, "#b98322");
    sctx.fillStyle = g; sctx.fillRect(0, 0, r.width, r.height);
    for (let i = 0; i < 900; i++) {
      sctx.fillStyle = `rgba(${Math.random() < .5 ? "255,240,190" : "120,70,0"},${Math.random() * .18})`;
      sctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2);
    }
    sctx.strokeStyle = "rgba(255,245,210,.8)"; sctx.lineWidth = 1.5;
    sctx.strokeRect(14, 14, r.width - 28, r.height - 28);
    sctx.fillStyle = "#fff8e0"; sctx.textAlign = "center";
    sctx.font = `44px "Pinyon Script"`; sctx.fillText("The Wedding", r.width / 2, r.height / 2 - 6);
    sctx.font = `11px Cinzel`; sctx.fillText("R U B   T O   R E V E A L", r.width / 2, r.height / 2 + 26);
    sctx.globalCompositeOperation = "destination-out";
  }
  let rubbing = false, last = null;
  const pt = e => { const r = scratch.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const rub = p => {
    sctx.lineCap = "round"; sctx.lineWidth = 46;
    sctx.beginPath(); sctx.moveTo((last || p).x, (last || p).y); sctx.lineTo(p.x, p.y); sctx.stroke();
    sctx.beginPath(); sctx.arc(p.x, p.y, 23, 0, 6.283); sctx.fill();
    last = p;
  };
  scratch.addEventListener("pointerdown", e => { rubbing = true; last = null; scratch.setPointerCapture(e.pointerId); rub(pt(e)); });
  scratch.addEventListener("pointermove", e => rubbing && rub(pt(e)));
  const endRub = () => {
    if (!rubbing) return; rubbing = false;
    const d = sctx.getImageData(0, 0, scratch.width, scratch.height).data;
    let clear = 0, n = 0;
    for (let i = 3; i < d.length; i += 64) { n++; if (d[i] < 40) clear++; }
    if (clear / n > .45 && !rubCard.classList.contains("done")) { rubCard.classList.add("done"); burst(40); }
  };
  scratch.addEventListener("pointerup", endRub);
  scratch.addEventListener("pointercancel", endRub);

  /* ---------- Dhol: synthesised bass (dagga) and treble (tilli) heads with ghungroo jingles ---------- */
  const Dhol = (() => {
    let ctx = null, out = null, noise = null, voices = [], queueEnd = 0;
    const init = () => {
      if (ctx) return ctx.state === "suspended" ? ctx.resume() : null;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      out = ctx.createGain(); out.gain.value = .9;
      out.connect(comp).connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    };
    const env = (t, peak, decay) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .004);
      g.gain.exponentialRampToValueAtTime(.0001, t + decay);
      g.connect(out); return g;
    };
    const tone = (t, type, f0, f1, peak, decay) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + decay * .6);
      o.connect(env(t, peak, decay)); o.start(t); o.stop(t + decay + .05); voices.push(o);
    };
    const hiss = (t, type, freq, q, peak, decay) => {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      s.connect(f).connect(env(t, peak, decay)); s.start(t); s.stop(t + decay + .05); voices.push(s);
    };
    const hit = {
      D: (t, v) => { tone(t, "sine", 150, 52, .95 * v, .5); hiss(t, "lowpass", 380, .7, .35 * v, .05); },     // dagga — deep boom
      t: (t, v) => { hiss(t, "bandpass", 2600, 1.4, .55 * v, .07); tone(t, "triangle", 560, 430, .22 * v, .11); }, // tilli — crisp tak
      s: (t, v) => { hiss(t, "highpass", 1800, .8, .7 * v, .045); tone(t, "square", 340, 300, .06 * v, .05); },  // open slap
      j: (t, v) => { hiss(t, "bandpass", 7200, 7, .28 * v, .16); },                                            // ghungroo
      X: (t, v) => { hiss(t, "highpass", 3500, .5, .45 * v, 1.4); tone(t, "sine", 120, 45, v, 1); }             // closing crash
    };
    // One bar per tap, building up; the last tap plays the finale with a roll
    const bars = [
      "D..tD.t.",
      "D.tDt.ts",
      "DttDttDt",
      "D.DtDtss"
    ];
    const finale = ["DttDttDtDtDtDtDt", "tttttttttttttttt", "X......."];
    const sixteenth = 60 / 172 / 4;
    const play = (pattern, t0, isRoll) => {
      [...pattern].forEach((ch, i) => {
        const t = t0 + i * sixteenth, accent = i % 4 === 0 ? 1 : .72;
        if (isRoll && ch === "t") return hit.t(t, .35 + .65 * i / 16);
        if (hit[ch]) hit[ch](t, accent);
        if (i % 4 === 0 && ch !== "X") hit.j(t, .9);
      });
      return t0 + pattern.length * sixteenth;
    };
    return {
      // Plays the bar for tap n (0–4); returns seconds until that phrase has finished
      tap(n) {
        try {
          init();
          const now = ctx.currentTime + .02, start = Math.max(now, queueEnd);
          let end = start;
          if (n < 4) end = play(bars[n], start);
          else finale.forEach((bar, i) => { end = play(bar, end, i === 1); });
          if (n === 4) end += .4;  // let the crash ring out
          queueEnd = end;
          return end - ctx.currentTime;
        } catch (e) { return 1; }
      },
      stop() { voices.forEach(v => { try { v.stop(); } catch (e) {} }); voices = []; queueEnd = 0; }
    };
  })();

  let beats = 0, dholDone = 0;
  const flip = $("#dholFlip"), dots = $$("#beats i"), dholBtn = $("#dholBtn");
  function resetDhol() { beats = 0; clearTimeout(dholDone); flip.classList.remove("flipped"); dots.forEach(d => d.classList.remove("on")); }
  dholBtn.addEventListener("click", () => {
    if (beats >= 5) return;
    const secs = Dhol.tap(beats);
    dholBtn.classList.remove("hit"); void dholBtn.offsetWidth; dholBtn.classList.add("hit");
    dots[beats++].classList.add("on");
    if (navigator.vibrate) navigator.vibrate(30);
    if (beats === 5) {
      setTimeout(() => { flip.classList.add("flipped"); burst(40); }, 900);
      // When the dhol finale has rung out, the background music returns
      dholDone = setTimeout(releaseMusic, secs * 1000);
    }
  });
})();
