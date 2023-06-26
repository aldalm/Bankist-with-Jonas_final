'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scrolliing

btnScrolTo.addEventListener('click', function (e) {
  const s1coord = section1.getBoundingClientRect();//Rectangle - прямоуголник, coordinates of section1. current position plus current scroll

  // console.log(s1coord);

  //old school decision:
  //Scrolling
  // window.scrollTo(s1coord.left + window.pageXOffset, s1coord.top + window.pageYOffset)

  //or

  // window.scrollTo({
  //   left: s1coord.left + window.pageXOffset,
  //   top: s1coord.top + window.pageYOffset,
  //   behavior: "smooth"
  // })
  //new school
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////////////////////////////////////
//Page navigation
//my comment - navigation header items already implemented in html file =><a class="nav__link" href="#section--1">Features</a>
//now Jonas wants to smoothly navigate to that section

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
//   });
// });

//1.Add EventListener to the common parent element
//2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//194. Building a tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//it's not efficient if we have many buttons, but it is work
// tab.forEach(t => t.addEventListener('click', function () {
//   console.log('TAB');
// }));

//correct to use Event Delegations

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');//without parentElement, when we clicked, numbers we jump to span element
  // console.log(clicked);
  if (!clicked) return;
  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active tab
  clicked.classList.add('operations__tab--active');
  //activate content area
  // console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
});

//Menu fade animation

//195 Passing Arguments to Even handlers
// const nav = document.querySelector('.nav');

// nav.addEventListener('mouseover', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 0.5;
//     });
//     logo.style.opacity = 0.5;
//   }

// });

// nav.addEventListener('mouseout', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 1;
//     });
//     logo.style.opacity = 1;
//   }
// });
//code above is perfectly working but need some clearness

//need to refactoring because the code is not clear - repeating inems
//let's try to refactor this code in purpose of cleaness

// const nav = document.querySelector('.nav');

// const handleHover = function (e, opacity) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = opacity;
//     });
//     logo.style.opacity = opacity;
//   }
// }

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5)
// });

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1)
// });
//AAAnd it's working - perfect. detalize the code to understand why we can't just put handleHover function in addEventListener directly just like - handleHover(e, 0.5)

//but we have 3rd version of this code using 'bind' method:
const nav = document.querySelector('.nav');
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;//check this
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


//Sticky navigation - закрепить верхнюю часть

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   // console.log(e);
//   console.log(window.scrollY);
//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky')
// });

//Code above is working, but in old smartphones it is will be bad perfomance using 'scroll' method. And as usual we have another way without scroll

//working well but need to analyze more deeply

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);


//Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
});


//Lazy loading images

const imgTargets = document.querySelectorAll
  ('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace scr with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  height: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };


  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
  };


  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else { curSlide++ }
    goToSlide(curSlide);
    activateDot(curSlide);

  }

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);


  //Implementing arrow tab on keyboard <-   ->
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide()
  });

  //Implementing dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    };
  });
};
slider();


////Lectures
//Selecting elements:

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);


// const allSection = document.querySelectorAll('.section');
// console.log(allSection);

// const allbuttons = document.getElementsByTagName('button');
// console.log(allbuttons);
// const sect = document.getElementById('section--1');
// console.log(sect);
// const a = document.querySelector('.section');
// console.log(a);

// console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
//insertAdjacentHTML

//Cookie example:

// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');

// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie"> Got it!</button >';

// header.append(message);
// // header.before(message);

// document.querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   })

//187 Styles, Attributes and Classes

//Style
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.backgroundColor);//rgb(55, 56, 61)
// console.log(message.style.color);//nothing - bcouse it is not inline styled

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// console.log(getComputedStyle(message).width);

//let's increase little bit the height of cookie message

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// console.log(getComputedStyle(message).height);

// //Changing the CCS 

// document.documentElement.style.setProperty('--color-primary', 'orangered')//all buttons in orangered color

//ATTRIBUTES
//HTML attributes for exzmple
//<img
// src = "img/logo.png"
// alt = "Bankist logo"
// class="nav__logo"
// id = "logo"
//   />

//src, alt, class, id - is the attributes of img element
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.id);
// console.log(logo.className);

// logo.alt = 'beatuful minimalist logo';
// console.log(logo.alt);//beatuful minimalist logo
// //also we can set attribute
// logo.setAttribute('company', 'Bankist')
// console.log(logo.getAttribute('src'));
//Non-Standart

//188 SMOOTH SCROLLING


//198 Types of events and event handlers

// const footer = document.querySelector('footer');

// const alertH1 = function (e) {
//   alert('blabla bla')
// };

// footer.addEventListener('mouseenter', alertH1);

// footer.removeEventListener('mouseenter', alertH1);

//192 Event propagation in practice

//rgb(255,255,255) - let's' create random color

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min + 1) + min);//random integer between two numbers

// const randColor = `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
// console.log(randColor);

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('click');
// })

//193 DOM TRAVERSING
// const h1 = document.querySelector('h1');

// //going downwards: child 
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// console.log(h1.parentNode);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';//header part background styled orangered
// h1.closest('h1').style.background = 'var(--gradient-primary)';//h1 part background styled green

// //Going sideways - siblings
// console.log(h1.previousElementSibling);//null bcouse hasn't previous sibling
// console.log(h1.nextElementSibling);//h4 - next sibling

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //all siblings
// console.log(h1.parentElement.children);

// //let's change all siblings element size
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)'//all siblings decreased to 0.5
// })

/////////////////

//Lifecycle DOM Events

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

//pop-up just before leaving page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

////
//  Атрибут defer сообщает браузеру, что он должен продолжать обрабатывать страницу и загружать скрипт в фоновом режиме, а затем запустить этот скрипт, когда DOM дерево будет полностью построено.Скрипты с defer никогда не блокируют страницу.

//
//A script that will be downloaded in parallel to parsing the page, and executed as soon as it is available:
//<script src="demo_async.js" async></script>






