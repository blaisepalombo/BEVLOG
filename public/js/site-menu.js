const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.remove("is-open");
  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

function openMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.add("is-open");
  mobileMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
}

function toggleMenu() {
  if (!menuToggle || !mobileMenu) return;
  if (mobileMenu.classList.contains("is-open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", toggleMenu);

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mobileMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  mobileMenu.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 820) {
        closeMenu();
      }
    });
  });
}