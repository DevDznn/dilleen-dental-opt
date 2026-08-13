(() => {
  const form = document.getElementById("appointmentForm");
  const steps = [...document.querySelectorAll(".booking-step")];
  const progressSteps = [
    ...document.querySelectorAll("[data-progress-step]"),
  ];
  const progressBar = document.getElementById("progressBar");
  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");
  const currentStepLabel =
    document.getElementById("currentStepLabel");
  const bookingActions = document.getElementById("bookingActions");
  const formMessage = document.getElementById("formMessage");
  const bookingSuccess = document.getElementById("bookingSuccess");
  const preferredDate = document.getElementById("preferredDate");
  const notes = document.getElementById("notes");
  const noteCount = document.getElementById("noteCount");
  let currentStep = 1;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  preferredDate.min = toDateInputValue(tomorrow);

  function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function selectedValue(name) {
    return form.querySelector(`[name="${name}"]:checked`)?.value || "";
  }

  function setMessage(message = "") {
    formMessage.textContent = message;
    formMessage.hidden = !message;
  }

  function fieldsForStep(stepNumber) {
    return [
      ...steps[stepNumber - 1].querySelectorAll(
        "input, select, textarea",
      ),
    ];
  }

  function validateStep(stepNumber) {
    setMessage();

    if (stepNumber === 2 && preferredDate.value) {
      const chosenDate = new Date(`${preferredDate.value}T12:00:00`);
      if (chosenDate.getDay() === 0 || chosenDate.getDay() === 6) {
        preferredDate.setCustomValidity(
          "Please choose a Monday to Friday appointment date.",
        );
      } else {
        preferredDate.setCustomValidity("");
      }
    }

    const invalidField = fieldsForStep(stepNumber).find(
      (field) => !field.checkValidity(),
    );

    if (invalidField) {
      setMessage("Please complete the required selection or field.");
      invalidField.reportValidity();
      invalidField.focus({ preventScroll: true });
      invalidField.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }

    return true;
  }

  function updateProgress() {
    steps.forEach((step, index) => {
      step.hidden = index + 1 !== currentStep;
    });

    progressSteps.forEach((item, index) => {
      const number = index + 1;
      item.classList.toggle("is-active", number === currentStep);
      item.classList.toggle("is-complete", number < currentStep);
      item.setAttribute(
        "aria-current",
        number === currentStep ? "step" : "false",
      );
    });

    progressBar.style.width = `${((currentStep - 1) / 3) * 100}%`;
    currentStepLabel.textContent = currentStep;
    backButton.hidden = currentStep === 1;
    nextButton.innerHTML =
      currentStep === 4
        ? `Confirm appointment
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2" d="m9 18 6-6-6-6" />
          </svg>`
        : `Continue
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2" d="m9 18 6-6-6-6" />
          </svg>`;

    steps[currentStep - 1]
      .querySelector("legend")
      ?.focus({ preventScroll: true });
  }

  function formattedDate(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
  }

  function updateReview() {
    const firstName = form.elements.firstName.value.trim();
    const lastName = form.elements.lastName.value.trim();
    const email = form.elements.email.value.trim();
    const phone = form.elements.phone.value.trim();
    const contactMethod = form.elements.contactMethod.value;

    document.getElementById("reviewDate").textContent = formattedDate(
      preferredDate.value,
    );
    document.getElementById("reviewService").textContent =
      selectedValue("service") || "—";
    document.getElementById("reviewDentist").textContent =
      selectedValue("dentist") || "—";
    document.getElementById("reviewTime").textContent =
      selectedValue("time") || "—";
    document.getElementById("reviewPatient").textContent =
      `${firstName} ${lastName}`.trim() || "—";
    document.getElementById("reviewContact").textContent =
      email && phone
        ? `${contactMethod}: ${contactMethod === "Email" ? email : phone}`
        : "—";
  }

  function completePreview() {
    const firstName = form.elements.firstName.value.trim();
    const summary = [
      selectedValue("service"),
      selectedValue("dentist"),
      formattedDate(preferredDate.value),
      selectedValue("time"),
    ];

    steps.forEach((step) => (step.hidden = true));
    bookingActions.hidden = true;
    document.querySelector(".booking-progress").hidden = true;
    setMessage();

    document.getElementById("successName").textContent =
      firstName || "there";
    document.getElementById("successSummary").innerHTML = summary
      .map((item) => `<span>${item}</span>`)
      .join("");
    bookingSuccess.hidden = false;
    bookingSuccess.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  nextButton.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 4) {
      completePreview();
      return;
    }

    currentStep += 1;
    if (currentStep === 4) updateReview();
    updateProgress();
    document
      .querySelector(".booking-card")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });

  backButton.addEventListener("click", () => {
    if (currentStep <= 1) return;
    currentStep -= 1;
    setMessage();
    updateProgress();
    document
      .querySelector(".booking-card")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("submit", (event) => event.preventDefault());

  notes.addEventListener("input", () => {
    noteCount.textContent = notes.value.length;
  });

  preferredDate.addEventListener("change", () => {
    const chosenDate = new Date(`${preferredDate.value}T12:00:00`);
    if (chosenDate.getDay() === 0 || chosenDate.getDay() === 6) {
      preferredDate.setCustomValidity(
        "Please choose a Monday to Friday appointment date.",
      );
    } else {
      preferredDate.setCustomValidity("");
    }
  });

  document
    .getElementById("newRequest")
    .addEventListener("click", () => {
      form.reset();
      noteCount.textContent = "0";
      bookingSuccess.hidden = true;
      bookingActions.hidden = false;
      document.querySelector(".booking-progress").hidden = false;
      currentStep = 1;
      updateProgress();
    });

  updateProgress();
})();
