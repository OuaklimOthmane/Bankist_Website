"use strict";

//! Elements :
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
  if (e.target.classList.contains("nav__link")) {
    // Determine what element originated the event(the target) and set a condition 'cause we actually only want to work with the clicks that happend on one of the links
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//! Tabbed component using Event Delegation :
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab"); // We use "e.target.closest()" instead of "e.target" to determine when the event was originated 'cause in this case we have a span element inside the button wich have some issus when clicking in the span ,qo we still need the button,So no matter if we click on te button itself or the span we actually need the button element itsel because from this last we will need to read the data_tab attribute 'cause this one contains the number of the tab that should become visible,so besically we need a way of finding the button element whenever we click on the span element ,therefore we want a way of going upwards,but we want to specify that we want to select the an operation tab and so we can use the "closest" method for exactly that,and it really helpfull for delegation event to get dynamically the element that we interested in.

  //* Guard clause :
  if (!clicked) return; // In case when there is no matching parent element to be found ,so when we click in the tabs conatainer then there is gonna be no parent with the class of ".operations__tab" and so therefore we get a "null" , so we will fix it besically by ignoring any clicks that happend on the area where there no buttons, so with this expression when there is nothing clicked then we want immediately finish this function.

  //* Remove active classes :
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));

  tabsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  //* Activate tab :
  clicked.classList.add("operations__tab--active");

  //* Activate content area :
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//!Menu fade animation :
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((sibling) => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//? We can't passing argument to an event handler like : nav.addEventListener("mouseover",handleHover(e, 0.5) so we use this expression as below :
//* version 1 :
/*
nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});
*/

//* version 2 :
//? Using "bind()" method that creates a copy of the function that it's called on, and will set the "this" keyword in this function call to whatever value that we pass into bind.
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

// //! Sticky navigation using "The scroll" :
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", () => {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   //? window.scrollY returns the number of pixels that the document is currently scrolled vertically.
//   else nav.classList.remove("sticky");
// });

//! Sticky navigation using "IntersectionObserver API" :
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height; // getting the height of the navigation

const observerScrollOptions = {
  root: null, // The entire viewport
  threshold: 0, // the intersection comes after the header is disappeared
  rootMargin: `-${navHeight}px`, // the navigation will appear before the threshold is actually reached
};

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(
  stickyNav,
  observerScrollOptions
);
headerObserver.observe(header);

//! Revealling sections on scroll using "IntersectionObserver API" :

const sections = document.querySelectorAll(".section");

const observerRevealOptions = {
  root: null,
  threshold: 0.15, // the intersection comes after 15% of the section.
};

const revealSection = function (entries, observer) {
  const [entry] = entries;

  //* Guard clause :
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden"); // In this case we want just a specified section to reveal not them all that's why we point to te section by the "entry.target" to know wich section is intersected was observed.

  //* Prevent observing sections :
  // because when we scrolling the observer keeps observing the sections to get even better in the performance.
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(
  revealSection,
  observerRevealOptions
);

sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//! Lazy loading images :
// Scrolling to one of these low images we will then replace with the one which specified in the "data-src" attribute.The main goal is to replace a low resolution image with a new one who has a good resolution to get a good performance.
const imgTargets = document.querySelectorAll("img[data-src]"); // Selecting images who have the data-src attribute.

const loadImg = function (entries, observer) {
  const [entry] = entries;

  //* Guard clause :
  if (!entry.isIntersecting) return;

  //* Replacing src with data-src :
  entry.target.src = entry.target.dataset.src;

  // This replacing of "src" attribute actually happens behind the scenes so JS finds the new image that it should load and display'it ,and once it finished loading it will emmet the "load" event
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
};

const loadImgOptions = {
  root: null,
  threshold: 0,
  // rootMargin: "90px",
};

const imgObserver = new IntersectionObserver(loadImg, loadImgOptions);

imgTargets.forEach((img) => imgObserver.observe(img));

//! Slider :
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");

const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

let currentSlide = 0;
const maxSlides = slides.length;

slider.style.transform = "scale(0.3) translateX(-1200px)";
slider.style.overflow = "visible";

const goToSlide = function (ToSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - ToSlide) * 100}%)`; // fisrt of all we should make the slides one next to one : 0*100% = 0, 1*100% = 100%, 2*100% = 200%, 3*100% = 300%
  });
};

goToSlide(0); // Make the slides one next to one

const nextSlide = function () {
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0; // Returning back to the first image when the currentSlide surpass the the number of slides to avoid keep scrolling right infinitly
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlides - 1; // Going to the last slide when the currentSlide is low than 0 to avoid keep scrolling left infinitly
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
};

//* Attaching the event to the buttons :
btnRight.addEventListener("click", nextSlide);

btnLeft.addEventListener("click", previousSlide);

//* Attaching the event to the keyboard keys :
document.addEventListener("keydown", function (e) {
  e.key === "arrowLeft" && previousSlide();
  e.key === "arrowRight" && nextSlide();
});
