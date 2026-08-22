/* =========================================================
   PLAIN DAYS — MEMORY PLAYER
   MP3-style archive navigation
   Weekly pages are served directly from GitHub Pages.
========================================================= */

const weeks = {
  "01": { title:"little things", date:"AUG 03 — WEEK 01", description:"a week of refresh, laughter, museum days, food, and inspiration.", image:"https://daon2e98-art.github.io/plain-days/blog/images/tapes/2026-08-week01.png", url:"https://daon2e98-art.github.io/plain-days/blog/archive/2026/august/week01/", track:"01 / 04" },
  "02": { title:"lately", date:"AUG 10 — WEEK 02", description:"small objects, little rituals, and the things that quietly stayed with me.", image:"https://daon2e98-art.github.io/plain-days/blog/images/tapes/2026-08-week02.png", url:"https://daon2e98-art.github.io/plain-days/blog/archive/2026/august/week02/", track:"02 / 04" },
  "03": { title:"small joys", date:"AUG 17 — WEEK 03", description:"a few soft moments that made an ordinary week feel a little brighter.", image:"https://daon2e98-art.github.io/plain-days/blog/images/03_wellness_morning.png", url:"https://daon2e98-art.github.io/plain-days/blog/archive/2026/august/week03/", track:"03 / 04" },
  "04": { title:"a slow weekend", date:"AUG 24 — WEEK 04", description:"an afternoon that did not need to become anything more than what it already was.", image:"https://daon2e98-art.github.io/plain-days/blog/images/04_slow_breakfast.png", url:"https://daon2e98-art.github.io/plain-days/blog/archive/2026/august/week04/", track:"04 / 04" }
};

const device = document.getElementById("mp3Device");
const wheel = document.getElementById("wheel");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const muteButton = document.getElementById("muteButton");
const albumImage = document.getElementById("albumImage");
const albumTitle = document.getElementById("albumTitle");
const albumDate = document.getElementById("albumDate");
const albumDescription = document.getElementById("albumDescription");
const albumTrack = document.getElementById("albumTrack");
const playState = document.getElementById("playState");
const albumTopLabel = document.getElementById("albumTopLabel");

const screens = {
  home: document.getElementById("homeScreen"),
  menu: document.getElementById("menuScreen"),
  year: document.getElementById("yearScreen"),
  month: document.getElementById("monthScreen"),
  album: document.getElementById("albumScreen"),
  about: document.getElementById("aboutScreen")
};

let currentScreen = "home";
let currentWeek = "01";
let selectedIndex = 0;
let audioContext = null;
let isMuted = localStorage.getItem("plainDaysMuted") === "true";

function pulseScreen(){
  const screen = document.querySelector(".mp3-screen");
  if(!screen) return;
  screen.classList.remove("is-pressed");
  void screen.offsetWidth;
  screen.classList.add("is-pressed");
}

function updateMuteButton(){
  if(!muteButton) return;
  muteButton.textContent = isMuted ? "🔇" : "🔊";
  muteButton.setAttribute("aria-label", isMuted ? "Unmute sounds" : "Mute sounds");
  muteButton.setAttribute("aria-pressed", String(isMuted));
}

function playClick(){
  if(isMuted) return;
  try{
    if(!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if(audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(125, now);
    osc.frequency.exponentialRampToValueAtTime(78, now + 0.045);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.36, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }catch(error){ console.log("click sound unavailable"); }
}

if(muteButton){
  muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    localStorage.setItem("plainDaysMuted", String(isMuted));
    updateMuteButton();
    if(!isMuted) playClick();
  });
}
updateMuteButton();

function showScreen(name){
  Object.values(screens).forEach(screen => { if(screen) screen.classList.remove("is-active"); });
  if(screens[name]){
    screens[name].classList.add("is-active");
    currentScreen = name;
  }
  updateSelection();
}

function navigate(name){ playClick(); showScreen(name); }

function getSelectableItems(){
  if(currentScreen === "menu") return [...document.querySelectorAll('#menuScreen .menu-item')];
  if(currentScreen === "year") return [...document.querySelectorAll('#yearScreen .menu-item')];
  if(currentScreen === "month") return [...document.querySelectorAll('#monthScreen .menu-item')];
  return [];
}

function updateSelection(){
  const items = getSelectableItems();
  items.forEach((item,index) => item.classList.toggle("is-selected", index === selectedIndex));
  if(items.length && selectedIndex >= items.length) selectedIndex = items.length - 1;
}

function moveSelection(direction){
  const items = getSelectableItems();
  if(!items.length) return;
  selectedIndex += direction;
  if(selectedIndex < 0) selectedIndex = items.length - 1;
  if(selectedIndex >= items.length) selectedIndex = 0;
  updateSelection();
  playClick();
}

function selectCurrent(){
  const items = getSelectableItems();
  const item = items[selectedIndex];
  if(!item) return;
  playClick();
  const action = item.dataset.action;
  const week = item.dataset.week;
  if(action === "archive"){ selectedIndex=0; showScreen("year"); return; }
  if(action === "about"){ selectedIndex=0; showScreen("about"); return; }
  if(action === "august"){ selectedIndex=0; showScreen("month"); return; }
  if(week) loadWeek(week);
}

document.querySelectorAll(".menu-item[data-action]").forEach(button => {
  button.addEventListener("click", () => {
    const items=getSelectableItems(); selectedIndex=items.indexOf(button); updateSelection(); selectCurrent();
  });
});

document.querySelectorAll(".menu-item[data-week]").forEach(button => {
  button.addEventListener("click", () => {
    const items=getSelectableItems(); selectedIndex=items.indexOf(button); updateSelection(); loadWeek(button.dataset.week);
  });
});

function loadWeek(week){
  const data=weeks[week];
  if(!data) return;
  currentWeek=week;
  albumImage.src=data.image;
  albumImage.alt=`Plain Days ${data.title}`;
  albumTitle.textContent=data.title;
  albumDate.textContent=data.date;
  albumDescription.textContent=data.description;
  albumTrack.textContent=data.track;
  albumTopLabel.textContent="AUGUST 2026";
  playState.textContent="READY";
  device.classList.remove("is-playing");
  showScreen("album");
}

function playCurrentWeek(){
  const data=weeks[currentWeek];
  if(!data) return;
  playClick();
  device.classList.add("is-playing");
  playState.textContent="PLAYING";
  setTimeout(() => window.location.assign(data.url), 220);
}

function goBack(){
  playClick();
  if(currentScreen === "home") return;
  if(currentScreen === "menu") return showScreen("home");
  if(currentScreen === "year") return showScreen("menu");
  if(currentScreen === "month") return showScreen("year");
  if(currentScreen === "album") return showScreen("month");
  if(currentScreen === "about") return showScreen("menu");
}

function goPrevious(){
  if(currentScreen === "album"){
    const number=Math.max(1,Number(currentWeek)-1).toString().padStart(2,"0");
    loadWeek(number); playClick(); return;
  }
  if(getSelectableItems().length){ moveSelection(-1); return; }
  goBack();
}

function goNext(){
  if(currentScreen === "album"){
    const number=Math.min(4,Number(currentWeek)+1).toString().padStart(2,"0");
    loadWeek(number); playClick(); return;
  }
  if(getSelectableItems().length){ moveSelection(1); return; }
  if(currentScreen === "home") navigate("menu");
}

wheel.addEventListener("click", event => {
  const rect=wheel.getBoundingClientRect();
  const x=event.clientX-rect.left;
  const y=event.clientY-rect.top;
  const center=rect.width/2;
  const distance=Math.sqrt(Math.pow(x-center,2)+Math.pow(y-center,2));
  if(distance<28){
    if(currentScreen === "album") playCurrentWeek();
    else if(currentScreen === "home") navigate("menu");
    else selectCurrent();
    return;
  }
  if(y<center-35){ goBack(); return; }
  if(x<center-35){ goPrevious(); return; }
  if(x>center+35){ goNext(); return; }
  if(y>center+35 && currentScreen === "album") playCurrentWeek();
});

prevButton.addEventListener("click", goPrevious);
nextButton.addEventListener("click", goNext);

document.addEventListener("pointerdown", event => {
  if(event.target.closest(".mp3-button, .mp3-wheel, .menu-item")) pulseScreen();
});

document.addEventListener("keydown", event => {
  if(event.key === "ArrowUp") moveSelection(-1);
  if(event.key === "ArrowDown") moveSelection(1);
  if(event.key === "ArrowLeft") goPrevious();
  if(event.key === "ArrowRight") goNext();
  if(event.key === "Enter" || event.key === " "){
    event.preventDefault();
    pulseScreen();
    if(currentScreen === "album") playCurrentWeek();
    else if(currentScreen === "home") navigate("menu");
    else selectCurrent();
  }
  if(event.key === "Escape"){
    pulseScreen();
    goBack();
  }
});

showScreen("home");

/* Plain Days legal footer */
(function addPlainDaysFooter(){
  if(document.querySelector('.pd-site-footer')) return;
  const footer=document.createElement('footer');
  footer.className='pd-site-footer';
  footer.innerHTML=`
    <div class="pd-site-footer-brand">PLAIN DAYS</div>
    <div class="pd-site-footer-note">ordinary days, saved slowly.</div>
    <nav class="pd-site-footer-links" aria-label="Plain Days information">
      <a href="https://plain-days.com/about/" target="_top">ABOUT</a>
      <a href="https://plain-days.com/privacy-notice/" target="_top">PRIVACY</a>
      <a href="https://plain-days.com/terms-of-use/" target="_top">TERMS</a>
      <a href="https://plain-days.com/refunds/" target="_top">REFUNDS</a>
    </nav>
    <div class="pd-site-footer-copy">© 2026</div>
  `;
  document.body.appendChild(footer);

  const style=document.createElement('style');
  style.textContent=`
    .pd-site-footer{width:min(900px,calc(100% - 40px));margin:44px auto 34px;padding:26px 0 32px;border-top:1px solid rgba(255,255,255,.35);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:rgba(255,255,255,.58);font-size:8px;letter-spacing:.16em}.pd-site-footer-brand{color:rgba(255,255,255,.78);letter-spacing:.24em}.pd-site-footer-note{text-align:center;color:rgba(255,255,255,.42);letter-spacing:.1em}.pd-site-footer-links{display:flex;justify-content:flex-end;gap:18px}.pd-site-footer-links a{color:rgba(255,255,255,.58);text-decoration:none;transition:opacity .2s ease}.pd-site-footer-links a:hover{opacity:.5}.pd-site-footer-copy{text-align:right;color:rgba(255,255,255,.38);grid-column:3}.pd-site-footer-links{grid-column:2;grid-row:1}.pd-site-footer-copy{grid-row:2}.pd-site-footer-note{grid-row:2;grid-column:1 / 3;text-align:left}@media(max-width:700px){.pd-site-footer{width:calc(100% - 28px);grid-template-columns:1fr;gap:13px;margin-top:32px}.pd-site-footer-links{grid-column:1;grid-row:auto;justify-content:flex-start;flex-wrap:wrap;gap:13px}.pd-site-footer-note{grid-column:1;grid-row:auto;text-align:left}.pd-site-footer-copy{grid-column:1;grid-row:auto;text-align:left}}
  `;
  document.head.appendChild(style);
})();
