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