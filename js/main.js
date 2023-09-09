function copyRight() {
	var date = new Date().getFullYear();
	var s = 'Copyright &copy; ' + date + ' All rights reserved | This template is made with <i class="icon-heart color-danger" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>'
	document.getElementById("copyright").innerHTML = s;
}
copyRight();

AOS.init({
	duration: 800,
	easing: 'slide'
});

(function ($) {

	"use strict";

	$(window).stellar({
		responsive: true,
		parallaxBackgrounds: true,
		parallaxElements: true,
		horizontalScrolling: false,
		hideDistantElements: false,
		scrollProperty: 'scroll'
	});

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function () {
		setTimeout(function () {
			if ($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
	$.Scrollax();



	// Burger Menu
	var burgerMenu = function () {

		$('body').on('click', '.js-fh5co-nav-toggle', function (event) {

			event.preventDefault();

			if ($('#ftco-nav').is(':visible')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}



		});

	};
	burgerMenu();


	var onePageClick = function () {


		$(document).on('click', '#ftco-nav a[href^="#"]', function (event) {
			event.preventDefault();

			var href = $.attr(this, 'href');

			$('html, body').animate({
				scrollTop: $($.attr(this, 'href')).offset().top - 70
			}, 500, function () {
				// window.location.hash = href;
			});
		});

	};

	onePageClick();


	var carousel = function () {
		$('.home-slider').owlCarousel({
			loop: true,
			autoplay: true,
			margin: 0,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
			nav: false,
			autoplayHoverPause: false,
			items: 1,
			navText: ["<span class='ion-md-arrow-back'></span>", "<span class='ion-chevron-right'></span>"],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				1000: {
					items: 1
				}
			}
		});
	};
	carousel();

	$('nav .dropdown').hover(function () {
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function () {
		var $this = $(this);
		// timer;
		// timer = setTimeout(function(){
		$this.removeClass('show');
		$this.find('> a').attr('aria-expanded', false);
		// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
		console.log('show');
	});

	// scroll
	var scrollWindow = function () {
		$(window).scroll(function () {
			var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar'),
				sd = $('.js-scroll-wrap');

			if (st > 150) {
				if (!navbar.hasClass('scrolled')) {
					navbar.addClass('scrolled');
				}
			}
			if (st < 150) {
				if (navbar.hasClass('scrolled')) {
					navbar.removeClass('scrolled sleep');
				}
			}
			if (st > 350) {
				if (!navbar.hasClass('awake')) {
					navbar.addClass('awake');
				}

				if (sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if (st < 350) {
				if (navbar.hasClass('awake')) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if (sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();



	var counter = function () {

		$('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function () {
					var $this = $(this),
						num = $this.data('number');
					// console.log(num);
					$this.animateNumber(
						{
							number: num,
							numberStep: comma_separator_number_step
						}, 2000
					);
				});

			}

		}, { offset: '95%' });

	}
	counter();


	var contentWayPoint = function () {
		var i = 0;
		$('.ftco-animate').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .ftco-animate.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						}, k * 50, 'easeInOutExpo');
					});

				}, 100);

			}

		}, { offset: '95%' });
	};
	contentWayPoint();

	// magnific popup
	$('.image-popup').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: false,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			verticalFit: true
		},
		zoom: {
			enabled: true,
			duration: 300 // don't foget to change the duration also in CSS
		}
	});

	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,

		fixedContentPos: false
	});

	var scraper = async function () {
		$("#sidebar").load("./data/output.html");
	};
	scraper();

	// Creating 2D Solar System (Real-Time Snapshot)
	$.getJSON('./data/data.json', function (data) {

		// Find the SVG element/container
		const svg = document.getElementById('solarSystemSVG');

		// Find center and create a scale factor
		const centerCanvasX = svg.width.baseVal.value / 2;
		const centerCanvasY = svg.height.baseVal.value / 2;
		var scaleFactor = 16;

		// Load in Planetary Data
		jQuery.each(data, function (i, val) {

			// Change color and scale based on planet
			if (i == "earth") {
				//Earth
				var scale = 1;
				var color = '#417B38'
			} else if (i == "jupiter") {
				//Jupiter
				var scale = 11;
				var color = '#C1844D'
			} else if (i == "mars") {
				//Mars
				var scale = 0.5;
				var color = '#F97A05'
			} else if (i == "mercury") {
				//Mercury
				var scale = 0.33;
				var color = 'red';
			} else if (i == "neptune") {
				//Neptune
				var scale = 3.7;
				var color = '#537CFE'
			} else if (i == "saturn") {
				//Saturn
				var scale = 9;
				var color = '#7B7869'
			} else if (i == "uranus") {
				//Uranus
				var scale = 4;
				var color = '#D3F9FA'
			} else {
				//Venus
				var scale = 0.95;
				var color = '#FDBF01'
			}

			// Extract data
			// var t = Number(val['JD']);
			var ec = Number(val['e']);
			// var QR = Number(val['QR']);
			var IN = Number(val['IN']) * Math.PI / 180;
			var OM = Number(val['OM']) * Math.PI / 180;
			var W = Number(val['W']) * Math.PI / 180;
			// var Tp = Number(val['Tp']);
			// var N = Number(val['N']) * Math.PI / 180;
			var MA = Number(val['MA']) * Math.PI / 180;
			// var TA = Number(val['TA']) * Math.PI / 180;
			var A = Number(val['A']);
			// var AD = Number(val['AD']);
			// var PR = Number(val['PR']);
			// var d = t - 2451543.5;

			// Calculate orbital elements
			var M = MA;
			var E0 = M + ec * Math.sin(M) * (1 + ec * Math.cos(M));
			var E = M;

			// Iterate to find E
			while (Math.abs(E - E0) > 0.0005) {
				E = E0 - (E0 - ec * Math.sin(E0) - M) / (1 - ec * Math.cos(E0))
				E0 = E;
			}

			// Calculate true anomaly and distance
			var v = 2 * Math.atan2(Math.sqrt(1 + ec) * Math.sin(E / 2), Math.sqrt(1 - ec) * Math.cos(E / 2));
			var r = A * (1 - ec * Math.cos(E));

			// Convert to Cartesian coordinates
			var x = r * (Math.cos(v + W) * Math.cos(OM) - Math.sin(v + W) * Math.cos(IN) * Math.sin(OM));
			var y = r * (Math.cos(v + W) * Math.sin(OM) + Math.sin(v + W) * Math.cos(IN) * Math.cos(OM));
			// var z = r * (Math.sin(v + W) * Math.sin(IN))

			// Extract coordinates
			var X = -x * scaleFactor + centerCanvasX;
			var Y = -y * scaleFactor + centerCanvasY;

			// Find axes of ellipse
			const semimajorAxis = A * scaleFactor;
			const semiminorAxis = Math.sqrt((semimajorAxis * semimajorAxis) * (1 - ec * ec));

			// Calculate distance between foci points in pixels for center
			const c = A * ec * scaleFactor;
			const fociX = c * Math.sin(W);
			const fociY = c * Math.cos(W)

			// Draw each planet as a SVG circle
			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttribute("cx", X);
			circle.setAttribute("cy", Y);
			circle.setAttribute("r", scale * 3);
			circle.setAttribute("stroke", "none");
			circle.setAttribute("fill", color);
			svg.appendChild(circle);

			// Create a path element with the SVG namespace
			var ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
			ellipse.setAttribute("cx", centerCanvasX - fociX / 2);
			ellipse.setAttribute("cy", centerCanvasY + fociY / 2);
			ellipse.setAttribute("rx", semimajorAxis);
			ellipse.setAttribute("ry", semiminorAxis);
			ellipse.setAttribute("fill", "none");
			ellipse.setAttribute("stroke", color);
			ellipse.setAttribute("stroke-width", "1");
			svg.appendChild(ellipse);

		});

		// Draw Sun
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("cx", centerCanvasX);
		circle.setAttribute("cy", centerCanvasY);
		circle.setAttribute("r", 5);
		circle.setAttribute("fill", "yellow");
		svg.appendChild(circle);

	});

})(jQuery);