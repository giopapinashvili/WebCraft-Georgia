(function () {
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var mobileNav = document.getElementById('mobileNav');
  if (!menuBtn || !mobileNav) return;

  var servicesBtn = mobileNav.querySelector('.mobile-nav-services-btn');
  var mobileNavSub = mobileNav.querySelector('.mobile-nav-sub');

  function closeMenu() {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = mobileNav.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  if (servicesBtn && mobileNavSub) {
    servicesBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileNavSub.classList.toggle('open');
      servicesBtn.classList.toggle('open', isOpen);
      servicesBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var links = mobileNav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', closeMenu);
  }

  document.addEventListener('click', function (e) {
    if (!menuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
