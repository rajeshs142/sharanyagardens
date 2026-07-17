/* ── Theme ───────────────────────────────────────────────── */
function initTheme() {
  const theme = (CONFIG.THEME || 'earth').toLowerCase();
  if (theme !== 'earth') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/* ── Lucide icons map (name → lucide icon name) ──────────── */
const ICON_MAP = {
  shield: 'shield', droplets: 'droplets', zap: 'zap',
  trees: 'trees', road: 'arrow-right', landmark: 'landmark',
  waves: 'waves', 'map-pin': 'map-pin', sun: 'sun', phone: 'phone',
  home: 'home',
};

/* ── Birds ───────────────────────────────────────────────── */
function initBirds() {
  const svg = document.getElementById('hero-birds');
  if (!svg) return;

  function makeFlapPath(s, vy) {
    return `M0,0 Q${-10*s},${-vy*s} ${-18*s},0 M0,0 Q${10*s},${-vy*s} ${18*s},0`;
  }

  const BIRD_COUNT = 5;
  const birds = [];
  let rafId = null;
  let lastTime = null;
  let allDone = false;

  for (let i = 0; i < BIRD_COUNT; i++) {
    const g    = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const scale = 0.7 + Math.random() * 0.7;

    path.setAttribute('d', makeFlapPath(scale, 4));
    path.setAttribute('stroke', 'rgba(0,0,0,0.6)');
    path.setAttribute('stroke-width', '1.8');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    g.appendChild(path);
    svg.appendChild(g);

    birds.push({
      el: g,
      path,
      x: -8 - Math.random() * 15,           // stagger entry from left
      y: 8  + Math.random() * 32,            // sky band only
      speed: 0.012 + Math.random() * 0.01,   // px per ms as % of width
      amplitude: 1.2 + Math.random() * 1.8,
      frequency: 0.0007 + Math.random() * 0.0005,
      phase: Math.random() * Math.PI * 2,
      wingSpeed: 0.006 + Math.random() * 0.004, // faster flap
      wingPhase: Math.random() * Math.PI * 2,
      scale,
      done: false,
    });
  }

  function tick(t) {
    if (!lastTime) lastTime = t;
    const dt = Math.min(t - lastTime, 32); // cap dt so first frame doesn't jump
    lastTime = t;

    let activeBirds = 0;

    birds.forEach(bird => {
      if (bird.done) return;

      bird.x += bird.speed * dt;

      if (bird.x > 108) {
        // Bird has crossed the screen — hide and mark done
        bird.el.setAttribute('visibility', 'hidden');
        bird.done = true;
        return;
      }

      activeBirds++;

      const yWaver = Math.sin(t * bird.frequency + bird.phase) * bird.amplitude;
      const px = bird.x / 100 * svg.clientWidth;
      const py = (bird.y + yWaver) / 100 * svg.clientHeight;
      const tilt = yWaver * 1.8;

      bird.el.setAttribute('transform', `translate(${px},${py}) rotate(${tilt})`);

      // Flap: wing dips between 1.5 (up) and 6.5 (down) — bigger range = more visible
      const flapCycle = Math.sin(t * bird.wingSpeed + bird.wingPhase);
      const vy = 4 + flapCycle * 3.5;
      bird.path.setAttribute('d', makeFlapPath(bird.scale, vy));
    });

    if (activeBirds === 0 && !allDone) {
      allDone = true;
      cancelAnimationFrame(rafId);
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}

/* ── Clouds ──────────────────────────────────────────────── */
function initClouds() {
  const container = document.getElementById('hero-clouds');
  if (!container) return;

  // Cloud definitions: top position, size, opacity, speed, color
  const CLOUD_DEFS = [
    { top: 8,  w: 380, h: 120, opacity: 0.07, speed: 28, color: '255,255,255' },
    { top: 18, w: 260, h: 90,  opacity: 0.05, speed: 38, color: '255,255,255' },
    { top: 5,  w: 200, h: 80,  opacity: 0.04, speed: 50, color: '255,255,255' },
    { top: 25, w: 320, h: 100, opacity: 0.04, speed: 44, color: '200,210,255' },
    { top: 12, w: 180, h: 70,  opacity: 0.05, speed: 32, color: '255,255,255' },
  ];

  const clouds = CLOUD_DEFS.map(def => {
    const el = document.createElement('div');
    el.className = 'cloud';
    el.style.cssText = `
      width: ${def.w}px;
      height: ${def.h}px;
      top: ${def.top}%;
      left: -${def.w + 40}px;
      background: rgba(${def.color}, ${def.opacity});
    `;
    container.appendChild(el);
    return { el, speed: def.speed, x: -(def.w + 40 + Math.random() * 200), w: def.w };
  });

  let rafId = null;
  let lastTime = null;
  let running = false;

  function tick(t) {
    if (!running) return;
    if (!lastTime) lastTime = t;
    const dt = Math.min(t - lastTime, 32);
    lastTime = t;

    clouds.forEach(c => {
      c.x += (c.speed / 1000) * dt * 10;
      c.el.style.transform = `translateX(${c.x}px)`;
    });

    rafId = requestAnimationFrame(tick);
  }

  function start(isNightTransition) {
    // Night transition: darker tinted clouds; day: white
    clouds.forEach((c, i) => {
      const color = isNightTransition ? '180,190,220' : '255,255,255';
      const opacity = CLOUD_DEFS[i].opacity;
      c.el.style.background = `rgba(${color}, ${opacity})`;
      c.x = -(c.w + 40 + Math.random() * 300); // reset off left edge
    });
    running = true;
    lastTime = null;
    container.classList.add('visible');
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    container.classList.remove('visible');
    // Wait for fade-out then kill RAF
    setTimeout(() => {
      running = false;
      cancelAnimationFrame(rafId);
    }, 1600);
  }

  return { start, stop };
}

/* ── Hero: 3-image crossfade, then reveal UI ─────────────── */
function initHero() {
  const img1 = document.getElementById('hero-img-1'); // day
  const img2 = document.getElementById('hero-img-2'); // twilight
  const img3 = document.getElementById('hero-img-3'); // night
  const clouds = initClouds();

  const CROSSFADE = 4000;
  const GAP       = 1200;

  function setOpacity(el, val, animated) {
    if (!el) return;
    el.style.transition = animated ? `opacity ${CROSSFADE}ms ease-in-out` : 'none';
    el.style.opacity = String(val);
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function revealUI() {
    document.getElementById('nav').classList.add('revealed');
    document.querySelector('.hero-content').classList.add('revealed');
    document.querySelector('.hero-scroll').classList.add('revealed');
  }

  async function runSequence() {
    // Always animate day → twilight → night
    setOpacity(img1, 1, false);
    setOpacity(img2, 0, false);
    setOpacity(img3, 0, false);
    await wait(50);

    // Transition 1: day → twilight
    clouds.start(false);
    setOpacity(img2, 1, true);
    await wait(CROSSFADE);
    clouds.stop();
    await wait(GAP);

    // Transition 2: twilight → night
    clouds.start(true);
    setOpacity(img3, 1, true);
    await wait(CROSSFADE);
    clouds.stop();

    await brandSequence();
    revealHeroContent();
  }

  runSequence();
}

/* ── Brand sequence: no-op, logo is now part of hero-content ── */
async function brandSequence() {}

/* ── Reveal hero elements one by one ────────────────────── */
async function revealHeroContent() {
  const els = document.querySelectorAll('.hero-el');
  const scroll = document.querySelector('.hero-scroll');

  document.querySelector('.hero-content').classList.add('revealed');

  for (const el of els) {
    el.classList.add('revealed');
    await new Promise(r => setTimeout(r, 400));
  }

  if (scroll) scroll.classList.add('revealed');
}

/* ── Nav: hidden until user scrolls ─────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger / drawer
  const btn    = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;

  function openDrawer() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  // Close on link tap
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Close on outside tap
  document.addEventListener('click', e => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !btn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ── Reveal on scroll ────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ── Amenities: infinite ticker ─────────────────────────── */
const AMENITY_ACCENTS = [
  '#C4622D','#2D7A3A','#C49A2D','#2a6eb5','#7a3a8f',
  '#3a8f7a','#8f5a3a','#3a5a8f','#8f3a5a','#5a8f3a',
];

async function loadAmenities() {
  const strip = document.getElementById('amenity-strip');
  if (!strip) return;

  try {
    const res  = await fetch('data/amenities.csv');
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1).filter(Boolean);

    strip.innerHTML = rows.map((row) => {
      const parts = row.split(',');
      const icon  = parts[0].trim();
      const name  = parts[1].trim();
      const desc  = parts[2] ? parts[2].trim() : '';
      return `<div class="amenity-card">
        <div class="amenity-icon-wrap">
          <div class="amenity-icon" data-lucide="${icon}"></div>
        </div>
        <h3>${name}</h3>
        ${desc ? `<p>${desc}</p>` : ''}
      </div>`;
    }).join('');

    if (window.lucide) lucide.createIcons();

  } catch (e) {
    console.warn('Could not load amenities.csv', e);
  }
}

/* ── Gallery: load from CSV, expanding strip + scroll ───── */
async function loadGallery() {
  const strip = document.getElementById('gallery-strip');
  const btnPrev = document.getElementById('gallery-prev');
  const btnNext = document.getElementById('gallery-next');
  if (!strip) return;

  try {
    const res   = await fetch('data/gallery.csv');
    const text  = await res.text();
    const files = text.trim().split('\n').slice(1).map(l => l.trim()).filter(Boolean);
    if (!files.length) return;

    // Set base item width: fill evenly for few images, fixed for many
    const VIEWPORT_ITEMS = 10; // how many fit at once when there are many
    const baseVw = files.length <= VIEWPORT_ITEMS
      ? Math.floor(100 / files.length)  // fill evenly
      : Math.floor(100 / VIEWPORT_ITEMS); // fixed, enables scroll
    strip.style.setProperty('--item-base', `${baseVw}vw`);

    strip.innerHTML = files.map(f => `
      <div class="gallery-item">
        <img src="gallery/${f}" alt="Sharanya Gardens"
             onerror="this.parentElement.style.display='none'" loading="lazy" />
      </div>`).join('');

    // ── Expand on click/touch ──
    strip.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        if (strip.classList.contains('is-dragging')) return;
        const isActive = item.classList.contains('is-active');
        strip.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('is-active'));
        strip.classList.toggle('has-active', !isActive);
        if (!isActive) item.classList.add('is-active');
      });
    });

    // ── Arrow scroll (one viewport width per click) ──
    const scrollBy = () => strip.clientWidth * 0.85;

    function updateArrows() {
      if (!btnPrev || !btnNext) return;
      btnPrev.classList.toggle('hidden', strip.scrollLeft <= 4);
      btnNext.classList.toggle('hidden', strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4);
    }

    btnPrev?.addEventListener('click', () => { strip.scrollLeft -= scrollBy(); });
    btnNext?.addEventListener('click', () => { strip.scrollLeft += scrollBy(); });
    strip.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();

    // ── Drag to scroll (desktop) ──
    let dragStart = 0, scrollStart = 0, dragged = false;

    strip.addEventListener('mousedown', e => {
      dragStart   = e.clientX;
      scrollStart = strip.scrollLeft;
      dragged     = false;
      strip.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', e => {
      if (!strip.classList.contains('is-dragging')) return;
      const dx = dragStart - e.clientX;
      if (Math.abs(dx) > 4) dragged = true;
      strip.scrollLeft = scrollStart + dx;
    });

    window.addEventListener('mouseup', () => {
      strip.classList.remove('is-dragging');
      setTimeout(() => { dragged = false; }, 0);
    });

  } catch (e) {
    console.warn('Could not load gallery.csv', e);
  }
}

/* ── Plot map: load CSV + Sheets, render SVG polygons ───── */
async function loadPlotMap() {
  const svg     = document.getElementById('plot-svg');
  const tooltip = document.getElementById('plot-tooltip');
  const wrap    = document.getElementById('map-wrap');
  const img     = document.getElementById('layout-img');

  if (!svg || !img) return;

  // Wait for image to load so we know its natural dimensions
  await new Promise(resolve => {
    if (img.complete) resolve();
    else img.addEventListener('load', resolve);
  });

  let plotsData   = [];  // { plot_number, points }
  let sheetsData  = {};  // { plot_number → { status, date } }

  // 1. Load plots.csv (geometry) — format: plot_number,sqft,"x1,y1 x2,y2 ..."
  try {
    const res  = await fetch('data/plots.csv');
    const text = await res.text();
    plotsData = text.trim().split('\n').slice(1)
      .filter(r => r.trim())
      .map(row => {
        // split on first two commas to get num, sqft, then the rest is points (may be quoted)
        const m = row.match(/^([^,]+),([^,]*),(.+)$/);
        if (!m) return null;
        const num   = m[1].trim();
        const sqft  = m[2].trim();
        // points field: pairs like "x1,y1 x2,y2" — commas are within the quoted field
        // stored as "x y x y" space-separated pairs after stripping quotes
        const raw   = m[3].replace(/"/g, '').trim();
        // convert "136,301 173,295" → "136,301 173,295" (SVG polygon points format)
        return { plot_number: num, sqft, points: raw };
      })
      .filter(Boolean);
  } catch (e) {
    console.warn('Could not load plots.csv', e);
    return;
  }

  if (!plotsData.length) return;

  // 2. Load booking status from published Google Sheets CSV
  try {
    const res  = await fetch(CONFIG.SHEETS_CSV_URL);
    const text = await res.text();
    text.trim().split('\n').slice(1).forEach(line => {
      const [num, status, sqft] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      if (num) {
        let s = (status || 'available').toLowerCase().trim();
        if (s === 'sold') s = 'booked';
        sheetsData[num] = { status: s, sqft: sqft || '' };
      }
    });
  } catch (e) {
    console.warn('Could not load Google Sheets data. Showing all as available.', e);
  }

  // Update available stat
  const availableCount = plotsData.filter(p => {
    const s = sheetsData[p.plot_number];
    return !s || s.status === 'available';
  }).length;
  const statEl = document.getElementById('stat-available');
  if (statEl) statEl.textContent = availableCount;

  // 3. Render SVG polygons
  // The points in plots.csv are in the coordinate space of the image natural size.
  // SVG viewBox matches that space; CSS scales it to fit the container.
  const W = img.naturalWidth  || 1000;
  const H = img.naturalHeight || 1000;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  plotsData.forEach(({ plot_number, points }) => {
    const sheetRow = sheetsData[plot_number] || {};
    const status   = sheetRow.status || 'available';
    const date     = sheetRow.date   || '';

    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', points);
    poly.setAttribute('data-plot', plot_number);
    poly.setAttribute('data-status', status);
    if (date) poly.setAttribute('data-date', date);

    // Tooltip
    poly.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const label = CONFIG.STATUS_LABELS[status] || status;
      tooltip.textContent = `Plot ${plot_number} · ${label}`;
      tooltip.classList.add('visible');
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top  = (e.clientY - rect.top  - 36) + 'px';
    });

    poly.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });

    poly.addEventListener('click', () => {
      showPlotPopup({ plot_number, status, sqft: sheetRow.sqft || '' });
    });

    svg.appendChild(poly);
  });
}

/* ── Plot popup ─────────────────────────────────────────── */
function showPlotPopup({ plot_number, status, sqft }) {
  let popup = document.getElementById('plot-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'plot-popup';
    document.body.appendChild(popup);
    popup.addEventListener('click', e => {
      if (e.target === popup) closePopup();
    });
  }

  const label     = CONFIG.STATUS_LABELS[status] || status;
  const statusCls = status === 'available' ? 'pp-available' : status === 'reserved' ? 'pp-reserved' : 'pp-booked';
  const phone     = '+919989886806';
  const msg       = encodeURIComponent(`Hi, I'm interested in Plot No. ${plot_number} at Sharanya Gardens. Please share more details.`);

  popup.innerHTML = `
    <div class="pp-card">
      <button class="pp-close" onclick="document.getElementById('plot-popup').classList.remove('open')">✕</button>
      <p class="pp-label">Plot Details</p>
      <h3 class="pp-num">Plot No. ${plot_number}</h3>
      ${sqft ? `<p class="pp-sqft">${sqft} sq.ft</p>` : ''}
      <div class="pp-status ${statusCls}">${label}</div>
      ${status === 'available' || status === 'reserved'
        ? `<a class="pp-cta" href="https://wa.me/${phone}?text=${msg}" target="_blank" rel="noopener">
             Enquire on WhatsApp
           </a>`
        : `<p class="pp-sold-note">This plot has been booked. Contact us for other available plots.</p>`
      }
    </div>`;
  popup.classList.add('open');
}

function closePopup() {
  const p = document.getElementById('plot-popup');
  if (p) p.classList.remove('open');
}


/* ── Location cars ──────────────────────────────────────── */
function initLocationCar() {
  const scene = document.getElementById('location-scene');
  if (!scene) return;

  // Remove static SVG cars from HTML if present
  ['loc-car-1','loc-car-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // lane: 0 = bottom edge, 1 = middle, 2 = upper lane
  const CARS = [
    { body: '#1a1a2e', cabin: '#16213e', speed: 18, size: 110, lane: 0 },
    { body: '#2e1a1a', cabin: '#3e1616', speed: 12, size: 90,  lane: 2 },
    { body: '#1a2e1a', cabin: '#162e16', speed: 16, size: 100, lane: 1 },
    { body: '#2a1a2e', cabin: '#2e1a3e', speed: 22, size: 85,  lane: 2 },
    { body: '#2e2a1a', cabin: '#3e3016', speed: 14, size: 105, lane: 0 },
  ];

  // road is 80px tall; 3 lanes
  const LANE_BOTTOM = { 0: 2, 1: 24, 2: 48 };

  function makeCar(cfg, idx) {
    const uid = `car${idx}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 50');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('loc-car');
    svg.style.width = cfg.size + 'px';
    svg.style.bottom = LANE_BOTTOM[cfg.lane] + 'px';

    svg.innerHTML = `
      <defs>
        <linearGradient id="beam${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#fffbe6" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#fffbe6" stop-opacity="0"/>
        </linearGradient>
        <filter id="hg${uid}"><feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="tg${uid}"><feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- headlight beam: from front (x=110) going right -->
      <polygon points="110,22 110,28 200,46 200,50 110,50" fill="url(#beam${uid})" opacity="0.45"/>
      <!-- car faces RIGHT: front bumper at right (x=110), rear at left (x=10) -->
      <rect x="10" y="18" width="100" height="22" rx="4" fill="${cfg.body}"/>
      <!-- cabin closer to rear (left-biased) -->
      <rect x="20" y="6"  width="55"  height="16" rx="5" fill="${cfg.cabin}"/>
      <rect x="24" y="9"  width="20"  height="10" rx="2" fill="#ffd98a" opacity="0.4"/>
      <rect x="48" y="9"  width="20"  height="10" rx="2" fill="#ffd98a" opacity="0.3"/>
      <!-- wheels -->
      <circle cx="30"  cy="40" r="9" fill="#111"/><circle cx="30"  cy="40" r="4.5" fill="#2a2a2a"/>
      <circle cx="90"  cy="40" r="9" fill="#111"/><circle cx="90"  cy="40" r="4.5" fill="#2a2a2a"/>
      <!-- headlight at front-right -->
      <rect x="107" y="22" width="5" height="7" rx="1.5" fill="#fffbe6" filter="url(#hg${uid})"/>
      <!-- tail light at rear-left -->
      <rect x="10"  y="22" width="4" height="7" rx="1" fill="#ff3333" filter="url(#tg${uid})" opacity="0.9"/>`;

    scene.appendChild(svg);
    return svg;
  }

  function launchCar(svg, speed) {
    // reset instantly off-screen left
    svg.style.transition = 'none';
    svg.style.left = '-110px';
    // next frame: start transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        svg.style.transition = `left ${speed}s linear`;
        svg.style.left = '110%';
        // loop: schedule next launch just after transition ends
        setTimeout(() => launchCar(svg, speed), speed * 1000 + 100);
      });
    });
  }

  function start() {
    CARS.forEach((cfg, idx) => {
      const svg = makeCar(cfg, idx);
      // stagger launches so they don't all start together
      const delay = idx * 1400;
      setTimeout(() => launchCar(svg, cfg.speed), delay);
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        start();
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  io.observe(scene.closest('section') || scene);
}

/* ── Falling leaves ─────────────────────────────────────── */
function initLeaves() {
  const container = document.getElementById('about-leaves');
  if (!container) return;

  // Autumn palette
  const colors = [
    '#D4622A', '#E8912A', '#C4501A', '#F0A830',
    '#A03818', '#E07828', '#B85020', '#D4882A',
  ];

  const LEAF_COUNT = 5;

  for (let i = 0; i < LEAF_COUNT; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';

    const size      = 8 + Math.random() * 10;       // 8–18px
    const left      = Math.random() * 95;            // spread across left container (0–95%)
    const duration  = 10 + Math.random() * 10;      // 10–20s fall
    const delay     = -(Math.random() * 40);        // spread starts across 40s so they feel occasional
    const drift     = (Math.random() * 120 - 60) + 'px'; // sway left or right
    const spin      = (Math.random() * 720 - 360) + 'deg';
    const color     = colors[Math.floor(Math.random() * colors.length)];
    const skew      = Math.random() > 0.5 ? 'scaleX(-1)' : '';

    leaf.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size * 1.4}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      transform: ${skew};
      --leaf-drift: ${drift};
      --leaf-spin: ${spin};
    `;

    container.appendChild(leaf);
  }
}

/* ── Footer year ─────────────────────────────────────────── */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBirds();
  initLeaves();
  initLocationCar();
  initNav();
  initHero();
  initReveal();
  initYear();
  loadAmenities();
  loadGallery();
  loadPlotMap();

  // Init lucide icons declared in HTML
  if (window.lucide) lucide.createIcons();
});
