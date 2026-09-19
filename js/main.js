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
const svgNS = 'http://www.w3.org/2000/svg';
const orbitScaleFactor = 16;

function getSvgMetrics() {
  const bounds = svg.getBoundingClientRect();
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  return {
    width,
    height,
    centerX: width / 2,
    centerY: height / 2
  };
}

function orbitalPoint(r, trueAnomaly, inclination, ascendingNode, argumentOfPeriapsis) {
  const argument = trueAnomaly + argumentOfPeriapsis;
  const x = r * (Math.cos(argument) * Math.cos(ascendingNode) - Math.sin(argument) * Math.cos(inclination) * Math.sin(ascendingNode));
  const y = r * (Math.cos(argument) * Math.sin(ascendingNode) + Math.sin(argument) * Math.cos(inclination) * Math.cos(ascendingNode));
  return { x, y };
}

function createStarfield(starGroup, width, height, starsCount) {
  for (let i = 0; i < starsCount; i += 1) {
    const star = document.createElementNS(svgNS, 'circle');
    star.setAttribute('cx', (Math.random() * width).toFixed(2));
    star.setAttribute('cy', (Math.random() * height).toFixed(2));
    star.setAttribute('r', (Math.random() * 1.15 + 0.25).toFixed(2));
    star.setAttribute('class', 'solar-star');
    star.style.opacity = (Math.random() * 0.6 + 0.15).toFixed(2);
    starGroup.appendChild(star);
  }
}

function buildOrbitPath(data, centerX, centerY) {
  const has3dElements = Number.isFinite(data.IN) && Number.isFinite(data.OM);

  if (!has3dElements) {
    const semimajorAxis = data.A * orbitScaleFactor;
    const semiminorAxis = Math.sqrt(semimajorAxis * semimajorAxis * (1 - data.ec * data.ec));
    const focusOffset = data.A * data.ec * orbitScaleFactor;
    const orientation = Number.isFinite(data.W) ? data.W : 0;
    const ellipseCenterX = centerX + focusOffset * Math.cos(orientation);
    const ellipseCenterY = centerY - focusOffset * Math.sin(orientation);
    return `M ${ellipseCenterX + semimajorAxis} ${ellipseCenterY} a ${semimajorAxis} ${semiminorAxis} 0 1 0 ${-2 * semimajorAxis} 0 a ${semimajorAxis} ${semiminorAxis} 0 1 0 ${2 * semimajorAxis} 0`;
  }

  const segments = 240;
  let path = '';

  for (let i = 0; i <= segments; i += 1) {
    const trueAnomaly = (i / segments) * Math.PI * 2;
    const r = data.A * (1 - data.ec * data.ec) / (1 + data.ec * Math.cos(trueAnomaly));
    const point = orbitalPoint(r, trueAnomaly, data.IN, data.OM, data.W);
    const x = centerX - point.x * orbitScaleFactor;
    const y = centerY + point.y * orbitScaleFactor;
    path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }

  return `${path}Z`;
}

function createPlanetRadius(scale) {
  return Math.max(2.2, Math.min(13, Math.pow(scale, 0.55) * 2.65));
}

function drawCelestialBody(planet, data, layers, centerX, centerY) {
  const x = -data.coordinates[0] * orbitScaleFactor + centerX;
  const y = data.coordinates[1] * orbitScaleFactor + centerY;
  const className = (planet === 'uranus' || planet === 'neptune') ? 'hide' : 'show';

  const orbitPath = document.createElementNS(svgNS, 'path');
  orbitPath.setAttribute('d', buildOrbitPath(data, centerX, centerY));
  orbitPath.setAttribute('class', `orbit-track ${className}`);
  orbitPath.style.stroke = data.color;
  layers.orbitLayer.appendChild(orbitPath);

  const halo = document.createElementNS(svgNS, 'circle');
  halo.setAttribute('cx', x);
  halo.setAttribute('cy', y);
  halo.setAttribute('r', createPlanetRadius(data.scale) + 2);
  halo.setAttribute('class', `planet-halo ${className}`);
  halo.style.stroke = data.color;
  // layers.bodyLayer.appendChild(halo);

  const body = document.createElementNS(svgNS, 'circle');
  body.setAttribute('cx', x);
  body.setAttribute('cy', y);
  body.setAttribute('r', createPlanetRadius(data.scale));
  body.setAttribute('class', `planet-body ${className}`);
  body.setAttribute('fill', data.color);

  const title = document.createElementNS(svgNS, 'title');
  title.textContent = planet.charAt(0).toUpperCase() + planet.slice(1);
  body.appendChild(title);
  layers.bodyLayer.appendChild(body);
}

// Draw 2D Realtime Solar System for today
function drawSolarSystem() {
  if (!svg) {
    return;
  }

  const { width, height, centerX, centerY } = getSvgMetrics();
  svg.replaceChildren();

  const starLayer = document.createElementNS(svgNS, 'g');
  const orbitLayer = document.createElementNS(svgNS, 'g');
  const bodyLayer = document.createElementNS(svgNS, 'g');

  createStarfield(starLayer, width, height, Math.max(40, Math.round((width * height) / 9000)));

  const centerGlow = document.createElementNS(svgNS, 'circle');
  centerGlow.setAttribute('cx', centerX);
  centerGlow.setAttribute('cy', centerY);
  centerGlow.setAttribute('r', 24);
  centerGlow.setAttribute('class', 'sun-halo');
  bodyLayer.appendChild(centerGlow);

  const sun = document.createElementNS(svgNS, 'circle');
  sun.setAttribute('cx', centerX);
  sun.setAttribute('cy', centerY);
  sun.setAttribute('r', 7.5);
  sun.setAttribute('class', 'sun-core');
  bodyLayer.appendChild(sun);

  svg.appendChild(starLayer);
  svg.appendChild(orbitLayer);
  svg.appendChild(bodyLayer);

  fetch('./data/planetPositions.json')
    .then(response => response.json())
    .then(planetsData => {
      Object.entries(planetsData).forEach(([planet, data]) => {
        drawCelestialBody(planet, data, { orbitLayer, bodyLayer }, centerX, centerY);
      });
    })
    .catch(error => {
      console.error('Could not load planet positions:', error);
    });
}

let solarResizeFrameId;
window.addEventListener('resize', () => {
  if (solarResizeFrameId) {
    cancelAnimationFrame(solarResizeFrameId);
  }
  solarResizeFrameId = requestAnimationFrame(() => {
    drawSolarSystem();
  });
});

// Initial drawing
drawSolarSystem();