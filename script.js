"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

//! Modal window :

const openModal = function (e) {
  e.preventDefault(); // prevent the page from scrolling to the top when clicked to the button but actually is an "<a>" tag with the "#" wich allows to jump to the top of the page.
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//! Button scrolling :
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();

  //* first method (Old):
  /*   
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); 
  */

  //* first method (Modern):
  section1.scrollIntoView({ behavior: "smooth" });
});

//! Page navigation :
document.querySelectorAll(".nav__link").forEach((element) => {
  element.addEventListener("click", function (e) {
    e.preventDefault(); // prevent scrolling
    const id = this.getAttribute("href"); //? we use "this.getAttribute()" instead of the "this.href" because in this case we need just the relative path.
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});
