import throttle from 'underscore/modules/throttle.js';

const jlWrapper = document.querySelector('main');
const jlMenuBtn = document.getElementById('jl-btn');
const jlMenu = document.getElementById('jl-menu');
const jlMenuLinks = document.querySelectorAll('#jl-menu a');
const jlProgressBar = document.getElementById('jl-progress-bar');
const jlCurrentSection = document.getElementById('jl-current-section');
const jlSections = document.querySelectorAll('section[id^="jlsection--"]');

//
// Menu Toggle
//
const toggleJlMenu = () => {
  jlMenu.classList.toggle('hidden');
  jlMenuBtn.textContent === 'Show' ? (jlMenuBtn.textContent = 'Hide') : (jlMenuBtn.textContent = 'Show');
};

const addMenuLinkListeners = () => {
  jlMenuLinks.forEach((link) => link.addEventListener('click', toggleJlMenu));
};

//
// Update Current Section Display
//
const updateJLCurrentSection = () => {
  const sectionInView = [...jlSections].findLast((section) => {
    const topOffset = section.getBoundingClientRect().top;
    return topOffset < document.documentElement.clientHeight / 2;
  });

  if (sectionInView) jlCurrentSection.textContent = sectionInView.querySelector('h2').textContent;
};

//
// Progress Bar Update
//
const updateJlProgressBar = () => {
  const topOffset = -jlWrapper.getBoundingClientRect().top;
  const progressPercentage = (topOffset / (jlWrapper.getBoundingClientRect().height - document.documentElement.clientHeight)) * 100;
  const boundedProgressPercentage = Math.min(Math.max(Math.floor(progressPercentage), 0), 100);

  jlProgressBar.style.width = boundedProgressPercentage + '%';
};

//
// Init
//
const init = () => {
  jlMenuBtn.addEventListener('click', toggleJlMenu);
  addMenuLinkListeners();

  jlCurrentSection.textContent = jlSections[0].querySelector('h2').textContent; // Set starting state
  window.addEventListener('scroll', throttle(updateJLCurrentSection, 100));

  window.addEventListener('scroll', throttle(updateJlProgressBar, 25));
};

export default init;
