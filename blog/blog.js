document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     PLAIN DAYS MEMORY PLAYER
  ========================================= */

  const views = {
    home: document.getElementById("mp3-home"),
    menu: document.getElementById("mp3-menu"),
    year: document.getElementById("mp3-year"),
    month: document.getElementById("mp3-month"),
    week01: document.getElementById("mp3-week01"),
    week02: document.getElementById("mp3-week02"),
    week03: document.getElementById("mp3-week03"),
    week04: document.getElementById("mp3-week04")
  };

  const menuItems = {
    menu: [...document.querySelectorAll("#mp3-menu .pd-menu-item")],
    year: [...document.querySelectorAll("#mp3-year .pd-menu-item")],
    month: [...document.querySelectorAll("#mp3-month .pd-menu-item")]
  };

  let currentView = "home";
  let selectedIndex = 0;


  /* =========================================
     SCREEN
  ========================================= */

  function showView(name) {

    Object.values(views).forEach(view => {
      if (!view) return;
      view.classList.remove("is-active");
    });

    if (views[name]) {
      views[name].classList.add("is-active");
      currentView = name;
    }

    selectedIndex = 0;
    updateSelection();
  }


  /* =========================================
     MENU SELECTION
  ========================================= */

  function getCurrentItems() {

    if (currentView === "menu") {
      return menuItems.menu;
    }

    if (currentView === "year") {
      return menuItems.year;
    }

    if (currentView === "month") {
      return menuItems.month;
    }

    return [];
  }


  function updateSelection() {

    const items = getCurrentItems();

    items.forEach((item, index) => {
      item.classList.toggle(
        "is-selected",
        index === selectedIndex
      );
    });
  }


  function moveSelection(direction) {

    const items = getCurrentItems();

    if (!items.length) return;

    selectedIndex += direction;

    if (selectedIndex < 0) {
      selectedIndex = items.length - 1;
    }

    if (selectedIndex >= items.length) {
      selectedIndex = 0;
    }

    updateSelection();
    buttonClick();
  }


  /* =========================================
     SELECT CURRENT ITEM
  ========================================= */

  function selectCurrent() {

    const items = getCurrentItems();

    if (!items.length) {

      if (currentView === "home") {
        showView("menu");
        buttonClick();
      }

      return;
    }

    const selected = items[selectedIndex];

    if (!selected) return;

    const destination = selected.dataset.menu;

    buttonClick();

    if (destination === "archive") {
      showView("year");
      return;
    }

    if (destination === "august") {
      showView("month");
      return;
    }

    if (destination === "week01") {
      showView("week01");
      return;
    }

    if (destination === "week02") {
      showView("week02");
      return;
    }

    if (destination === "week03") {
      showView("week03");
      return;
    }

    if (destination === "week04") {
      showView("week04");
      return;
    }
  }


  /* =========================================
     GO BACK
  ========================================= */

  function goBack() {

    buttonClick();

    if (currentView === "home") {
      return;
    }

    if (currentView === "menu") {
      showView("home");
      return;
    }

    if (currentView === "year") {
      showView("menu");
      return;
    }

    if (
      currentView === "month"
    ) {
      showView("year");
      return;
    }

    if (
      currentView === "week01" ||
      currentView === "week02" ||
      currentView === "week03" ||
      currentView === "week04"
    ) {
      showView("month");
      return;
    }
  }


  /* =========================================
     WEEK PAGE
  ========================================= */

  function openCurrentWeek() {

    const urls = {
      week01: "archive/2026/august/week01/",
      week02: "archive/2026/august/week02/",
      week03: "archive/2026/august/week03/",
      week04: "archive/2026/august/week04/"
    };

    const url = urls[currentView];

    if (!url) return;

    buttonClick();

    window.location.href = url;
  }


  /* =========================================
     BUTTON SOUND
  ========================================= */

  let audioContext = null;

  function buttonClick() {

    try {

      if (!audioContext) {
        audioContext =
          new (
            window.AudioContext ||
            window.webkitAudioContext
          )();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type = "square";

      oscillator.frequency.setValueAtTime(
        115,
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
        0.08,
        audioContext.currentTime + 0.005
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

    } catch (error) {

      console.log(
        "Button sound unavailable:",
        error
      );

    }
  }


  /* =========================================
     WHEEL BUTTONS
  ========================================= */

  const upButton =
    document.getElementById("up-button");

  const leftButton =
    document.getElementById("left-button");

  const rightButton =
    document.getElementById("right-button");

  const selectButton =
    document.getElementById("select-button");

  const playButton =
    document.getElementById("play-button");

  const prevButton =
    document.getElementById("prev-button");

  const nextButton =
    document.getElementById("next-button");


  upButton?.addEventListener(
    "click",
    () => moveSelection(-1)
  );


  leftButton?.addEventListener(
    "click",
    goBack
  );


  rightButton?.addEventListener(
    "click",
    () => moveSelection(1)
  );


  selectButton?.addEventListener(
    "click",
    selectCurrent
  );


  /* =========================================
     PLAY BUTTON
  ========================================= */

  playButton?.addEventListener(
    "click",
    () => {

      if (
        currentView === "week01" ||
        currentView === "week02" ||
        currentView === "week03" ||
        currentView === "week04"
      ) {

        openCurrentWeek();

        return;
      }

      selectCurrent();

    }
  );


  /* =========================================
     SIDE PREVIOUS / NEXT
  ========================================= */

  const weeks = [
    "week01",
    "week02",
    "week03",
    "week04"
  ];


  prevButton?.addEventListener(
    "click",
    () => {

      if (!weeks.includes(currentView)) {
        goBack();
        return;
      }

      let index =
        weeks.indexOf(currentView);

      index--;

      if (index < 0) {
        index = weeks.length - 1;
      }

      showView(weeks[index]);
      buttonClick();
    }
  );


  nextButton?.addEventListener(
    "click",
    () => {

      if (!weeks.includes(currentView)) {
        selectCurrent();
        return;
      }

      let index =
        weeks.indexOf(currentView);

      index++;

      if (index >= weeks.length) {
        index = 0;
      }

      showView(weeks[index]);
      buttonClick();
    }
  );


  /* =========================================
     MENU ITEM DIRECT CLICK
  ========================================= */

  document
    .querySelectorAll(".pd-menu-item")
    .forEach(item => {

      item.addEventListener(
        "click",
        () => {

          const parent =
            item.closest(".pd-mp3-view");

          if (!parent) return;

          const items =
            [...parent.querySelectorAll(".pd-menu-item")];

          selectedIndex =
            items.indexOf(item);

          updateSelection();

          selectCurrent();
        }
      );

    });


  /* =========================================
     KEYBOARD CONTROL
  ========================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "ArrowUp") {

        event.preventDefault();

        moveSelection(-1);

      }

      if (event.key === "ArrowDown") {

        event.preventDefault();

        moveSelection(1);

      }

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        selectCurrent();

      }

      if (event.key === "Escape") {

        event.preventDefault();

        goBack();

      }

    }
  );


  /* =========================================
     SCREEN FOOTER MENU
  ========================================= */

  const screenFooter =
    document.querySelector(
      ".pd-screen-footer span:first-child"
    );

  screenFooter?.addEventListener(
    "click",
    () => {

      buttonClick();
      showView("menu");

    }
  );


  /* =========================================
     CLOCK
  ========================================= */

  function updateClock() {

    const clock =
      document.getElementById("mp3-clock");

    if (!clock) return;

    const now = new Date();

    const hours =
      String(now.getHours()).padStart(2, "0");

    const minutes =
      String(now.getMinutes()).padStart(2, "0");

    clock.textContent =
      `${hours}:${minutes}`;
  }


  updateClock();

  setInterval(
    updateClock,
    30000
  );


  /* =========================================
     INITIAL STATE
  ========================================= */

  showView("home");

});
