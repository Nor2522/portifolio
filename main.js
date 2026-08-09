/* ==========================================================================
   NOR — PORTFOLIO SHARED SCRIPT
   Every function checks that its target element exists before running, so
   this one file can be safely included on every page regardless of which
   sections that page has.
   ========================================================================== */
(function(){
'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- boot sequence (index only, plays once per browser session) ---------- */
function initBoot(){
  const boot = document.getElementById('boot');
  if(!boot) return;
  const alreadyBooted = sessionStorage.getItem('nor_booted');
  const el = document.getElementById('boot-text');
  function finish(){
    boot.classList.add('hidden');
    document.body.classList.remove('booting');
    sessionStorage.setItem('nor_booted','1');
    setTimeout(()=>{ if(boot) boot.remove(); },700);
  }
  if(alreadyBooted || reduceMotion){ finish(); return; }
  const lines = [
    '> initializing secure session...',
    '> loading profile: nor',
    '> scanning ports... 22 80 443 open',
    '> verifying credentials... access granted',
    '> welcome.'
  ];
  let li=0, ci=0, out='';
  function typeLine(){
    if(li>=lines.length){ setTimeout(finish,500); return; }
    const line = lines[li];
    if(ci<line.length){
      out += line[ci]; ci++;
      el.innerHTML = out + '<span class="cursor"></span>';
      setTimeout(typeLine, 16+Math.random()*20);
    } else {
      out += '\n'; li++; ci=0;
      setTimeout(typeLine, 200);
    }
  }
  typeLine();
  boot.addEventListener('click', finish);
}

/* ---------- nav: scroll state, progress bar, back-to-top ---------- */
function initNav(){
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress-bar');
  const topBtn = document.getElementById('top-btn');
  if(!nav && !progress && !topBtn) return;
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const denom = (h.scrollHeight-h.clientHeight) || 1;
    const pct = (h.scrollTop)/denom*100;
    if(progress) progress.style.width = pct+'%';
    if(nav) nav.classList.toggle('scrolled', h.scrollTop>40);
    if(topBtn) topBtn.classList.toggle('show', h.scrollTop>500);
  });
  if(topBtn) topBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior: reduceMotion ? 'auto' : 'smooth'}));
}

/* ---------- mobile menu ---------- */
function initMobileMenu(){
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if(!burger || !menu) return;
  burger.addEventListener('click', ()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>menu.classList.remove('open')));
}

/* ---------- typed role text (index hero) ---------- */
function initTypedRoles(){
  const el = document.getElementById('typed');
  if(!el) return;
  const roles = ['Software Developer', 'Penetration Tester', 'Security Researcher'];
  if(reduceMotion){ el.textContent = roles[0]; return; }
  let r=0, c=0, deleting=false;
  function tick(){
    const word = roles[r];
    el.textContent = deleting ? word.slice(0,c--) : word.slice(0,c++);
    let delay = deleting ? 35 : 70;
    if(!deleting && c===word.length+1){ deleting=true; delay=1400; }
    else if(deleting && c===0){ deleting=false; r=(r+1)%roles.length; delay=300; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------- lightweight ambient rain, used site-wide as #bg-rain ---------- */
function initCanvasRain(canvasId, opts){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789';
  const density = (opts && opts.density) || 16;
  const speed = (opts && opts.speed) || 50;
  let w,h,drops;
  function setup(){
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
    const cols = Math.floor(w/density);
    drops = new Array(cols).fill(0).map(()=>Math.random()*-50);
  }
  function draw(){
    ctx.fillStyle = 'rgba(4,7,10,0.09)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#0fa860';
    ctx.font = (density-1)+'px monospace';
    for(let i=0;i<drops.length;i++){
      const ch = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(ch, i*density, drops[i]*density);
      if(drops[i]*density > h && Math.random() > 0.975) drops[i]=0;
      drops[i]++;
    }
  }
  setup();
  window.addEventListener('resize', setup);
  if(!reduceMotion){ setInterval(draw, speed); } else { ctx.fillStyle='rgba(4,7,10,1)'; ctx.fillRect(0,0,w,h); }
}

/* ---------- three.js network sphere (index hero only) ---------- */
let heroMx=0, heroMy=0;
function initHeroScene(){
  const canvas = document.getElementById('hero-3d');
  if(!canvas || typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 9.5;

  const NODE_COUNT = 120, radius = 4.2, maxDist = 1.5;
  const pts = [];
  for(let i=0;i<NODE_COUNT;i++){
    const y = 1-(i/(NODE_COUNT-1))*2;
    const r = Math.sqrt(1-y*y);
    const theta = Math.PI*(1+Math.sqrt(5))*i;
    pts.push(new THREE.Vector3(Math.cos(theta)*r*radius, y*radius, Math.sin(theta)*r*radius));
  }
  const pointsGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const pointsMat = new THREE.PointsMaterial({color:0x39ff88,size:0.07,transparent:true,opacity:0.9});
  const pointCloud = new THREE.Points(pointsGeo,pointsMat);

  const lineVerts = [];
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<pts.length;j++){
      if(pts[i].distanceTo(pts[j]) < maxDist){
        lineVerts.push(pts[i].x,pts[i].y,pts[i].z, pts[j].x,pts[j].y,pts[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts,3));
  const lineMat = new THREE.LineBasicMaterial({color:0x00cc66, transparent:true, opacity:0.16});
  const lines = new THREE.LineSegments(lineGeo,lineMat);

  const group = new THREE.Group();
  group.add(pointCloud); group.add(lines);
  scene.add(group);

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function animate(){
    requestAnimationFrame(animate);
    if(!reduceMotion){
      group.rotation.y += 0.0016;
      group.rotation.x += (heroMy*0.4 - group.rotation.x)*0.02;
      group.rotation.y += (heroMx*0.0015);
    }
    renderer.render(scene,camera);
  }
  animate();
}

/* ---------- hero mousemove: drives 3D tilt + cursor spotlight ---------- */
function initHeroInteraction(){
  const heroEl = document.getElementById('home');
  const spotlight = document.getElementById('spotlight');
  if(!heroEl) return;
  heroEl.addEventListener('mousemove', e=>{
    const rect = heroEl.getBoundingClientRect();
    heroMx = (e.clientX/window.innerWidth)-0.5;
    heroMy = (e.clientY/window.innerHeight)-0.5;
    if(spotlight){
      const px = ((e.clientX-rect.left)/rect.width)*100;
      const py = ((e.clientY-rect.top)/rect.height)*100;
      spotlight.style.setProperty('--sx', px+'%');
      spotlight.style.setProperty('--sy', py+'%');
    }
  });
}

/* ---------- decrypt / scramble text-in effect ---------- */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&*/\\';
function decryptText(el){
  const final = el.dataset.text || el.textContent;
  let iter = 0;
  clearInterval(el._decryptTimer);
  el._decryptTimer = setInterval(()=>{
    el.textContent = final.split('').map((ch,idx)=>{
      if(ch===' ') return ' ';
      if(idx < iter) return final[idx];
      return SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)];
    }).join('');
    if(iter >= final.length){ clearInterval(el._decryptTimer); el.textContent = final; }
    iter += 0.6;
  }, 28);
}

/* ---------- scroll reveal (+ decrypt headings, + stat counters) ---------- */
function initReveal(){
  const revealEls = document.querySelectorAll('.reveal');
  if(!revealEls.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((entry,i)=>{
      if(entry.isIntersecting){
        entry.target.style.transitionDelay = (i%4)*0.08+'s';
        entry.target.classList.add('visible');
        if(entry.target.classList.contains('decrypt') && !reduceMotion){
          decryptText(entry.target);
        } else if(entry.target.classList.contains('decrypt')){
          entry.target.textContent = entry.target.dataset.text || entry.target.textContent;
        }
        if(entry.target.classList.contains('stat-cell')){
          animateCount(entry.target.querySelector('.stat-num'));
        }
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.15});
  revealEls.forEach(el=>io.observe(el));
}

function animateCount(el){
  if(!el) return;
  const target = parseInt(el.dataset.count,10);
  const suffix = el.dataset.suffix || '';
  if(reduceMotion){ el.textContent = target+suffix; return; }
  let cur = 0;
  const step = Math.max(1, Math.round(target/40));
  const t = setInterval(()=>{
    cur += step;
    if(cur >= target){ cur = target; clearInterval(t); }
    el.textContent = cur+suffix;
  }, 30);
}

/* ---------- skill bars fill on scroll into view ---------- */
function initSkillBars(){
  const section = document.getElementById('skills-section');
  const bars = document.querySelectorAll('.skill-bar i');
  if(!bars.length) return;
  const target = section || bars[0].closest('section') || document.body;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        bars.forEach(bar=>{ bar.style.width = bar.dataset.w; });
        io.disconnect();
      }
    });
  },{threshold:0.3});
  io.observe(target);
}

/* ---------- 3D tilt on project cards ---------- */
function initProjectTilt(){
  const cards = document.querySelectorAll('.project-card');
  if(!cards.length || !finePointer) return;
  cards.forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX-rect.left, y = e.clientY-rect.top;
      const cx = rect.width/2, cy = rect.height/2;
      const rx = ((y-cy)/cy)*-6, ry = ((x-cx)/cx)*6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)'; });
  });
}

/* ---------- project filters ---------- */
function initProjectFilters(){
  const btns = document.querySelectorAll('.filter-btn');
  if(!btns.length) return;
  btns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card=>{
        card.style.display = (f==='all'||card.dataset.category===f) ? '' : 'none';
      });
    });
  });
}

/* ---------- project detail accordion + deep-link via #hash ---------- */
function initProjectAccordion(){
  const toggles = document.querySelectorAll('.detail-toggle');
  if(!toggles.length) return;
  toggles.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if(panel) panel.classList.toggle('open', !open);
      btn.querySelector('.label').textContent = open ? 'View details' : 'Hide details';
    });
  });
  // deep link: if URL has #project-id, open + scroll + highlight that card
  if(location.hash){
    const target = document.querySelector(location.hash);
    if(target && target.classList.contains('project-card')){
      const toggle = target.querySelector('.detail-toggle');
      if(toggle) toggle.click();
      target.classList.add('highlight');
      setTimeout(()=>target.scrollIntoView({behavior: reduceMotion ? 'auto':'smooth', block:'center'}), 150);
    }
  }
}

/* ---------- magnetic buttons ---------- */
function initMagnetic(){
  if(!finePointer || reduceMotion) return;
  document.querySelectorAll('.magnetic').forEach(wrap=>{
    const inner = wrap.querySelector('a,button');
    if(!inner) return;
    wrap.addEventListener('mousemove', e=>{
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX-rect.left-rect.width/2;
      const y = e.clientY-rect.top-rect.height/2;
      inner.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
      inner.style.transition = 'transform .05s linear';
    });
    wrap.addEventListener('mouseleave', ()=>{
      inner.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)';
      inner.style.transform = 'translate(0,0)';
    });
  });
}

/* ---------- contact form (client-side validation + demo submit) ---------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = 'sending...';
    setTimeout(()=>{
      status.textContent = '> message captured locally. wire this form to a backend (Formspree, Resend, or your own API route) to actually deliver it — or use the direct email link for now.';
      status.classList.add('visible');
      btn.disabled = false;
      btn.textContent = originalLabel;
      form.reset();
    }, 700);
  });
}

/* ---------- footer year + uptime clock ---------- */
function initFooterMeta(){
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  const uptimeEl = document.getElementById('uptime');
  if(!uptimeEl) return;
  const start = Date.now();
  setInterval(()=>{
    const s = Math.floor((Date.now()-start)/1000);
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    uptimeEl.textContent = `${hh}:${mm}:${ss}`;
  },1000);
}

/* ---------- mark active nav link based on current filename ---------- */
function initActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, #mobile-menu a, .footer-col a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path){ a.classList.add('active'); }
  });
}

document.addEventListener('DOMContentLoaded', function(){
  initBoot();
  initNav();
  initMobileMenu();
  initActiveNav();
  initTypedRoles();
  initCanvasRain('bg-rain', {density:20, speed:80});
  initCanvasRain('hero-rain', {density:16, speed:50});
  initHeroScene();
  initHeroInteraction();
  initReveal();
  initSkillBars();
  initProjectTilt();
  initProjectFilters();
  initProjectAccordion();
  initMagnetic();
  initContactForm();
  initFooterMeta();
});
})();

