const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileServicesToggle = document.querySelector("[data-mobile-services-toggle]");
const mobileServicesPanel = document.querySelector("[data-mobile-services-panel]");
const dropdowns = Array.from(document.querySelectorAll("[data-dropdown]"));

function closeDesktopDropdowns(exceptDropdown) {
  dropdowns.forEach((dropdown) => {
    if (dropdown === exceptDropdown) {
      return;
    }

    dropdown.dataset.open = "false";
    const toggle = dropdown.querySelector("[data-dropdown-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setMobileServicesOpen(isOpen) {
  if (!mobileServicesToggle || !mobileServicesPanel) {
    return;
  }

  mobileServicesToggle.setAttribute("aria-expanded", String(isOpen));
  mobileServicesPanel.dataset.open = String(isOpen);
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden", isExpanded);

    if (isExpanded) {
      setMobileServicesOpen(false);
    }
  });
}

if (mobileServicesToggle && mobileServicesPanel) {
  mobileServicesToggle.addEventListener("click", () => {
    const isExpanded = mobileServicesToggle.getAttribute("aria-expanded") === "true";
    setMobileServicesOpen(!isExpanded);
  });
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector("[data-dropdown-toggle]");
  let pointerFocus = false;

  if (!toggle) {
    return;
  }

  dropdown.addEventListener("pointerdown", () => {
    pointerFocus = true;
    window.setTimeout(() => {
      pointerFocus = false;
    }, 0);
  });

  toggle.addEventListener("click", () => {
    const isOpen = dropdown.dataset.open === "true";
    closeDesktopDropdowns(dropdown);
    dropdown.dataset.open = String(!isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  dropdown.addEventListener("focusin", () => {
    if (pointerFocus) {
      return;
    }

    closeDesktopDropdowns(dropdown);
    dropdown.dataset.open = "true";
    toggle.setAttribute("aria-expanded", "true");
  });

  dropdown.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) {
        dropdown.dataset.open = "false";
        toggle.setAttribute("aria-expanded", "false");
      }
    }, 0);
  });
});

document.addEventListener("click", (event) => {
  if (!dropdowns.some((dropdown) => dropdown.contains(event.target))) {
    closeDesktopDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeDesktopDropdowns();
  setMobileServicesOpen(false);
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const lines = [
      "New consultation request from the Change Moment website:",
      "",
      `Name: ${formData.get("name") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Preferred appointment type: ${formData.get("appointment_type") || ""}`,
      "",
      "Message:",
      formData.get("message") || "",
      "",
      "This message was prepared by the website mailto fallback."
    ];

    const subject = encodeURIComponent("Consultation request from Change Moment");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:hello@changemoment.com?subject=${subject}&body=${body}`;
  });
}
