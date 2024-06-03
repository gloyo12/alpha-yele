/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".header");
  var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  //When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 80) {
    nav.classList.add("active");
    header.classList.add("active");
  } else {
    nav.classList.remove("active");
    header.classList.remove("active");
  }
}

window.addEventListener("scroll", scrollHeader);

/*==================== TOGGLE MENU MOBILE ====================*/
const navMenu = document.querySelector(".nav-menu");
const qModal = document.querySelector(".quote-modal");
const qText = document.getElementById("qspe-p");
const qExtra = document.querySelector(".qsp-extra");

function toggleMenu() {
  navMenu.classList.toggle("active");
}

function toggleQuote() {
  qModal.classList.toggle("active");
  if (!qModal.classList.contains("active")) {
    qExtra.classList.remove("active");
  }
}

qText.addEventListener("click", () => {
  qExtra.classList.add("active");
});



/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nml");

function linkAction() {
  const navMenu = document.querySelector(".nav-menu");
  // When we click on each nav__link, we remove the toggle-nav-menu class
  navMenu.classList.remove("active");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== EVENTS CAROUSEL ====================*/
const arrows = document.querySelectorAll("[data-carousel-arrow]");

arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const offset = arrow.dataset.carouselArrow === "next" ? 1 : -1;
    const slides = arrow
      .closest("[data-carousel]")
      .querySelector("[data-slides]");

    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) newIndex = slides.children.lenght - 1;
    if (newIndex >= slides.children.length) newIndex = 0;

    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
  });
});

const openInNewTab = (url) => {
  window.open(url, "_blank");
};

/* ------------- TOGGLE STEPS ------------- */
const sTab = document.querySelectorAll(".stt");
const sBox = document.querySelectorAll(".stm");

// Add a click event listener to each sidebar element
sTab.forEach((element, index) => {
  element.addEventListener("click", () => {
    // Remove active class from all sidebar elements
    sTab.forEach((el) => {
      el.classList.remove("active");
    });
    // Add active class to the clicked sidebar element
    element.classList.add("active");

    // Remove active class from all containers
    sBox.forEach((eb) => {
      eb.classList.remove("active");
    });
    // Add active class to the container with the same index as the clicked sidebar element
    sBox[index].classList.add("active");
  });
});

/* ------------- TOGGLE SERVICES ------------- */
const seTab = document.querySelectorAll(".sett");
const seBox = document.querySelectorAll(".sm");

// Add a click event listener to each sidebar element
seTab.forEach((element, index) => {
  element.addEventListener("click", () => {
    // Remove active class from all sidebar elements
    seTab.forEach((set) => {
      set.classList.remove("active");
    });
    // Add active class to the clicked sidebar element
    element.classList.add("active");

    // Remove active class from all containers
    seBox.forEach((seb) => {
      seb.classList.remove("active");
    });
    // Add active class to the container with the same index as the clicked sidebar element
    seBox[index].classList.add("active");
  });
});

/* ------------- CONTACT FORM (SERVICE SELECTION) ------------- */
// Get all elements with class "cfit"
var cfitElements = document.querySelectorAll(".cfit");

// Add click event listener to each "cfit" element
cfitElements.forEach(function (element) {
  element.addEventListener("click", function () {
    // Toggle the "active" class
    this.classList.toggle("active");

    // Toggle the classes "bx-checkbox" and "bxs-checkbox-checked" on the <i> element inside the clicked "cfit"
    var iconElement = this.querySelector("i");
    iconElement.classList.toggle("bx-checkbox");
    iconElement.classList.toggle("bxs-checkbox-checked");
  });
});

/* ------------- ANIMATED STATS (NUMBERS) ------------- */
function animateCount(element, target, duration) {
  const fps = 60;
  const frameDuration = 1000 / fps;
  const totalFrames = duration / frameDuration;
  const increment = target / totalFrames;

  let currentCount = 0;
  let frame = 0;

  function updateCount() {
    currentCount += increment;
    element.textContent = Math.round(currentCount);

    frame++;
    if (frame < totalFrames) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = target;
    }
  }

  updateCount();
}

function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const countElement = entry.target.querySelector(".count");
      const targetCount = parseInt(countElement.getAttribute("data-target"));
      animateCount(countElement, targetCount, 3000); // Adjust duration as needed
    } else {
      // Reset the counter when scrolling out of the view
      const countElement = entry.target.querySelector(".count");
      countElement.textContent = 0;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const aStatsContainer = document.querySelector(".a-stats");
  const countElements = document.querySelectorAll(".count");
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0,
  });

  observer.observe(aStatsContainer);
  countElements.forEach(function (element) {
    observer.observe(element.closest(".flex-center"));
  });
});
