window.addEventListener('load',()=>{
  requestAnimationFrame(()=>document.body.classList.add('is-loaded'));
});

document.querySelectorAll('.photo-slot img').forEach(img=>{
  img.addEventListener('error',()=>img.closest('.photo-slot')?.classList.add('is-missing'));
});

const heartLayer=document.getElementById('heartLayer');
const heartButton=document.querySelector('.heart-burst');
if(heartButton&&heartLayer){
  heartButton.addEventListener('click',()=>{
    const r=heartButton.getBoundingClientRect();
    ['♡','♡','💗','✦','♡','🫧'].forEach((symbol,i)=>{
      const el=document.createElement('span');
      el.className='flying-heart';
      el.textContent=symbol;
      el.style.left=`${r.left+r.width/2+(i-2.5)*6}px`;
      el.style.top=`${r.top}px`;
      el.style.setProperty('--x',`${(i-2.5)*28}px`);
      heartLayer.appendChild(el);
      setTimeout(()=>el.remove(),1300);
    });
  });
}

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
  });
});

const soundToggle=document.getElementById('soundToggle');
if(soundToggle){
  soundToggle.addEventListener('click',()=>{
    soundToggle.classList.toggle('is-playing');
    soundToggle.textContent=soundToggle.classList.contains('is-playing')?'❚❚ little things':'▶ little things';
  });
}

document.querySelector('.cheers')?.addEventListener('click',e=>{
  const original=e.currentTarget.textContent;
  e.currentTarget.textContent='clink! 🥂✨';
  setTimeout(()=>e.currentTarget.textContent=original,900);
});

document.querySelectorAll('.museum-shot').forEach((shot,index)=>{
  shot.addEventListener('click',()=>{
    shot.classList.toggle('is-open');
    shot.style.transform=shot.classList.contains('is-open')?`scale(1.08) rotate(${index-1}deg)`:'';
    shot.style.zIndex=shot.classList.contains('is-open')?'8':'';
  });
});

document.querySelectorAll('.polaroid').forEach(card=>{
  card.addEventListener('click',()=>{
    card.classList.toggle('is-picked');
    card.style.transform=card.classList.contains('is-picked')?'translateY(-10px) rotate(0deg) scale(1.05)':'';
    card.style.zIndex=card.classList.contains('is-picked')?'9':'';
  });
});

document.getElementById('gotIt')?.addEventListener('click',e=>{
  e.currentTarget.textContent='saved ♡';
  e.currentTarget.closest('.note-window')?.animate([
    {transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}
  ],{duration:420,easing:'ease'});
});

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
