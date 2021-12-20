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
/* 
document.querySelectorAll(".nav__link").forEach((element) => {
  element.addEventListener("click", function (e) {
    e.preventDefault(); // prevent scrolling
    const id = this.getAttribute("href"); //? we use "this.getAttribute()" instead of the "this.href" because in this case we need just the relative path.
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});
 */
// TODO : It will be fine of couple of elements,but what if we had much more like 1000 elements ? if we were to attch an event handler to this number like we did before with the forEach function,then we would effectively be creating 1000 copies of the same callback function like we did before and so that would then certainly impact the performance and it's really just not a clean solution in that case, and the best one without doubt is to use events delegation, so in this case we use the fact that events bubble up , and we do that by putting the eventListener on a commom parent of all the elements that we are interested in ,therfore in this case is the container "nav__links" that's around all of these links,then when the user clicks one of the links the events is generated and bubbles up and then we can basically catch that event in this common parent element and handle it there,because we also know where the event actually originated

//! Page navigation using Event Delegation :
//* Add event listener to common parent element :
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  //* Matching strategy :
  if (e.target.classList.contains(".nav__link")) {
    // Determine what element originated the event(the target) and set a condition 'cause we actually only want to work with the clicks that happend on one of the links
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});
