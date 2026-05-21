(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});

  if (app.loaderStarted) {
    return;
  }

  app.loaderStarted = true;

  const currentScript = document.currentScript;
  const baseUrl =
    currentScript && currentScript.src
      ? new URL(".", currentScript.src)
      : new URL("./", window.location.href);

  const scriptPaths = [
    "./core/gestures.js",
    "./data/catalogs.js",
    "./data/blogs.js",
    "./features/booking.js",
    "./features/navigation.js",
    "./features/carousels.js",
    "./features/dining.js",
    "./features/events.js",
    "./features/gallery.js",
    "./features/faq.js",
    "./features/reviews.js",
    "./features/rooms.js",
    "./features/blogs.js",
    "./features/media.js",
    "./features/smooth-scroll.js",
    "./app/init.js",
  ];

  function loadScript(relativePath) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = new URL(relativePath, baseUrl).href;
      script.async = false;
      script.dataset.awesomeModule = relativePath;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error(`Unable to load ${relativePath}`));
      };
      document.head.appendChild(script);
    });
  }

  function startApp() {
    if (typeof app.start === "function") {
      app.start();
    }
  }

  scriptPaths
    .reduce(function (chain, relativePath) {
      return chain.then(function () {
        return loadScript(relativePath);
      });
    }, Promise.resolve())
    .then(function () {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startApp, {
          once: true,
        });
        return;
      }

      startApp();
    })
    .catch(function (error) {
      console.error("Failed to load Awesome Hotel scripts.", error);
    });
})();
