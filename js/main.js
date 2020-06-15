$('body').on('touchstart', function () {});

window.onscroll = function scrollFunction() {
	"use strict";
	if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
		document.getElementsByTagName("header")[1].style.height = "4.2vw";
		document.getElementsByClassName("logo")[0].style.width = "3.2vw";
	} else {
		document.getElementsByTagName("header")[1].style.height = "6vw";
		document.getElementsByClassName("logo")[0].style.width = "4vw";
	}
};

$(document).ready(function () {
	"use strict";
	setTimeout(function () {
		$('#loading').fadeOut();
		$("body").css("overflow", "visible");
		$(window).scrollTop(0);
	}, 4000);

});


/*mobile_nav_bar*/


(function () {
	"use strict";
	// Responsive Sidebar
	var searchInput = document.getElementsByClassName('js-cd-search')[0],
		navList = document.getElementsByClassName('js-cd-nav__list')[0];
	if (searchInput && navList) {
		var sidebar = document.getElementsByClassName('js-cd-side-nav')[0],
			mainHeader = document.getElementsByClassName('js-cd-main-header')[0],
			mobileNavTrigger = document.getElementsByClassName('js-cd-nav-trigger')[0],
			dropdownItems = document.getElementsByClassName('js-cd-item--has-children');

		//on resize, move search and top nav position according to window width
		var resizing = false;
		window.addEventListener('resize', function () {
			if (resizing) return;
			resizing = true;
			(!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300): window.requestAnimationFrame(moveNavigation);
		});
		window.dispatchEvent(new Event('resize')); //trigger the moveNavigation function

		//on mobile, open sidebar when clicking on menu icon
		$('.js-cd-nav-trigger').on('click', function (event) {
			event.preventDefault();
			var toggle = !Util.hasClass(sidebar, 'cd-side-nav--is-visible');
			if (toggle) expandSidebarItem();
			Util.toggleClass(sidebar, 'cd-side-nav--is-visible', toggle);
			Util.toggleClass(mobileNavTrigger, 'cd-nav-trigger--nav-is-visible', toggle);
		});

		// on mobile -> show subnavigation on click
		for (var i = 0; i < dropdownItems.length; i++) {
			(function (i) {
				dropdownItems[i].children[0].addEventListener('click', function (event) {
					if (checkMQ() == 'mobile') {
						event.preventDefault();
						var item = event.target.parentNode;
						Util.toggleClass(item, 'cd-side__item--expanded', !Util.hasClass(item, 'cd-side__item--expanded'));
					}
				});
			})(i);
		}

		function moveNavigation() { // move searchInput and navList
			var mq = checkMQ();
			if (mq == 'mobile' && !Util.hasClass(navList.parentNode, 'js-cd-side-nav')) {
				detachElements();
				sidebar.appendChild(navList);
				sidebar.insertBefore(searchInput, sidebar.firstElementChild);
			} else if (mq == 'desktop' && !Util.hasClass(navList.parentNode, 'js-cd-main-header')) {
				detachElements();
				mainHeader.appendChild(navList);
				mainHeader.insertBefore(searchInput, mainHeader.firstElementChild.nextSibling);
			}
			checkSelected(mq);
			resizing = false;
		};

		function detachElements() { // remove element from DOM
			searchInput.parentNode.removeChild(searchInput);
			navList.parentNode.removeChild(navList);
		};

		function hideHoveredItems() { // exit sidebar -> hide dropdown
			var hoveredItems = sidebar.getElementsByClassName('hover');
			for (var i = 0; i < hoveredItems.length; i++) Util.removeClass(hoveredItems[i], 'hover');
		};

		function checkMQ() { // check if mobile or desktop device
			return window.getComputedStyle(mainHeader, '::before').getPropertyValue('content').replace(/'|"/g, "");
		};

		function expandSidebarItem() { // show dropdown of the selected sidebar item
			Util.addClass(sidebar.getElementsByClassName('cd-side__item--selected')[0], 'cd-side__item--expanded');
		};

	}
}());


/*util*/
// Utility function
function Util() {};

/* 
	class manipulation functions
*/
Util.hasClass = function (el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function (el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.add(classList[0]);
	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function (el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);
	else if (Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className = el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function (el, className, bool) {
	if (bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function (el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function (el, className) {
	var children = el.children,
		childrenByClass = [];
	for (var i = 0; i < el.children.length; i++) {
		if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
	}
	return childrenByClass;
};

/* 
	Animate height of an element
*/
Util.setHeight = function (start, to, element, duration, cb) {
	var change = to - start,
		currentTime = null;

	var animateHeight = function (timestamp) {
		if (!currentTime) currentTime = timestamp;
		var progress = timestamp - currentTime;
		var val = parseInt((progress / duration) * change + start);
		element.setAttribute("style", "height:" + val + "px;");
		if (progress < duration) {
			window.requestAnimationFrame(animateHeight);
		} else {
			cb();
		}
	};

	//set the height of the element before starting animation -> fix bug on Safari
	element.setAttribute("style", "height:" + start + "px;");
	window.requestAnimationFrame(animateHeight);
};

/* 


/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
	if (!element) element = document.getElementsByTagName("body")[0];
	element.focus();
	if (document.activeElement !== element) {
		element.setAttribute('tabindex', '-1');
		element.focus();
	}
};

/* 
  Misc
*/

Util.getIndexInArray = function (array, el) {
	return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function (property, value) {
	if ('CSS' in window) {
		return CSS.supports(property, value);
	} else {
		var jsProperty = property.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
		return jsProperty in document.body.style;
	}
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

//Custom Event() constructor
if (typeof window.CustomEvent !== "function") {

	function CustomEvent(event, params) {
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t--;
	return -c / 2 * (t * (t - 2) - 1) + b;
};
$(".n").click(function () {
	$(this).next('.nested_mobile_list').toggleClass("block");
});
$('a[href*="#"]')
	.not('[href="#"]')
	.not('[href="#0"]')
	.click(function (event) {
		"use strict";
		if (
			location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
			location.hostname === this.hostname
		) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				var targetOffset = target.offset().top - 130;
				event.preventDefault();
				$('html, body').animate({
					scrollTop: targetOffset
				}, 800, function () {

					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) {
						return false;
					} else {
						$target.attr('tabindex', '-1');
						$target.focus();
					}
				});
			}
		}
	});

var appear_box = document.querySelectorAll(".facility_data_section");
var close_btn5 = document.querySelectorAll(".close5");

$(".align").bind("click", function () {
	"use strict";
	var divs = $(".align");
	var z = divs.index($(this));

	appear_box[z].style.visibility = "visible";
	_find.style.height = "100%";
	close_btn5[z].onclick = function () {


		appear_box[z].style.visibility = "hidden";
		_find.style.height = "0";

	};
});
var appear_box = document.querySelectorAll(".facility_data_section");
var close_btn5 = document.querySelectorAll(".close5");

$(".facility_button").bind("click", function () {
	"use strict";
	var divs = $(".facility_button");
	var e = divs.index($(this));

	appear_box[e].style.visibility = "visible";
	_find.style.height = "100%";
	close_btn5[e].onclick = function () {


		appear_box[e].style.visibility = "hidden";
		_find.style.height = "0";

	};
});


$(document).ready(function () {
	"use strict";
	$(".cards").hover(function () {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		var color = 'rgb(' + r + ',' + g + ',' + b + ')';
		$(this).css("background-color", color);

	});

});

var close_btn = document.getElementById("close1");
var close_btn1 = document.getElementById("close2");
var close_btn2 = document.getElementById("close3");
var faculty = document.getElementById("faculty");
var staff = document.getElementById("staff");
var students = document.getElementById("students");
var expand_ppl = document.querySelectorAll(".expandppl");
var expand_ppl1 = document.querySelectorAll(".expandppl1");
var expand_ppl2 = document.querySelectorAll(".expandppl2");
var _find = document.getElementsByClassName("find")[0];

var i;
for (i = 0; i < expand_ppl.length; i++) {

	expand_ppl[i].onclick = function () {
		"use strict";
		$(window).scrollTop(0);
		faculty.style.visibility = "visible";
		_find.style.height = "100%";

	};
	close_btn.onclick = function () {
		"use strict";

		faculty.style.visibility = "hidden";
		_find.style.height = "0";

	};
}
var j;
for (j = 0; j < expand_ppl1.length; j++) {
	expand_ppl1[j].onclick = function () {
		"use strict";

		$(window).scrollTop(0);

		staff.style.visibility = "visible";
		_find.style.height = "100%";

	};
	close_btn1.onclick = function () {
		"use strict";

		staff.style.visibility = "hidden";
		_find.style.height = "0";

	};
}
var k;
for (k = 0; k < expand_ppl2.length; k++) {
	expand_ppl2[k].onclick = function () {
		"use strict";

		$(window).scrollTop(0);

		students.style.visibility = "visible";
		_find.style.height = "100%";

	};
	close_btn2.onclick = function () {
		"use strict";

		students.style.visibility = "hidden";
		_find.style.height = "0";

	};
}


$('#input').keydown(function (e) {
	"use strict";
	if (e.keyCode === 13) {
		$('#form').submit();
	}

});
$('#submit').on("click", function () {
	"use strict";
	$('#input').val('');
});


var card1 = document.getElementById("card1");
var data1 = document.getElementById("res_data1");
card1.onmouseover = function () {
	"use strict";
	data1.style.transition = "all 0.7s";
	data1.style.height = "27vw";


	data1.onmouseover = function () {
		$('.h2').eq(0).addClass('h2_hover');
		$('.icons').eq(0).addClass('icons_hover');
		data1.style.height = "auto";
	};
};

card1.onmouseout = function () {
	"use strict";
	data1.style.transition = "all 0.08s";
	data1.style.height = "0";
	data1.onmouseout = function () {
		$('.h2').eq(0).removeClass('h2_hover');
		$('.icons').eq(0).removeClass('icons_hover');
		data1.style.transition = "all 0.08s";
		data1.style.height = "0";

	};
};

var card2 = document.getElementById("card2");
var data2 = document.getElementById("res_data2");
card2.onmouseover = function () {
	"use strict";
	data2.style.transition = "all 0.7s";
	data2.style.height = "27vw";
	data2.onmouseover = function () {
		$('.h2').eq(1).addClass('h2_hover');
		$('.icons').eq(1).addClass('icons_hover');
		data2.style.height = "auto";
	};

};
card2.onmouseout = function () {
	"use strict";
	data2.style.transition = "all 0.08s";
	data2.style.height = "0";
	data2.onmouseout = function () {
		$('.h2').eq(1).removeClass('h2_hover');
		$('.icons').eq(1).removeClass('icons_hover');
		data2.style.transition = "all 0.08s";
		data2.style.height = "0";
	};
};
var card3 = document.getElementById("card3");
var data3 = document.getElementById("res_data3");
card3.onmouseover = function () {
	"use strict";
	data3.style.transition = "all 0.7s";
	data3.style.height = "27vw";
	data3.onmouseover = function () {
		$('.h2').eq(2).addClass('h2_hover');
		$('.icons').eq(2).addClass('icons_hover');
		data3.style.height = "auto";
	};
};
card3.onmouseout = function () {
	"use strict";
	data3.style.transition = "all 0.08s";
	data3.style.height = "0";
	data3.onmouseout = function () {
		$('.h2').eq(2).removeClass('h2_hover');
		$('.icons').eq(2).removeClass('icons_hover');
		data3.style.transition = "all 0.08s";
		data3.style.height = "0";
	};
};
var card4 = document.getElementById("card4");
var data4 = document.getElementById("res_data4");
card4.onmouseover = function () {
	"use strict";
	data4.style.transition = "all 0.7s";
	data4.style.height = "27vw";
	data4.onmouseover = function () {
		$('.h2').eq(3).addClass('h2_hover');
		$('.icons').eq(3).addClass('icons_hover');
		data4.style.height = "auto";
	};
};
card4.onmouseout = function () {
	"use strict";
	data4.style.transition = "all 0.08s";
	data4.style.height = "0";
	data4.onmouseout = function () {
		$('.h2').eq(3).removeClass('h2_hover');
		$('.icons').eq(3).removeClass('icons_hover');
		data4.style.transition = "all 0.08s";
		data4.style.height = "0";
	};
};


$('.nstd_lst').mouseover(function () {
	"use strict";
	$('.list > a').css('color', '#5E43DA');
});
$('.nstd_lst').mouseout(function () {
	"use strict";
	$('.list > a').css('color', '#000000');
});


$('#search').on("click", function () {
	"use strict";
	$(".find").css("height", "100%");
	$("#close4").css("display", "block");

	$("#srch").css("display", "block");

});
$('#close4').on("click", function () {
	"use strict";
	$(".find").css("height", "0");
	$("#close4").css("display", "none");

	$("#srch").css("display", "none");
});


/*$("#card1").click(function () {
	"use strict";
   	$('#res_data1').toggleClass("hidden");
	$('#icons1').toggleClass("icons_hover");
	$('#h21').toggleClass("h2_hover");
	});
$("#card2").click(function () {
	"use strict";
   	$('#res_data2').toggleClass("hidden");
	$('#icons2').toggleClass("icons_hover");
	$('#h22').toggleClass("h2_hover");
	});
$("#card3").click(function () {
	"use strict";
   	$('#res_data3').toggleClass("hidden");
	$('#icons3').toggleClass("icons_hover");
	$('#h23').toggleClass("h2_hover");
	});
$("#card4").click(function () {
	"use strict";
   	$('#res_data4').toggleClass("hidden");
	$('#icons4').toggleClass("icons_hover");
	$('#h24').toggleClass("h2_hover");
	});
	*/

$(document).ready(function () {
	"use strict";
	$("#testimonial-slider").owlCarousel({
		items: 1,
		itemsDesktop: [1000, 1],
		itemsDesktopSmall: [979, 1],
		itemsTablet: [768, 1],
		pagination: true,
		navigationText: ["◄", "►"],
		navigation: true,

		singleItem: true,

		smartSpeed: 1000,
		transitionStyle: "fadeUp",
		autoPlay: true
	});
});


class DAH {
	constructor(nodes) {
		this.nodes = [];

		Array.prototype.slice.call(nodes, 0).forEach(node => {
			this.nodes.push(new Node(node));
		});

		this._bindEvents();
	}

	_bindEvents() {
		['_resizeHandler'].forEach(fn => this[fn1] = this[fn1].bind(this));
		window.addEventListener('resize', this._resizeHandler, false);
	}

	_resizeHandler() {
		this.nodes.forEach(node => node.update());
	}
}

class Node {
	constructor(node) {
		this.element = node;
		this._bindEvents().update();
	}

	update() {
		// const bcr = this.element.getBoundingClientRect();
		// this.l = bcr.left;
		// this.t = bcr.top;
		this.w = this.element.offsetWidth;
		this.h = this.element.offsetHeight;
		this.l = this.element.offsetLeft;
		this.t = this.element.offsetTop;
	}

	_bindEvents() {
		['_mouseEnterHandler', '_mouseOutHandler'].forEach(fn => this[fn] = this[fn].bind(this));
		this.element.addEventListener('mouseenter', this._mouseEnterHandler, false);
		this.element.addEventListener('mouseout', this._mouseOutHandler, false);
		return this;
	}

	_mouseEnterHandler(ev) {
		this._addClass(ev, 'in');
	}

	_mouseOutHandler(ev) {
		this._addClass(ev, 'out');
	}

	_addClass(ev, state) {
		const direction = this._getDirection(ev);
		let class_suffix = '';

		switch (direction) {
			case 0:
				class_suffix = '-top';
				break;
			case 1:
				class_suffix = '-right';
				break;
			case 2:
				class_suffix = '-bottom';
				break;
			case 3:
				class_suffix = '-left';
				break;
		}

		this.element.className = '';
		this.element.classList.add(state + class_suffix);
	}

	_getDirection(ev) {
		const w = this.w,
			h = this.h,
			x = (ev.pageX - this.l - (w / 2) * (w > h ? (h / w) : 1)),
			y = (ev.pageY - this.t - (h / 2) * (h > w ? (w / h) : 1)),
			d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;

		return d;
	}
}

new DAH(document.querySelectorAll('.xxx'));