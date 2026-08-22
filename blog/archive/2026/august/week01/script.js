window.addEventListener('load',()=>{
  requestAnimationFrame(()=>document.body.classList.add('is-loaded'));
});

const heartLayer=document.getElementById('heartLayer');

function burstAt(x,y,symbols=['♡','✦','🫧','💗']){
  if(!heartLayer)return;
  symbols.forEach((symbol,i)=>{
    const el=document.createElement('span');
    el.className='burst-symbol';
    el.textContent=symbol;
    el.style.left=`${x}px`;
    el.style.top=`${y}px`;
    el.style.setProperty('--x',`${(i-(symbols.length-1)/2)*30}px`);
    heartLayer.appendChild(el);
    setTimeout(()=>el.remove(),1300);
  });
}

document.querySelector('.heart-burst')?.addEventListener('click',e=>{
  const r=e.currentTarget.getBoundingClientRect();
  burstAt(r.left+r.width/2,r.top,['♡','♡','💗','✦','🫧','🌼','♡']);
});

document.querySelector('.chaos-pop')?.addEventListener('click',e=>{
  const r=e.currentTarget.getBoundingClientRect();
  burstAt(r.left+r.width/2,r.top,['🍌','🥛','🥂','♡','✨','😵‍💫']);
  const old=e.currentTarget.textContent;
  e.currentTarget.textContent='chaos unlocked! 🥂✨';
  setTimeout(()=>e.currentTarget.textContent=old,1100);
});

document.querySelectorAll('.minimize').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const win=btn.closest('.window');
    if(!win)return;
    win.classList.toggle('is-minimized');
    [...win.children].forEach((child,i)=>{if(i>0)child.hidden=win.classList.contains('is-minimized')});
  });
});

document.querySelectorAll('.track').forEach(track=>{
  track.addEventListener('click',()=>{
    document.querySelectorAll('.track').forEach(t=>t.classList.remove('is-active'));
    track.classList.add('is-active');
    document.querySelectorAll('.track span').forEach(s=>s.textContent='▷');
    track.querySelector('span').textContent='▶';
    const r=track.getBoundingClientRect();
    burstAt(r.left+28,r.top+18,['🎵','✦','🎶','♡']);
  });
});

const soundToggle=document.getElementById('soundToggle');
if(soundToggle){
  soundToggle.addEventListener('click',()=>{
    const playing=soundToggle.classList.toggle('is-playing');
    soundToggle.textContent=playing?'❚❚ Little Things':'▶ Little Things';
    const progress=document.querySelector('.progress i');
    if(progress)progress.style.width=playing?'68%':'18%';
    const r=soundToggle.getBoundingClientRect();
    if(playing)burstAt(r.right-12,r.top,['🎵','🎶','✦','🎧']);
  });
}

document.querySelectorAll('.little-note input[type="checkbox"]').forEach(input=>{
  input.addEventListener('change',e=>{
    if(!e.currentTarget.checked)return;
    const r=e.currentTarget.getBoundingClientRect();
    ['♡','✦','💗'].forEach((s,i)=>{
      const el=document.createElement('span');
      el.className='checkbox-burst';
      el.textContent=s;
      el.style.left=`${r.left+r.width/2}px`;
      el.style.top=`${r.top+r.height/2}px`;
      el.style.setProperty('--cx',`${(i-1)*30}px`);
      el.style.setProperty('--cy',`${-32-i*8}px`);
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),950);
    });
  });
});

document.querySelectorAll('.polaroid').forEach(card=>{
  card.addEventListener('click',()=>{
    card.classList.toggle('is-picked');
    card.style.transform=card.classList.contains('is-picked')?'translateY(-14px) rotate(0deg) scale(1.055)':'';
    card.style.zIndex=card.classList.contains('is-picked')?'9':'';
    const r=card.getBoundingClientRect();
    burstAt(r.left+r.width*.75,r.top+18,['✦','♡','🫧']);
  });
});

document.querySelectorAll('.museum-hover').forEach(img=>{
  img.addEventListener('click',()=>{
    const r=img.getBoundingClientRect();
    burstAt(r.left+r.width/2,r.top+20,['🏛️','✨','✦']);
  });
});

document.getElementById('gotIt')?.addEventListener('click',e=>{
  e.currentTarget.textContent='saved ♡';
  const r=e.currentTarget.getBoundingClientRect();
  burstAt(r.left+r.width/2,r.top,['💌','♡','✨','🌼']);
  e.currentTarget.closest('.note-window')?.animate([
    {transform:'translateY(0) rotate(1.5deg)'},{transform:'translateY(-7px) rotate(0deg)'},{transform:'translateY(0) rotate(1.5deg)'}
  ],{duration:520,easing:'ease'});
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.18});
document.querySelectorAll('.reveal-on-scroll').forEach(el=>observer.observe(el));

function makeDraggable(el){
  if(window.matchMedia('(max-width: 600px)').matches)return;
  let active=false,startX=0,startY=0,baseX=0,baseY=0;
  el.addEventListener('pointerdown',e=>{
    if(e.target.closest('button,input,label,a'))return;
    active=true;startX=e.clientX;startY=e.clientY;
    const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);
    baseX=m.m41||0;baseY=m.m42||0;
    el.setPointerCapture?.(e.pointerId);el.classList.add('dragging');
  });
  el.addEventListener('pointermove',e=>{
    if(!active)return;
    el.style.transform=`translate(${baseX+e.clientX-startX}px,${baseY+e.clientY-startY}px)`;
  });
  const stop=()=>{active=false;el.classList.remove('dragging')};
  el.addEventListener('pointerup',stop);el.addEventListener('pointercancel',stop);
}
document.querySelectorAll('.draggable').forEach(makeDraggable);

const shy=document.querySelectorAll('.photo-doodle,.scribbles');
document.addEventListener('pointermove',e=>{
  if(window.matchMedia('(max-width: 700px)').matches)return;
  shy.forEach(el=>{
    const r=el.getBoundingClientRect();
    const dx=(r.left+r.width/2)-e.clientX;
    const dy=(r.top+r.height/2)-e.clientY;
    const d=Math.hypot(dx,dy);
    if(d<110){
      const power=(110-d)/110;
      el.style.translate=`${(dx/(d||1))*12*power}px ${(dy/(d||1))*12*power}px`;
    }else el.style.translate='';
  });
});

/* Plain Days legal footer */
(function addPlainDaysFooter(){
  if(document.querySelector('.pd-site-footer')) return;
  const footer=document.createElement('footer');
  footer.className='pd-site-footer';
  footer.innerHTML=`
    <div class="pd-site-footer-brand">PLAIN DAYS</div>
    <div class="pd-site-footer-note">ordinary days, saved slowly.</div>
    <nav class="pd-site-footer-links" aria-label="Plain Days information">
      <a href="https://plain-days.com/about/">ABOUT</a>
      <a href="https://plain-days.com/privacy-notice/">PRIVACY</a>
      <a href="https://plain-days.com/terms-of-use/">TERMS</a>
      <a href="https://plain-days.com/refunds/">REFUNDS</a>
    </nav>
    <div class="pd-site-footer-copy">© 2026</div>
  `;
  document.body.appendChild(footer);

  const style=document.createElement('style');
  style.textContent=`
    .pd-site-footer{width:min(1160px,calc(100% - 36px));margin:48px auto 0;padding:28px 0 34px;border-top:1px solid rgba(75,67,56,.18);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#77736d;font-size:9px;letter-spacing:.16em}.pd-site-footer-brand{color:#3e3a35;letter-spacing:.24em}.pd-site-footer-note{text-align:center;letter-spacing:.1em;color:#a09b94}.pd-site-footer-links{display:flex;justify-content:flex-end;gap:20px}.pd-site-footer-links a{color:#77736d;text-decoration:none;transition:opacity .2s ease}.pd-site-footer-links a:hover{opacity:.45}.pd-site-footer-copy{text-align:right;color:#aaa49c;grid-column:3}.pd-site-footer-links{grid-column:2;grid-row:1}.pd-site-footer-copy{grid-row:2}.pd-site-footer-note{grid-row:2;grid-column:1 / 3;text-align:left}@media(max-width:700px){.pd-site-footer{width:calc(100% - 36px);grid-template-columns:1fr;gap:14px;padding:24px 0 28px}.pd-site-footer-links{grid-column:1;grid-row:auto;justify-content:flex-start;flex-wrap:wrap;gap:14px}.pd-site-footer-note{grid-column:1;grid-row:auto;text-align:left}.pd-site-footer-copy{grid-column:1;grid-row:auto;text-align:left}}
  `;
  document.head.appendChild(style);
})();
