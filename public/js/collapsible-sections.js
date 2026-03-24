const mobileBreakpoint = 820;

function setSectionState(button, content, isOpen) {
  button.setAttribute("aria-expanded", String(isOpen));
  content.hidden = !isOpen;
  content.classList.toggle("is-open", isOpen);
}

function initCollapsibleSections() {
  const sections = document.querySelectorAll(".collapsible-panel");

  sections.forEach((section) => {
    const button = section.querySelector(".section-toggle");
    const content = section.querySelector(".section-content");

    if (!button || !content) return;

    const shouldOpenByDefault = window.innerWidth > mobileBreakpoint;
    setSectionState(button, content, shouldOpenByDefault);

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      setSectionState(button, content, !isOpen);
    });
  });

  let lastMode = window.innerWidth > mobileBreakpoint ? "desktop" : "mobile";

  window.addEventListener("resize", () => {
    const newMode = window.innerWidth > mobileBreakpoint ? "desktop" : "mobile";
    if (newMode === lastMode) return;

    document.querySelectorAll(".collapsible-panel").forEach((section) => {
      const button = section.querySelector(".section-toggle");
      const content = section.querySelector(".section-content");
      if (!button || !content) return;

      const shouldOpen = newMode === "desktop";
      setSectionState(button, content, shouldOpen);
    });

    lastMode = newMode;
  });
}

initCollapsibleSections();