(() => {
  const header = document.getElementById("site-header");
  const menu = document.getElementById("site-main-nav");
  const toggle = document.getElementById("site-menu-toggle");

  if (!header || !menu || !toggle) return;

  const desktopMedia = window.matchMedia("(min-width: 1021px)");

  const getPageName = (pathname) => {
    let page = pathname.split("/").filter(Boolean).pop() || "index.html";

    if (!page.includes(".")) page += ".html";

    return page.toLowerCase();
  };

  const currentPage = getPageName(window.location.pathname);

  document
    .querySelectorAll(".site-main-nav a, .site-book-button")
    .forEach((link) => {
      const linkPage = getPageName(
        new URL(link.href, window.location.href).pathname,
      );
      const isCurrent = linkPage === currentPage;

      link.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

  const setMenu = (open) => {
    document.body.classList.toggle("site-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
  };

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  toggle.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("site-menu-open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      document.body.classList.contains("site-menu-open") &&
      !header.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  const handleDesktopChange = (event) => {
    if (event.matches) setMenu(false);
  };

  if (desktopMedia.addEventListener) {
    desktopMedia.addEventListener("change", handleDesktopChange);
  } else {
    desktopMedia.addListener(handleDesktopChange);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
})();
