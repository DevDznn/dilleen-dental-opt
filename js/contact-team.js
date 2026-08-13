const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const message = document.getElementById("message");
const messageCount = document.getElementById("messageCount");

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

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
