(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  let burgerBtn;
  let mobileMenu;
  let mobileMenuClose;
  let navDropdownItems = [];

  function setNavDropdownState(item, isOpen) {
    const button = item.querySelector(".nav-link--button");
    item.classList.toggle("is-open", isOpen);
    if (button) {
      button.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function clearNavDropdownTimer(item) {
    if (item && item.navCloseTimer) {
      window.clearTimeout(item.navCloseTimer);
      item.navCloseTimer = null;
    }
  }

  function closeNavDropdown(item) {
    if (!item) {
      return;
    }

    clearNavDropdownTimer(item);
    setNavDropdownState(item, false);
  }

  function closeNavDropdowns(exceptItem = null) {
    navDropdownItems.forEach(function (item) {
      if (item !== exceptItem) {
        closeNavDropdown(item);
      }
    });
  }

  function openNavDropdown(item) {
    if (!item) {
      return;
    }

    clearNavDropdownTimer(item);
    closeNavDropdowns(item);
    setNavDropdownState(item, true);
  }

  function scheduleNavDropdownClose(item) {
    if (!item) {
      return;
    }

    clearNavDropdownTimer(item);
    item.navCloseTimer = window.setTimeout(function () {
      closeNavDropdown(item);
    }, 180);
  }

  function initNavDropdowns() {
    navDropdownItems = Array.from(
      document.querySelectorAll(".nav-item--has-menu"),
    );

    navDropdownItems.forEach(function (item) {
      const button = item.querySelector(".nav-link--button");
      const links = item.querySelectorAll(".nav-dropdown-link");
      if (!button) {
        return;
      }

      button.setAttribute("aria-expanded", "false");

      item.addEventListener("pointerenter", function () {
        openNavDropdown(item);
      });

      item.addEventListener("pointerleave", function () {
        scheduleNavDropdownClose(item);
      });

      item.addEventListener("focusin", function () {
        openNavDropdown(item);
      });

      item.addEventListener("focusout", function (event) {
        const nextFocused = event.relatedTarget;
        if (!nextFocused || !item.contains(nextFocused)) {
          scheduleNavDropdownClose(item);
        }
      });

      button.addEventListener("click", function (event) {
        if (button.tagName === "A" && button.getAttribute("href")) {
          closeNavDropdowns();
          return;
        }

        event.preventDefault();

        if (item.classList.contains("is-open")) {
          closeNavDropdown(item);
          return;
        }

        openNavDropdown(item);
      });

      links.forEach(function (link) {
        link.addEventListener("click", function () {
          closeNavDropdowns();
        });
      });
    });
  }

  function initSolidNavigation() {
    const nav = document.querySelector("nav");
    const hero = document.querySelector(".hero, .contact-hero");
    if (!nav || !hero) {
      return;
    }

    let ticking = false;

    function updateNav() {
      if (window.scrollY >= hero.offsetHeight - 100) {
        nav.classList.add("nav--solid");
      } else {
        nav.classList.remove("nav--solid");
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateNav);
          ticking = true;
        }
      },
      { passive: true },
    );

    updateNav();
  }

  function openMobileMenu() {
    if (!mobileMenu || !burgerBtn) {
      return;
    }

    mobileMenu.classList.add("open");
    burgerBtn.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    burgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenu || !burgerBtn) {
      return;
    }

    mobileMenu.classList.remove("open");
    burgerBtn.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    burgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function handleDocumentClick(event) {
    if (
      navDropdownItems.length > 0 &&
      !event.target.closest(".nav-item--has-menu")
    ) {
      closeNavDropdowns();
      return true;
    }

    return false;
  }

  function handleKeydown(event) {
    let handled = false;

    if (
      event.key === "Escape" &&
      mobileMenu &&
      mobileMenu.classList.contains("open")
    ) {
      closeMobileMenu();
      handled = true;
    }

    if (event.key === "Escape" && navDropdownItems.length > 0) {
      closeNavDropdowns();
      handled = true;
    }

    return handled;
  }

  function init() {
    burgerBtn = document.getElementById("burgerBtn");
    mobileMenu = document.getElementById("mobileMenu");
    mobileMenuClose = document.getElementById("mobileMenuClose");

    if (burgerBtn) {
      burgerBtn.addEventListener("click", openMobileMenu);
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMobileMenu);
    }

    initNavDropdowns();
    initSolidNavigation();
  }

  features.navigation = {
    closeMobileMenu,
    handleDocumentClick,
    handleKeydown,
    init,
    openMobileMenu,
  };
})();
