const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

function prepareTrustAnimation() {
  const trustSection = document.querySelector(".trust");

  if (!trustSection) return;

  const items = trustSection.querySelectorAll(".t-item");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* Show final values without animation */
  if (reduceMotion) {
    items.forEach((item) => {
      item.querySelector(".lab")?.classList.add("is-visible");
    });

    return;
  }

  /* Prepare values before scrolling to the section */
  items.forEach((item) => {
    const value = item.querySelector(".big");
    const label = item.querySelector(".lab");

    label?.classList.remove("is-visible");

    if (value.dataset.count) {
      const decimals = Number(value.dataset.decimals || 0);
      const suffix = value.dataset.suffix || "";

      value.textContent = Number(0).toFixed(decimals) + suffix;
    }

    if (value.dataset.scramble) {
      value.textContent = value.dataset.scramble
        .split("")
        .map(() => "—")
        .join("");
    }
  });

  /* Number counting animation */
  function animateNumber(element) {
    return new Promise((resolve) => {
      const target = Number(element.dataset.count);
      const decimals = Number(element.dataset.decimals || 0);
      const suffix = element.dataset.suffix || "";
      const duration = 1600;
      const startingTime = performance.now();

      element.classList.add("is-animating");

      function updateNumber(currentTime) {
        const elapsed = currentTime - startingTime;
        const progress = Math.min(elapsed / duration, 1);

        /* Smooth fast-to-slow movement */
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * easedProgress;

        element.textContent = currentValue.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = target.toFixed(decimals) + suffix;
          element.classList.remove("is-animating");
          resolve();
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  /* Rapid letter shuffle animation */
  function animateLetters(element) {
    return new Promise((resolve) => {
      const finalText = element.dataset.scramble;
      const availableLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let progress = 0;

      element.classList.add("is-animating");

      const letterInterval = setInterval(() => {
        element.textContent = finalText
          .split("")
          .map((finalLetter, index) => {
            if (index < progress) {
              return finalLetter;
            }

            const randomIndex = Math.floor(
              Math.random() * availableLetters.length,
            );

            return availableLetters[randomIndex];
          })
          .join("");

        progress += 0.28;

        if (progress >= finalText.length) {
          clearInterval(letterInterval);
          element.textContent = finalText;
          element.classList.remove("is-animating");
          resolve();
        }
      }, 55);
    });
  }

  function startItemAnimation(item, index) {
    const value = item.querySelector(".big");
    const label = item.querySelector(".lab");

    setTimeout(async () => {
      if (value.dataset.count) {
        await animateNumber(value);
      } else if (value.dataset.scramble) {
        await animateLetters(value);
      }

      label?.classList.add("is-visible");
    }, index * 260);
  }

  let animationStarted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;

          items.forEach((item, index) => {
            startItemAnimation(item, index);
          });

          observer.unobserve(trustSection);
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  observer.observe(trustSection);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", prepareTrustAnimation);
} else {
  prepareTrustAnimation();
}

const initServicesSlider = () => {
  document.querySelectorAll("[data-services-slider]").forEach((slider) => {
    if (slider.dataset.sliderReady === "true") return;
    slider.dataset.sliderReady = "true";

    const track = slider.querySelector("[data-services-track]");
    const cards = Array.from(track.querySelectorAll(".svc"));
    const previousButton = slider.querySelector("[data-services-prev]");
    const nextButton = slider.querySelector("[data-services-next]");
    const currentLabel = slider.querySelector("[data-services-current]");
    const progress = slider.querySelector("[data-services-progress]");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!cards.length) return;

    const cardStep = () => {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    };

    const visibleCount = () =>
      Math.max(1, Math.round(track.clientWidth / cardStep()));

    const updateSlider = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const firstVisible = Math.min(
        cards.length - 1,
        Math.max(0, Math.round(track.scrollLeft / cardStep())),
      );
      const lastVisible = Math.min(cards.length, firstVisible + visibleCount());

      currentLabel.textContent =
        lastVisible > firstVisible + 1
          ? `${String(firstVisible + 1).padStart(2, "0")}–${String(
              lastVisible,
            ).padStart(2, "0")}`
          : String(firstVisible + 1).padStart(2, "0");

      progress.style.width = `${(lastVisible / cards.length) * 100}%`;
      previousButton.disabled = track.scrollLeft <= 2;
      nextButton.disabled = track.scrollLeft >= maxScroll - 2;
    };

    const move = (direction) => {
      track.scrollBy({
        left: cardStep() * direction,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    previousButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    });

    let scrollFrame;
    track.addEventListener(
      "scroll",
      () => {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(updateSlider);
      },
      { passive: true },
    );

    window.addEventListener("resize", updateSlider, { passive: true });
    updateSlider();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initServicesSlider);
} else {
  initServicesSlider();
}
