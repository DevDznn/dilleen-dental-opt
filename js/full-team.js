document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document
    .querySelectorAll(".doctor-profile__bio-shell")
    .forEach((shell) => {
      const bio = shell.querySelector(".doctor-profile__bio");
      const button = shell.querySelector(
        ".doctor-profile__bio-scroll",
      );

      if (!bio || !button) return;

      const updateScrollControl = () => {
        const isScrollable =
          bio.scrollHeight > bio.clientHeight + 3;
        const isAtEnd =
          bio.scrollTop + bio.clientHeight >= bio.scrollHeight - 3;

        shell.classList.toggle("is-scrollable", isScrollable);
        shell.classList.toggle(
          "has-more",
          isScrollable && !isAtEnd,
        );
        button.hidden = !isScrollable || isAtEnd;
        bio.tabIndex = isScrollable ? 0 : -1;
      };

      button.addEventListener("click", () => {
        bio.scrollBy({
          top: Math.max(160, bio.clientHeight * 0.72),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });

      bio.addEventListener("scroll", updateScrollControl, {
        passive: true,
      });

      if ("ResizeObserver" in window) {
        new ResizeObserver(updateScrollControl).observe(bio);
      } else {
        window.addEventListener("resize", updateScrollControl);
      }

      updateScrollControl();
    });
});
