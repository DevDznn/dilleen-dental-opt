const hdr = document.getElementById("hdr");
addEventListener("scroll", () =>
  hdr.classList.toggle("scrolled", scrollY > 10),
);
document
  .getElementById("burger")
  .addEventListener("click", () =>
    document.body.classList.toggle("menuopen"),
  );
document
  .querySelectorAll("#mainnav a")
  .forEach((a) =>
    a.addEventListener("click", () =>
      document.body.classList.remove("menuopen"),
    ),
  );
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

        element.textContent =
          currentValue.toFixed(decimals) + suffix;

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
  document.addEventListener(
    "DOMContentLoaded",
    prepareTrustAnimation,
  );
} else {
  prepareTrustAnimation();
}
