// mark the active pagination button visually active
const paginationBtns = document.querySelectorAll(".pagination li a.button");

const thisPage = function(page) {
  const search = window.location.search;
  const pageIndex = search.indexOf("page");
  page = parseInt(search.slice(pageIndex+5));
  return page + 1;
}

for (let i = 0; i < paginationBtns.length; i++) {
  const currentPage = thisPage();
  const btn = paginationBtns[i];
  const btnNr = parseInt(btn.innerHTML);  
  if (btnNr === currentPage) {
    btn.classList.add("active");
  }
}

// Make sure, that the first pagination button is active, even if there's no url parameter
const pagePos = window.location.search.indexOf("page");
if (pagePos < 0) {
  paginationBtns[0].classList.add("active");
}

// hide the parameters from url
history.replaceState(null, document.querySelector("title").innerText, window.location.pathname)