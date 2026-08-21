/* =========================================================
   PLAIN DAYS — MEMORY PLAYER
   Navigation / album selection / click sound
========================================================= */


/* =========================================================
   DATA
========================================================= */

const weeks = {

  "01": {
    title: "little things",
    date: "AUG 03 — WEEK 01",
    description: "a week of refresh, laughter, museum days, food, and inspiration.",
    image: "images/tapes/2026-08-week01.png",
    url: "archive/2026/august/week01/",
    track: "01 / 04"
  },

  "02": {
    title: "lately",
    date: "AUG 10 — WEEK 02",
    description: "small objects, little rituals, and the things that quietly stayed with me.",
    image: "images/tapes/2026-08-week02.png",
    url: "archive/2026/august/week02/",
    track: "02 / 04"
  },

  "03": {
    title: "small joys",
    date: "AUG 17 — WEEK 03",
    description: "a few soft moments that made an ordinary week feel a little brighter.",
    image: "images/03_wellness_morning.png",
    url: "archive/2026/august/week03/",
    track: "03 / 04"
  },

  "04": {
    title: "a slow weekend",
    date: "AUG 24 — WEEK 04",
    description: "an afternoon that did not need to become anything more than what it already was.",
    image: "images/04_slow_breakfast.png",
    url: "archive/2026/august/week04/",
    track: "04 / 04"
  }

};


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

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


function showScreen(name){

  Object.values(screens).forEach(screen => {

    screen.classList.remove("is-active");

  });


  if(screens[name]){

    screens[name].classList.add("is-active");

    currentScreen = name;

  }

}


/* =========================================================
   CLICK SOUND
========================================================= */

let audioContext = null;


function playClick(){

  try{

    if(!audioContext){

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    }


    if(audioContext.state === "suspended"){

      audioContext.resume();

    }


    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();


    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      110,
      audioContext.currentTime
    );


    oscillator.frequency.exponentialRampToValueAtTime(
      72,
      audioContext.currentTime + 0.045
    );


    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
      0.12,
      audioContext.currentTime + 0.004
    );


    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.055
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.06
    );

  }catch(error){

    console.log("click sound unavailable");

  }

}


/* =========================================================
   SCREEN TRANSITION SOUND
========================================================= */

function navigate(name){

  playClick();

  showScreen(name);

}


/* =========================================================
   MENU BUTTONS
========================================================= */

document.querySelectorAll(".menu-item[data-action]").forEach(button => {

  button.addEventListener("click", () => {

    const action = button.dataset.action;


    if(action === "archive"){

      navigate("year");

    }


    if(action === "august"){

      navigate("month");

    }


    if(action === "about"){

      navigate("about");

    }

  });

});


/* =========================================================
   WEEK SELECTION
========================================================= */

document.querySelectorAll(".menu-item[data-week]").forEach(button => {

  button.addEventListener("click", () => {

    const week = button.dataset.week;

    loadWeek(week);

  });

});


/* =========================================================
   LOAD WEEK
========================================================= */

function loadWeek(week){

  const data = weeks[week];

  if(!data) return;


  currentWeek = week;


  albumImage.src = data.image;

  albumImage.alt =
    `Plain Days ${data.title}`;


  albumTitle.textContent =
    data.title;


  albumDate.textContent =
    data.date;


  albumDescription.textContent =
    data.description;


  albumTrack.textContent =
    data.track;


  albumTopLabel.textContent =
    "AUGUST 2026";


  playState.textContent =
    "READY";


  device.classList.remove("is-playing");


  navigate("album");

}


/* =========================================================
   PLAY WEEK
========================================================= */

function playCurrentWeek(){

  const data = weeks[currentWeek];

  if(!data) return;


  playClick();


  device.classList.add("is-playing");

  playState.textContent =
    "PLAYING";


  setTimeout(() => {

    window.location.href =
      data.url;

  }, 180);

}


/* =========================================================
   CENTER WHEEL
========================================================= */

wheel.addEventListener("click", (event) => {

  const rect =
    wheel.getBoundingClientRect();


  const x =
    event.clientX - rect.left;

  const y =
    event.clientY - rect.top;


  const center =
    rect.width / 2;


  const distance =
    Math.sqrt(
      Math.pow(x - center, 2) +
      Math.pow(y - center, 2)
    );


  /*
    CENTER
    SELECT / PLAY
  */

  if(distance < 28){

    if(currentScreen === "album"){

      playCurrentWeek();

    }

    else if(currentScreen === "home"){

      navigate("menu");

    }

    else if(currentScreen === "menu"){

      navigate("year");

    }

    else if(currentScreen === "year"){

      navigate("month");

    }

    return;

  }


  /*
    TOP
    MENU
  */

  if(y < center - 35){

    navigate("menu");

    return;

  }


  /*
    LEFT
    PREVIOUS
  */

  if(x < center - 35){

    goPrevious();

    return;

  }


  /*
    RIGHT
    NEXT
  */

  if(x > center + 35){

    goNext();

    return;

  }


  /*
    BOTTOM
    PLAY
  */

  if(y > center + 35){

    if(currentScreen === "album"){

      playCurrentWeek();

    }

  }

});


/* =========================================================
   PREVIOUS BUTTON
========================================================= */

prevButton.addEventListener("click", () => {

  goPrevious();

});


/* =========================================================
   NEXT BUTTON
========================================================= */

nextButton.addEventListener("click", () => {

  goNext();

});


/* =========================================================
   PREVIOUS
========================================================= */

function goPrevious(){

  playClick();


  if(currentScreen === "album"){

    const number =
      Math.max(
        1,
        Number(currentWeek) - 1
      )
      .toString()
      .padStart(2, "0");


    loadWeek(number);

    return;

  }


  if(currentScreen === "month"){

    navigate("year");

    return;

  }


  if(currentScreen === "year"){

    navigate("menu");

    return;

  }


  if(currentScreen === "menu"){

    navigate("home");

    return;

  }


  if(currentScreen === "about"){

    navigate("menu");

  }

}


/* =========================================================
   NEXT
========================================================= */

function goNext(){

  playClick();


  if(currentScreen === "album"){

    const number =
      Math.min(
        4,
        Number(currentWeek) + 1
      )
      .toString()
      .padStart(2, "0");


    loadWeek(number);

    return;

  }


  if(currentScreen === "home"){

    navigate("menu");

    return;

  }


  if(currentScreen === "menu"){

    navigate("year");

    return;

  }


  if(currentScreen === "year"){

    navigate("month");

    return;

  }

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener("keydown", event => {

  if(event.key === "ArrowLeft"){

    goPrevious();

  }


  if(event.key === "ArrowRight"){

    goNext();

  }


  if(event.key === "Enter"){

    playClick();

  }


  if(event.key === "Escape"){

    navigate("home");

  }

});


/* =========================================================
   START
========================================================= */

showScreen("home");
