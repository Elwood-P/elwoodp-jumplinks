import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import throttle from 'underscore/modules/throttle.js';

const jlWrapper = document.querySelector('main');
const jlHeader = document.getElementById('jl-header');
const jlMenuBtn = document.getElementById('jl-btn');
const jlMenu = document.getElementById('jl-menu');
const jlMenuButtons = document.querySelectorAll('#jl-menu button');
const jlProgressBar = document.getElementById('jl-progress-bar');
const jlCurrentSection = document.getElementById('jl-current-section');
const jlSections = document.querySelectorAll('section[id^="jlsection--"]');

//
// Menu Toggle
//
const toggleJlMenu = (e, sectionTargetId) => {
  const openMenuAnimation = () => gsap.to(jlMenu, { duration: 0.5, height: 'auto' });
  const closeMenuAnimation = () => gsap.to(jlMenu, { duration: 0.5, height: 0 });
  const closeMenuScrolToAnimation = () => {
    const timeLine = gsap.timeline();
    timeLine
      .to(jlMenu, { duration: 0.5, height: 0 })
      .to(window, { duration: 1, scrollTo: { y: sectionTargetId, offsetY: jlHeader.getBoundingClientRect().height } });
  };

  const isMenuOpen = jlMenuBtn.getAttribute('aria-expanded'); // Store state in DOM using aria-expanded

  if (isMenuOpen === 'true') {
    // If called by a menu button then close menu *then* scroll to section
    if (sectionTargetId) {
      closeMenuScrolToAnimation();
    } else {
      closeMenuAnimation();
    }
    jlMenuBtn.textContent = 'Show';
    jlMenuBtn.setAttribute('aria-expanded', 'false');
  } else {
    openMenuAnimation();
    jlMenuBtn.textContent = 'Hide';
    jlMenuBtn.setAttribute('aria-expanded', 'true');
  }
};

const addMenuLinkListeners = () => {
  jlMenuButtons.forEach((button) => button.addEventListener('click', (e) => toggleJlMenu(e, button.dataset.href)));
};

//
// Update Current Section Display
//
const updateJLCurrentSection = () => {
  const sectionInView = [...jlSections].findLast((section) => {
    const topOffset = section.getBoundingClientRect().top;
    const viewPortHeight = document.documentElement.clientHeight;

    return topOffset < viewPortHeight / 2; // Returns the last section to have passed above the halfway point of the viewport
  });

  if (sectionInView) {
    jlCurrentSection.textContent = sectionInView.querySelector('h2').textContent;
  } else {
    jlCurrentSection.textContent = jlSections[0].querySelector('h2').textContent; // Fallback to first section before Jumplinks is in view
  }
};

//
// Progress Bar Update
//
const updateJlProgressBar = () => {
  const topOffset = jlWrapper.getBoundingClientRect().top;
  const viewPortHeight = document.documentElement.clientHeight;
  const wrapperHeight = jlWrapper.getBoundingClientRect().height;

  const progressPercentage = ((viewPortHeight - topOffset) / (wrapperHeight + viewPortHeight)) * 100;
  const boundedProgressPercentage = Math.min(Math.max(progressPercentage, 0), 100);

  jlProgressBar.style.width = boundedProgressPercentage + '%';
};

//
// Init
//
const init = () => {
  gsap.registerPlugin(ScrollToPlugin);

  jlMenuBtn.addEventListener('click', toggleJlMenu);
  addMenuLinkListeners();

  window.addEventListener('scroll', throttle(updateJLCurrentSection, 100)); // Throttle limits updates to every 100ms (performance)
  updateJLCurrentSection(); // Set starting state

  window.addEventListener('scroll', throttle(updateJlProgressBar, 10)); // More frequent updates since bar should appear smooth
  updateJlProgressBar(); // Set starting state
};

export default init;
