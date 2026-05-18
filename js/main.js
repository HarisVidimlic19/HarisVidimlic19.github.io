// Set fullHeight
const fullHeightEls = document.querySelectorAll('.js-fullheight');
function setFullHeight() {
  const windowHeight = window.innerHeight;
  const isSmallViewport = window.matchMedia('(max-width: 991.98px)').matches;

  fullHeightEls.forEach(el => {
    if (isSmallViewport) {
      el.style.height = 'auto';
      el.style.minHeight = `${Math.max(420, windowHeight * 0.68)}px`;
      return;
    }

    el.style.minHeight = '';
    el.style.height = `${windowHeight}px`;
  });
}
window.addEventListener('resize', setFullHeight);
setFullHeight(); // Set initial height

// Burger Menu
var burgerMenu = function () {
  // Get the nav toggle element
  var navToggle = document.querySelector('.js-fh5co-nav-toggle');
  // Get the nav element
  var nav = document.getElementById('ftco-nav');
  // Toggle the show class on the nav element by clicking the nav toggle element
  navToggle.addEventListener('click', function () {
    nav.classList.toggle('show');
  });
};
burgerMenu();

// Previous section-observer highlight logic was removed for maintainability.
// Navigation remains anchor-based with smooth scrolling.

// One Page Scroll Navigation
var onePageClick = function () {
  // Get all the links that start with '#'
  var links = document.querySelectorAll('#ftco-nav a[href^="#"]');
  // Loop through the links
  links.forEach(function (link) {
    // Add a click event listener to each link
    link.addEventListener('click', function (event) {
      // Prevent the default behavior of the link
      event.preventDefault();
      // Get the href attribute of the link
      var href = link.getAttribute('href');
      // Get the element that matches the href
      var target = document.querySelector(href);
      // Get the top position of the target element
      var targetTop = target.offsetTop;
      // Animate the scroll to the target element
      window.scrollTo({
        top: targetTop - 70,
        behavior: 'smooth'
      });
      // Uncomment the following line if you want to update the hash in the URL
      // window.location.hash = href;
    });
  });
};
onePageClick();

// Carousel using Glider.js
new Glider(document.querySelector(".glider"), {
  dots: ".glider-dots",
}).setOption({
  arrows: {
    prev: ".glider-prev",
    next: ".glider-next",
  },
});

// Dropdown menu
// Get all the nav elements that have the class 'dropdown'
// var navs = document.querySelectorAll('nav .dropdown');
// // Loop through the nav elements
// navs.forEach(function (nav) {
//   // Get the first child element that is an anchor
//   var anchor = nav.querySelector('> a');
//   // Get the first child element that has the class 'dropdown-menu'
//   var menu = nav.querySelector('.dropdown-menu');

//   // Add a mouseenter event listener to each nav element
//   nav.addEventListener('mouseenter', function () {
//     // Add the class 'show' to the nav element
//     nav.classList.add('show');
//     // Set the aria-expanded attribute to true
//     anchor.setAttribute('aria-expanded', true);
//     // Add the classes 'animated-fast', 'fadeInUp' and 'show' to the menu element
//     menu.classList.add('animated-fast', 'fadeInUp', 'show');
//   });

//   // Add a mouseleave event listener to each nav element
//   nav.addEventListener('mouseleave', function () {
//     // Remove the class 'show' from the nav element
//     nav.classList.remove('show');
//     // Set the aria-expanded attribute to false
//     anchor.setAttribute('aria-expanded', false);
//     // Remove the classes 'animated-fast', 'fadeInUp' and 'show' from the menu element
//     menu.classList.remove('animated-fast', 'fadeInUp', 'show');
//   });

// });

// // Get the checkbox and the menu items elements
// const navToggle = document.getElementById("nav-toggle");
// const navLinks = document.querySelector(".nav-links");

// // Add an event listener to the checkbox
// navToggle.addEventListener("change", () => {
//   // Toggle the "show" class on the menu items when the checkbox is checked or unchecked
//   navLinks.classList.toggle("show");
// });

//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


// Scroll
const navbarEl = document.querySelector('.ftco_navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  if (scrollTop > 150) {
    navbarEl.classList.add('scrolled');
  } else {
    navbarEl.classList.remove('scrolled', 'awake');
  }
  if (scrollTop > 350) {
    navbarEl.classList.add('awake');
  } else {
    navbarEl.classList.remove('awake');
  }
});

function animateNumber(element, targetNumber, duration) {
  const startNumber = parseFloat(element.textContent) || 0;
  const step = (targetNumber - startNumber) / duration * 10;
  let currentTime = 0;
  const animate = () => {
    currentTime += 16;
    const currentNumber = Math.min(startNumber + step * currentTime, targetNumber);
    element.textContent = numberWithCommas(currentNumber);
    if (currentTime < duration) {
      requestAnimationFrame(animate);
    }
  };
  animate();
}

function numberWithCommas(number) {
  return number.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

function setupNumberAnimation() {
  const nums = document.querySelectorAll('.number');

  if (!nums.length) {
    return;
  }

  const numberObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      const target = entry.target;
      if (target.dataset.animated === 'true') {
        observer.unobserve(target);
        return;
      }

      target.dataset.animated = 'true';
      animateNumber(target, Number(target.dataset.number || 0), 2200);
      observer.unobserve(target);
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -15% 0px'
  });

  nums.forEach(num => {
    numberObserver.observe(num);
  });
}
setupNumberAnimation();


// Find the SVG element/container to draw on
const svg = document.getElementById('solarSystemSVG');
// Draw 2D Realtime Solar System for today
function drawSolarSystem() {

  // Find center and create a scale factor
  const centerCanvasX = svg.width.baseVal.value / 2;
  const centerCanvasY = svg.height.baseVal.value / 2;

  // Draw Sun first
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", centerCanvasX);
  circle.setAttribute("cy", centerCanvasY);
  circle.setAttribute("r", 5);
  circle.setAttribute("fill", "yellow");
  svg.appendChild(circle);

  fetch('./data/planetPositions.json')
    .then(response => response.json())
    .then(planetsData => {
      // Use Object.entries to get an array of key-value pairs
      const entries = Object.entries(planetsData);

      // Use forEach to iterate over the array
      entries.forEach(([planet, data]) => {
        drawCelestialBody(planet, data, centerCanvasX, centerCanvasY)
      });

    });
}

function drawCelestialBody(planet, data, centerCanvasX, centerCanvasY) {
  const scaleFactor = 16;
  const { A, ec, coordinates, color, scale, W } = data;
  var X = -coordinates[0] * scaleFactor + centerCanvasX;
  var Y = coordinates[1] * scaleFactor + centerCanvasY; // Need non-negative Y for counter-clockwise rotation

  if (planet == "neptune") {
    return
  } else if (planet == "uranus") {
    var className = "hide";
  }
  else {
    var className = "show";
  }

  // Draw each planet as a SVG circle
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", X);
  circle.setAttribute("cy", Y);
  circle.setAttribute("r", scale * 3);
  circle.setAttribute("stroke", "none");
  circle.setAttribute("fill", color);
  circle.setAttribute("class", className);
  svg.appendChild(circle);

  // Find axes of ellipse
  const semimajorAxis = A * scaleFactor;
  const semiminorAxis = Math.sqrt((semimajorAxis * semimajorAxis) * (1 - ec * ec));

  // Calculate distance between foci points in pixels for center
  const c = A * ec * scaleFactor;
  const fociX = c * Math.sin(W);
  const fociY = c * Math.cos(W)

  // Create a path element with the SVG namespace
  var ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  ellipse.setAttribute("cx", centerCanvasX - fociX / 2);
  ellipse.setAttribute("cy", centerCanvasY + fociY / 2);
  ellipse.setAttribute("rx", semimajorAxis);
  ellipse.setAttribute("ry", semiminorAxis);
  ellipse.setAttribute("fill", "none");
  ellipse.setAttribute("stroke", color);
  ellipse.setAttribute("stroke-width", "1");
  ellipse.setAttribute("class", className);
  svg.appendChild(ellipse);
}

// MIGHT NEED TO FIX THIS IN CSS SO IT UPDATES NATURALLY AND NOT WEIRDLY
// Update planets and redraw on resize
// window.addEventListener('resize', () => {
//   // Remove all SVG elements
//   const svg = document.getElementById('solarSystemSVG');
//   while (svg.firstChild) {
//     svg.removeChild(svg.firstChild);
//   }

//   drawSolarSystem();
// });

// Initial drawing
drawSolarSystem();