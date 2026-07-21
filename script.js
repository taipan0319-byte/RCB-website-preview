(() => {
  const menu = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#mobile-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
  }));

  document.querySelector('#year').textContent = new Date().getFullYear();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = reduced ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => reduced ? el.classList.add('visible') : observer.observe(el));

  /* ---- Split-flap letter board ---- */
  const board = document.querySelector('#board');
  const toggle = document.querySelector('.motion-toggle');
  if (!board) return;

  const COLS = 16;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+.';
  const SEQ = [
    { l1: 'GLP-1 COSTS',     l2: 'EXPLODING',    tone: 'problem', hold: 2100 },
    { l1: 'PBM CONTRACTS',   l2: 'CONFUSING',    tone: 'problem', hold: 2100 },
    { l1: 'CLAIMS',          l2: 'KEEP RISING',  tone: 'problem', hold: 2100 },
    { l1: 'CHRONIC DISEASE', l2: 'UNCONTROLLED', tone: 'problem', hold: 2100 },
    { l1: 'RISKS',           l2: 'UNKNOWN',      tone: 'problem', hold: 2100 },
    { l1: 'NOW BRING IN',    l2: 'RCB',          tone: 'rcb',     hold: 2800 },
    { l1: 'SATISFACTION',    l2: 'INCREASED',    tone: 'aim',     hold: 2300 },
    { l1: 'OUTCOMES',        l2: 'IMPROVED',     tone: 'aim',     hold: 2300 },
    { l1: 'PER CAPITA COST', l2: 'REDUCED',      tone: 'aim',     hold: 3000 },
  ];

  const pad = s => {
    const left = Math.floor((COLS - s.length) / 2);
    return (' '.repeat(left) + s).padEnd(COLS, ' ').slice(0, COLS);
  };

  const ROWS = 4, TEXT_ROWS = [1, 2]; // blank flap rows above and below the message
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div');
    row.className = 'board-row';
    for (let c = 0; c < COLS; c++) {
      const el = document.createElement('span');
      el.className = 'cell settled';
      el.textContent = ' ';
      row.appendChild(el);
      cells.push({ el, col: c, char: ' ', target: ' ', stopAt: 0, flickAt: 0, settled: true });
    }
    board.appendChild(row);
  }

  const setCell = (cell, ch, settled) => {
    cell.char = ch;
    cell.el.textContent = ch === ' ' ? ' ' : ch;
    cell.el.classList.toggle('settled', settled);
    cell.el.classList.toggle('rolling', !settled);
  };

  const boardText = msg => pad('') + pad(msg.l1) + pad(msg.l2) + pad('');

  let idx = -1, paused = false, advanceTimer = 0, raf = 0;

  if (reduced) {
    // Static end state; the pause control becomes a play button so
    // reduced-motion visitors can opt in to the animations.
    const msg = SEQ[5];
    board.dataset.tone = msg.tone;
    boardText(msg).split('').forEach((ch, i) => setCell(cells[i], ch, true));
    paused = true;
    toggle.setAttribute('aria-pressed', 'true');
    toggle.setAttribute('aria-label', 'Play animation');
    toggle.textContent = '▶';
  }

  function show(msg) {
    board.dataset.tone = msg.tone;
    const text = boardText(msg);
    const now = performance.now();
    let rollEnd = 0;
    cells.forEach((cell, i) => {
      const target = text[i];
      cell.target = target;
      if (target === cell.char) {
        // A few idle blank flaps flutter briefly so the whole board feels mechanical.
        if (target !== ' ' || Math.random() > .12) return;
      }
      cell.settled = false;
      cell.stopAt = now + 420 + cell.col * 68 + Math.random() * 260;
      cell.flickAt = now;
      rollEnd = Math.max(rollEnd, cell.stopAt);
    });
    return rollEnd - now;
  }

  function frame(now) {
    if (paused) return;
    cells.forEach(cell => {
      if (cell.settled) return;
      if (now >= cell.stopAt) {
        cell.settled = true;
        setCell(cell, cell.target, true);
      } else if (now >= cell.flickAt) {
        setCell(cell, CHARS[Math.floor(Math.random() * CHARS.length)], false);
        cell.flickAt = now + 48 + Math.random() * 42;
      }
    });
    raf = requestAnimationFrame(frame);
  }

  function advance() {
    idx = (idx + 1) % SEQ.length;
    const msg = SEQ[idx];
    const rollDur = show(msg);
    advanceTimer = setTimeout(advance, rollDur + msg.hold);
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    if (paused) {
      clearTimeout(advanceTimer);
      cancelAnimationFrame(raf);
      document.body.classList.remove('motion-on');
      document.dispatchEvent(new Event('rcb-motion-off'));
    } else {
      document.body.classList.add('motion-on');
      document.dispatchEvent(new Event('rcb-motion-on'));
      raf = requestAnimationFrame(frame);
      advance();
    }
  });

  if (!reduced) {
    raf = requestAnimationFrame(frame);
    advance();
  }
})();

/* Enterprise risk management: rotating layer cube + tenet sync */
(() => {
  const stack = document.getElementById('erm-stack');
  if (!stack) return;
  const N = 4, GAP = 74, D = 240, H = 44;
  const labels = Array.from(document.querySelectorAll('#tenets > div'), d => d.textContent.trim());
  const slabs = [], tags = [];
  for (let i = 0; i < N; i++) {
    const slab = document.createElement('div');
    slab.className = 'erm-slab';
    slab.style.transform = `translateY(${(i - (N - 1) / 2) * GAP}px)`;
    for (let f = 0; f < 4; f++) {
      const el = document.createElement('div');
      el.className = 'erm-face';
      el.style.transform = `rotateY(${f * 90}deg) translateZ(${D / 2}px)`;
      el.style.opacity = String(1 - i * .12);
      el.style.setProperty('--sheen-delay', `${-(f * 5.5 + i * 1.3)}s`);
      const tag = document.createElement('span');
      tag.textContent = labels[i] || '';
      el.appendChild(tag);
      tags.push({ el: tag, f });
      slab.appendChild(el);
    }
    const top = document.createElement('div');
    top.className = 'erm-face top';
    top.style.transform = `rotateX(90deg) translateZ(${H / 2}px)`;
    slab.appendChild(top);
    stack.appendChild(slab);
    slabs.push(slab);
  }

  // JS-driven rotation: label opacity follows each face's angle to the viewer,
  // so text is only shown right-reading and fades near edge-on.
  const setAngle = deg => {
    stack.style.transform = `rotateX(-24deg) rotateY(${deg}deg)`;
    tags.forEach(t => {
      const c = Math.cos((deg + t.f * 90) * Math.PI / 180);
      const mag = Math.pow(Math.abs(c), 1.4);
      // Far faces are seen through the glass from behind: dim them and flip the
      // text horizontally so it still reads correctly, never mirrored.
      t.el.style.opacity = (c > 0 ? mag : mag * .4).toFixed(3);
      t.el.style.transform = c > 0 ? '' : 'scaleX(-1)';
    });
  };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tenets = document.querySelectorAll('#tenets > div');
  let spinning = false, spinRaf = 0, syncTimer = 0, k = 0;
  const spin = ms => { setAngle((ms / 22000 * 360) % 360); spinRaf = requestAnimationFrame(spin); };
  const startMotion = () => {
    if (spinning) return;
    spinning = true;
    spinRaf = requestAnimationFrame(spin);
    if (tenets.length === N) syncTimer = setInterval(() => {
      tenets.forEach((t, j) => t.classList.toggle('active', j === k));
      slabs.forEach((s, j) => s.classList.toggle('active', j === k));
      k = (k + 1) % N;
    }, 2800);
  };
  const stopMotion = () => {
    spinning = false;
    cancelAnimationFrame(spinRaf);
    clearInterval(syncTimer);
  };
  if (reducedMotion) {
    setAngle(-30);
    document.addEventListener('rcb-motion-on', startMotion);
    document.addEventListener('rcb-motion-off', stopMotion);
  } else {
    startMotion();
  }
})();
