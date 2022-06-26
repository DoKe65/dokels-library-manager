// const pagination = document.querySelector(".pagination");
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

