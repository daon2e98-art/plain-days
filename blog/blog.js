const tapes=[...document.querySelectorAll('.pd-tape')];
const player=document.getElementById('player');
const playerState=document.getElementById('player-state');
const loadedTitle=document.getElementById('loaded-title');
const instruction=document.getElementById('instruction');
const playButton=document.getElementById('play-button');
const archiveScreen=document.getElementById('archive-screen');
const storyScreen=document.getElementById('story-screen');
const backButton=document.getElementById('back-button');
const nextTrack=document.getElementById('next-track');
const tapeGuide=document.getElementById('tape-guide');
let selected=null;

const tapeGuideBubble=document.querySelector('.pd-tape-guide');
if(tapeGuideBubble){
  tapeGuideBubble.innerHTML='<strong>START HERE ✦</strong>choose a cassette first';
}

const playGuide=document.createElement('div');
playGuide.className='pd-play-guide';
playGuide.innerHTML='<strong>NEXT ✦</strong><br>then press ▶ to read';
playButton.parentElement.appendChild(playGuide);

function hidePlayGuide(){
  playGuide.classList.remove('is-visible');
  playButton.classList.remove('is-guide-target');
}

function showPlayGuide(){
  playGuide.classList.add('is-visible');
  playButton.classList.add('is-guide-target');
}

function selectTape(tape){
  tapes.forEach(t=>t.classList.remove('is-active'));
  tape.classList.add('is-active');
  selected=tape;

  if(tapeGuide){
    tapeGuide.classList.add('is-hidden');
  }

  hidePlayGuide();
  player.classList.remove('is-playing');
  playerState.textContent='LOADING TAPE';
  loadedTitle.textContent=`AUG / ${tape.dataset.track} · inserting…`;
  instruction.textContent='tape selected · press play to read';

  setTimeout(()=>{
    player.classList.add('is-playing');
    playerState.textContent=`READY / TRACK ${tape.dataset.track}`;
    loadedTitle.textContent=tape.dataset.title;
    showPlayGuide();
  },380);
}

function openStory(){
  if(!selected){
    instruction.textContent='choose a tape first.';
    return;
  }

  hidePlayGuide();

  if(selected.dataset.url){
    playerState.textContent=`PLAYING / TRACK ${selected.dataset.track}`;
    instruction.textContent='opening journal…';
    setTimeout(()=>window.location.href=selected.dataset.url,220);
    return;
  }

  document.getElementById('now-playing').textContent=`NOW PLAYING — AUG / TRACK ${selected.dataset.track}`;
  document.getElementById('story-date').textContent=selected.dataset.date;
  document.getElementById('story-title').textContent=`${selected.dataset.title}.`;
  document.getElementById('story-lead').textContent=selected.dataset.copy;
  document.getElementById('footer-track').textContent=`AUG / ${selected.dataset.track}`;

  const storyImage=document.getElementById('story-image');
  storyImage.src=selected.dataset.image;
  storyImage.alt=selected.dataset.title;

  archiveScreen.classList.remove('is-active');
  storyScreen.classList.add('is-active');
  window.scrollTo({top:0,behavior:'smooth'});
}

tapes.forEach(tape=>tape.addEventListener('click',()=>selectTape(tape)));
playButton.addEventListener('click',openStory);

backButton.addEventListener('click',()=>{
  storyScreen.classList.remove('is-active');
  archiveScreen.classList.add('is-active');
  hidePlayGuide();
  window.scrollTo({top:0,behavior:'smooth'});
});

nextTrack.addEventListener('click',()=>{
  if(!selected)return;
  const index=tapes.indexOf(selected);
  selectTape(tapes[(index+1)%tapes.length]);
  setTimeout(openStory,430);
});
