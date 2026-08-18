/* ==========================================
   PLAIN DAYS BLOG SEARCH
========================================== */

const searchInput =
  document.getElementById("blog-search");

const searchClear =
  document.getElementById("search-clear");

const searchBox =
  document.querySelector(".pd-search");

const posts =
  document.querySelectorAll(".pd-post");

const noResults =
  document.getElementById("no-results");


function filterPosts() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  searchBox.classList.toggle(
    "has-text",
    query.length > 0
  );


  let visibleCount = 0;


  posts.forEach((post) => {

    const searchableText =
      (
        post.dataset.search +
        " " +
        post.textContent
      ).toLowerCase();


    const matches =
      searchableText.includes(query);


    post.classList.toggle(
      "is-hidden",
      !matches
    );


    if (matches) {
      visibleCount++;
    }

  });


  noResults.classList.toggle(
    "show",
    visibleCount === 0
  );

}


searchInput.addEventListener(
  "input",
  filterPosts
);


searchClear.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    filterPosts();

    searchInput.focus();

  }
);
