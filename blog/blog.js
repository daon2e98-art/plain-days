/* =========================================================
   PLAIN DAYS — MEMORY PLAYER
   Step 1: real MP3-style menu navigation
========================================================= */

const weeks = {
  "01": {
    title: "little things",
    date: "AUG 03 — WEEK 01",
    description: "a week of refresh, laughter, museum days, food, and inspiration.",
    image: "https://daon2e98-art.github.io/plain-days/blog/images/tapes/2026-08-week01.png",
    url: "https://plain-days.com/blog/archive/2026/august/week01/",
    track: "01 / 04"
  },
  "02": {
    title: "lately",
    date: "AUG 10 — WEEK 02",
    description: "small objects, little rituals, and the things that quietly stayed with me.",
    image: "https://daon2e98-art.github.io/plain-days/blog/images/tapes/2026-08-week02.png",
    url: "https://plain-days.com/blog/archive/2026/august/week02/",
    track: "02 / 04"
  },
  "03": {
    title: "small joys",
    date: "AUG 17 — WEEK 03",
    description: "a few soft moments that made an ordinary week feel a little brighter.",
    image: "https://daon2e98-art.github.io/plain-days/blog/images/03_wellness_morning.png",
    url: "https://plain-days.com/blog/archive/2026/august/week03/",
    track: "03 / 04"
  },
  "04": {
    title: "a slow weekend",
    date: "AUG 24 — WEEK 04",
    description: "an afternoon that did not need to become anything more than what it already was.",
    image: "https://daon2e98-art.github.io/plain-days/blog/images/04_slow_breakfast.png",
    url: "https://plain-days.com/blog/archive/2026/august/week04/",
    track: "04 / 04"
  }
};

const device = document.getElementById("mp3Device");
const wheel = document.getElementById("wheel");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

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

function playClick(){
  try{
    if(!audioContext){
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

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
  }catch(error){
    console.log("click sound unavailable");
  }
}

function showScreen(name){
  Object.values(screens).forEach(screen => {
    if(screen) screen.classList.remove("is-active");
  });

  if(screens[name]){
    screens[name].classList.add("is-active");
    currentScreen = name;
  }

  updateSelection();
}

function navigate(name){
  playClick();
  showScreen(name);
}

/* =========================================================
   SELECTION SYSTEM
========================================================= */

function getSelectableItems(){
  if(currentScreen === "menu"){
    return [...document.querySelectorAll('#menuScreen .menu-item')];
  }

  if(currentScreen === "year"){
    return [...document.querySelectorAll('#yearScreen .menu-item')];
  }

  if(currentScreen === "month"){
    return [...document.querySelectorAll('#monthScreen .menu-item')];
  }

  return [];
}

function updateSelection(){
  const items = getSelectableItems();

  items.forEach((item, index) => {
    item.classList.toggle("is-selected", index === selectedIndex);
  });

  if(items.length && selectedIndex >= items.length){
    selectedIndex = items.length - 1;
  }
}

function setSelection(index){
  const items = getSelectableItems();
  if(!items.length) return;

  selectedIndex = Math.max(0, Math.min(items.length - 1, index));
  updateSelection();
  playClick();
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

  if(action === "archive"){
    selectedIndex = 0;
    showScreen("year");
    return;
  }

  if(action === "about"){
    selectedIndex = 0;
    showScreen("about");
    return;
  }

  if(action === "august"){
    selectedIndex = 0;
    showScreen("month");
    return;
  }

  if(week){
    loadWeek(week);
  }
}

/* Direct clicking still works. */
document.querySelectorAll(".menu-item[data-action]").forEach(button => {
  button.addEventListener("click", () => {
    const items = getSelectableItems();
    selectedIndex = items.indexOf(button);
    updateSelection();
    selectCurrent();
  });
});

document.querySelectorAll(".menu-item[data-week]").forEach(button => {
  button.addEventListener("click", () => {
    const items = getSelectableItems();
    selectedIndex = items.indexOf(button);
    updateSelection();
    loadWeek(button.dataset.week);
  });
});

/* =========================================================
   WEEK / ALBUM
========================================================= */

function loadWeek(week){
  const data = weeks[week];
  if(!data) return;

  currentWeek = week;

  albumImage.src = data.image;
  albumImage.alt = `Plain Days ${data.title}`;
  albumTitle.textContent = data.title;
  albumDate.textContent = data.date;
  albumDescription.textContent = data.description;
  albumTrack.textContent = data.track;
  albumTopLabel.textContent = "AUGUST 2026";
  playState.textContent = "READY";

  device.classList.remove("is-playing");
  showScreen("album");
}

function playCurrentWeek(){
  const data = weeks[currentWeek];
  if(!data) return;

  playClick();
  device.classList.add("is-playing");
  playState.textContent = "PLAYING";

  setTimeout(() => {
    window.location.href = data.url;
  }, 220);
}

/* =========================================================
   BACK / MENU
========================================================= */

function goBack(){
  playClick();

  if(currentScreen === "home") return;
  if(currentScreen === "menu") return showScreen("home");
  if(currentScreen === "year") return showScreen("menu");
  if(currentScreen === "month") return showScreen("year");
  if(currentScreen === "album") return showScreen("month");
  if(currentScreen === "about") return showScreen("menu");
}

/* =========================================================
   NEXT / PREVIOUS
========================================================= */

function goPrevious(){
  if(currentScreen === "album"){
    const number = Math.max(1, Number(currentWeek) - 1)
      .toString().padStart(2, "0");
    loadWeek(number);
    playClick();
    return;
  }

  if(getSelectableItems().length){
    moveSelection(-1);
    return;
  }

  goBack();
}

function goNext(){
  if(currentScreen === "album"){
    const number = Math.min(4, Number(currentWeek) + 1)
      .toString().padStart(2, "0");
    loadWeek(number);
    playClick();
    return;
  }

  if(getSelectableItems().length){
    moveSelection(1);
    return;
  }

  if(currentScreen === "home"){
    navigate("menu");
  }
}

/* =========================================================
   WHEEL
========================================================= */

wheel.addEventListener("click", event => {
  const rect = wheel.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const center = rect.width / 2;
  const distance = Math.sqrt(
    Math.pow(x - center, 2) + Math.pow(y - center, 2)
  );

  /* Center = SELECT */
  if(distance < 28){
    if(currentScreen === "album"){
      playCurrentWeek();
    }else if(currentScreen === "home"){
      navigate("menu");
    }else{
      selectCurrent();
    }
    return;
  }

  /* Top = MENU / BACK */
  if(y < center - 35){
    goBack();
    return;
  }

  /* Left / Right = scroll through menu items */
  if(x < center - 35){
    goPrevious();
    return;
  }

  if(x > center + 35){
    goNext();
    return;
  }

  /* Bottom = PLAY */
  if(y > center + 35 && currentScreen === "album"){
    playCurrentWeek();
  }
});

prevButton.addEventListener("click", goPrevious);
nextButton.addEventListener("click", goNext);

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", event => {
  if(event.key === "ArrowUp"){
    moveSelection(-1);
  }

  if(event.key === "ArrowDown"){
    moveSelection(1);
  }

  if(event.key === "ArrowLeft"){
    goPrevious();
  }

  if(event.key === "ArrowRight"){
    goNext();
  }

  if(event.key === "Enter" || event.key === " "){
    event.preventDefault();

    if(currentScreen === "album"){
      playCurrentWeek();
    }else if(currentScreen === "home"){
      navigate("menu");
    }else{
      selectCurrent();
    }
  }

  if(event.key === "Escape"){
    goBack();
  }
});

/* =========================================================
   START
========================================================= */

showScreen("home");
