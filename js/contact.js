// Toggle Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});
