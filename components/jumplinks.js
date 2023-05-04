import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import throttle from 'underscore/modules/throttle.js';

const wrapper = document.getElementById('jl-wrapper');
const header = document.getElementById('jl-header');
const menu = document.getElementById('jl-menu');
const menuToggleBtn = document.getElementById('jl-btn');
const menuSectionBtns = document.querySelectorAll('#jl-menu button');
const progressBar = document.getElementById('jl-progress-bar');
const currentSection = document.getElementById('jl-current-section');
const sections = document.querySelectorAll('section[id^="jl-section--"]');

// Toggle menu open/close and handle scrolling to target section
function toggleMenu(e, sectionTargetId) {
  const openMenuAnimation = () => gsap.to(menu, { duration: 0.5, height: 'auto' });
  const closeMenuAnimation = () => gsap.to(menu, { duration: 0.5, height: 0 });
  const closeMenuScrolToAnimation = () => {
    const timeLine = gsap.timeline();
    timeLine
      .to(menu, { duration: 0.5, height: 0 })
      .to(window, { duration: 1, scrollTo: { y: sectionTargetId, offsetY: header.getBoundingClientRect().height } });
  };

  // Use aria-expanded to control menu state
  const isMenuOpen = menuToggleBtn.getAttribute('aria-expanded');

  if (isMenuOpen === 'true') {
    if (!sectionTargetId) {
      closeMenuAnimation();
    } else {
      // If called by a menu button (passes sectionTargetId), close menu then scroll to section
      closeMenuScrolToAnimation();
    }
    menuToggleBtn.textContent = 'Show';
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    openMenuAnimation();
    menuToggleBtn.textContent = 'Hide';
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }
}

// Add click event listeners to menu buttons
function addMenuButtonListeners() {
  menuSectionBtns.forEach((button) => button.addEventListener('click', (e) => toggleMenu(e, button.dataset.href)));
}

// Update displayed current section based on scroll position
function updateCurrentSection() {
  const sectionInView = [...sections].findLast((section) => {
    const topOffset = section.getBoundingClientRect().top;
    const viewPortHeight = document.documentElement.clientHeight;
    // Returns the last section to have passed above the halfway point of the viewport
    return topOffset < viewPortHeight / 2;
  });

  if (sectionInView) {
    currentSection.textContent = sectionInView.querySelector('h2').textContent;
  } else {
    // Use first section before Jumplinks arrives in view
    currentSection.textContent = sections[0].querySelector('h2').textContent;
  }
}

// Update progress bar width based on scroll position
function updateProgressBar() {
  const topOffset = wrapper.getBoundingClientRect().top;
  const viewPortHeight = document.documentElement.clientHeight;
  const wrapperHeight = wrapper.getBoundingClientRect().height;

  const progressPercentage = ((viewPortHeight - topOffset) / (wrapperHeight + viewPortHeight)) * 100;
  const boundedProgressPercentage = Math.min(Math.max(progressPercentage, 0), 100);

  progressBar.style.width = boundedProgressPercentage + '%';
}

// Initialise event listeners and set initial states
function init() {
  gsap.registerPlugin(ScrollToPlugin);

  menuToggleBtn.addEventListener('click', toggleMenu);
  addMenuButtonListeners();

  // Throttle limits updates to every 100ms (performance)
  window.addEventListener('scroll', throttle(updateCurrentSection, 100));
  updateCurrentSection();

  // More frequent updates for smooth bar animation
  window.addEventListener('scroll', throttle(updateProgressBar, 10));
  updateProgressBar();
}

export default init;
