const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden", isExpanded);
  });
}

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
