const header = document.getElementById("hdr");
const burger = document.getElementById("burger");
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const message = document.getElementById("message");
const messageCount = document.getElementById("messageCount");

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

burger.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menuopen");
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

message.addEventListener("input", () => {
  messageCount.textContent = `${message.value.length} / 1000`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.hidden = false;

  if (!form.checkValidity()) {
    status.className = "form-status is-error";
    status.textContent =
      "Please complete the required fields before sending.";
    form.reportValidity();
    return;
  }

  status.className = "form-status is-success";
  status.textContent =
    "Your form is ready. Connect it to your email or website form handler to receive enquiries.";
  status.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
