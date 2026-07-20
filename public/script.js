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

  const canvas = document.querySelector('#signal-canvas');
  const toggle = document.querySelector('.motion-toggle');
  if (!canvas || reduced) { if (toggle) toggle.hidden = true; return; }
  const ctx = canvas.getContext('2d');
  let particles = [], raf, paused = false, w = 0, h = 0, dpr = 1;
  const colors = ['#0070af','#0a8dcc','#2cb5e8','#6ecff1','#175883'];

  function resize() {
    const box = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2); w = box.width; h = box.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); build();
  }
  function build() {
    const count = Math.min(150, Math.max(70, Math.round(w / 5)));
    particles = Array.from({length:count}, (_,i) => ({
      x: Math.random()*w*.52-w*.04, y: h*(.18+Math.random()*.64),
      seed: Math.random()*Math.PI*2, speed:.28+Math.random()*.52,
      lane: (i%6-2.5)*h*.052,
      size:.45+Math.random()*1.25, color:colors[i%colors.length], trail:[]
    }));
  }
  function frame(ms) {
    if (paused) return;
    const t = ms*.00055;
    ctx.clearRect(0,0,w,h);
    const grad = ctx.createRadialGradient(w*.56,h*.5,0,w*.56,h*.5,w*.63);
    grad.addColorStop(0,'rgba(0,112,175,.16)'); grad.addColorStop(1,'rgba(2,14,23,0)');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    particles.forEach((p,i) => {
      const progress = ((t*p.speed+p.seed/(Math.PI*2))%1.22);
      const x = progress*w*1.05-w*.12;
      const focus = Math.max(0, Math.min(1, (x-w*.22)/(w*.55)));
      const chaos = (1-focus)*(h*.17);
      const center = h*.5 + p.lane*focus + Math.sin(p.seed*3)*h*.018*(1-focus);
      const y = center + Math.sin(x*.019+p.seed*5+t*4)*chaos + Math.sin(x*.006+p.seed)*chaos*.55;
      p.trail.push({x,y}); if(p.trail.length>26) p.trail.shift();
      ctx.beginPath();
      p.trail.forEach((pt,j) => j ? ctx.lineTo(pt.x,pt.y) : ctx.moveTo(pt.x,pt.y));
      ctx.strokeStyle = p.color; ctx.globalAlpha=(.08+(i%7)*.025)*(1+focus*1.15); ctx.lineWidth=p.size*(1+focus*.4); ctx.stroke();
      if(i%8===0){ctx.beginPath();ctx.arc(x,y,p.size*1.5,0,Math.PI*2);ctx.fillStyle='#75dcff';ctx.globalAlpha=.45;ctx.fill()}
    });
    const beam=ctx.createLinearGradient(w*.62,0,w,0);beam.addColorStop(0,'rgba(42,183,235,0)');beam.addColorStop(.35,'rgba(42,183,235,.4)');beam.addColorStop(1,'rgba(145,226,255,.85)');
    ctx.fillStyle=beam;
    for(let l=0;l<6;l++){const ly=h*.5+(l-2.5)*h*.052;ctx.globalAlpha=.5+(l===2||l===3?.35:0);ctx.fillRect(w*.62,ly-.6,w*.38,1.2);}
    ctx.globalAlpha=1;ctx.shadowBlur=14;ctx.shadowColor='#39bce9';ctx.fillRect(w*.74,h*.5-h*.132,w*.26,1);ctx.fillRect(w*.74,h*.5+h*.13,w*.26,1);ctx.shadowBlur=0;
    raf=requestAnimationFrame(frame);
  }
  toggle.addEventListener('click', () => {
    paused=!paused; toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused?'Play animation':'Pause animation');toggle.textContent=paused?'▶':'Ⅱ';
    if(!paused) raf=requestAnimationFrame(frame);
  });
  addEventListener('resize',resize,{passive:true});resize();raf=requestAnimationFrame(frame);
})();
