/* ------------- TOGGLE STEPS ------------- */
const qTab = document.querySelectorAll(".qmtt");
const qBox = document.querySelectorAll(".qmms");

// Add a click event listener to each sidebar element
qTab.forEach((element, index) => {
  element.addEventListener("click", () => {
    // Remove active class from all sidebar elements
    qTab.forEach((el) => {
      el.classList.remove("active");
    });
    // Add active class to the clicked sidebar element
    element.classList.add("active");

    // Remove active class from all containers
    qBox.forEach((eb) => {
      eb.classList.remove("active");
    });
    // Add active class to the container with the same index as the clicked sidebar element
    qBox[index].classList.add("active");
  });
});



/* ------------- TOGGLE SERVICES & MODAL ON MOBILE DEVICE ------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Function to handle button click
  function handleClick() {
    const qmTitle = document.querySelector(".qm-title");
    const qmServices = document.querySelector(".qmm-services");
    const qmQuote = document.querySelector(".qmm-quote");

    // Check if viewport width is less than or equal to 480px
    if (window.innerWidth <= 480) {
      // Toggle display properties
      qmTitle.style.display = "none";
      qmServices.style.display = "none";
      qmQuote.style.display = "flex";
    }
  }

  // Add event listener to the button
  var button = document.querySelector(".qspb");
  button.addEventListener("click", handleClick);
});
