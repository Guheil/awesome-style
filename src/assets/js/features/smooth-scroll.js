(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  const lenisScriptUrl = "https://unpkg.com/lenis@1.3.23/dist/lenis.min.js";
  let initPromise = null;

  function shouldSkipSmoothScroll() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function loadLenisScript() {
    if (window.Lenis) {
      return Promise.resolve();
    }

    const existingScript = document.querySelector("script[data-awesome-lenis]");
    if (existingScript) {
      return new Promise(function (resolve, reject) {
        existingScript.addEventListener("load", resolve, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
      });
    }

    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = lenisScriptUrl;
      script.async = true;
      script.dataset.awesomeLenis = "true";
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Unable to load Lenis smooth scrolling."));
      };
      document.head.appendChild(script);
    });
  }

  function shouldPreventSmoothScroll(node) {
    return Boolean(
      node.closest &&
      node.closest(
        ".date-popup-shell, .date-modal, .mobile-menu, .gallery-lightbox, [data-lenis-prevent]",
      ),
    );
  }

  function createLenis() {
    if (!window.Lenis || window.awesomeLenis) {
      return window.awesomeLenis || null;
    }

    window.awesomeLenis = new window.Lenis({
      anchors: true,
      autoRaf: true,
      autoToggle: true,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      prevent: shouldPreventSmoothScroll,
    });

    return window.awesomeLenis;
  }

  function init() {
    if (initPromise) {
      return initPromise;
    }

    if (shouldSkipSmoothScroll()) {
      return Promise.resolve(null);
    }

    initPromise = loadLenisScript()
      .then(createLenis)
      .catch(function (error) {
        console.warn(error.message);
        return null;
      });

    return initPromise;
  }

  features.smoothScroll = {
    init,
  };
})();
