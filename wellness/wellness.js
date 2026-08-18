/* ==========================================
   PLAIN DAYS WELLNESS
========================================== */


/* DATE */

const wellnessDate =
  document.getElementById("wellness-date");

const wellnessNow =
  new Date();


if (wellnessDate) {

  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short"
      }
    );

  wellnessDate.textContent =
    formatter
      .format(wellnessNow)
      .toUpperCase()
      .replace(",", "");

}



/* ==========================================
   CATEGORY CHIP INTERACTION
========================================== */

const wellnessChips =
  document.querySelectorAll(".wellness-chip");


wellnessChips.forEach((chip) => {

  chip.addEventListener("click", () => {

    wellnessChips.forEach((item) => {
      item.classList.remove("is-active");
    });


    chip.classList.add("is-active");

  });

});
