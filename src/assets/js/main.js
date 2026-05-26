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

  function has(selector) {
    return Boolean(document.querySelector(selector));
  }

  function getScriptGroups() {
    const needsCarousels = has(
      "#resortCarouselTrack, #amenitiesTrack, #diningTrack, #daytourTrack, #teamRoomTrack",
    );
    const needsDining = has(
      ".dining-venue-tab, #diningVenueTitle, #venueMenuSection",
    );
    const needsEvents = has(".events-tab, [data-events-gallery]");
    const needsFaq = has(".events-page-faq");
    const needsGallery = has("#galleryLightbox, .gallery-collection");
    const needsReviews = has("#reviewsTrack");
    const needsRooms = has("#roomsGuestForm, [data-room-gallery]");
    const needsBlogs = has(
      "[data-blog-list], [data-blog-featured], [data-blog-detail]",
    );
    const needsMedia = has(
      ".video-bg .hero-video, #locationMap, .breakfast-transit, [data-reel-video]",
    );
    const needsGestures =
      needsCarousels || needsEvents || needsGallery || needsReviews;
    const needsCatalogs = needsDining || needsEvents;

    const dependencyGroup = [];
    if (needsGestures) {
      dependencyGroup.push("./core/gestures.js");
    }
    if (needsCatalogs) {
      dependencyGroup.push("./data/catalogs.js");
    }
    if (needsBlogs) {
      dependencyGroup.push("./data/blogs.js");
    }

    const globalFeatureGroup = [
      "./features/booking.js",
      "./features/navigation.js",
      "./features/smooth-scroll.js",
    ];
    const pageFeatureGroup = [];

    if (needsCarousels) {
      pageFeatureGroup.push("./features/carousels.js");
    }
    if (needsDining) {
      pageFeatureGroup.push("./features/dining.js");
    }
    if (needsEvents) {
      pageFeatureGroup.push("./features/events.js");
    }
    if (needsGallery) {
      pageFeatureGroup.push("./features/gallery.js");
    }
    if (needsFaq) {
      pageFeatureGroup.push("./features/faq.js");
    }
    if (needsReviews) {
      pageFeatureGroup.push("./features/reviews.js");
    }
    if (needsRooms) {
      pageFeatureGroup.push("./features/rooms.js");
    }
    if (needsBlogs) {
      pageFeatureGroup.push("./features/blogs.js");
    }
    if (needsMedia) {
      pageFeatureGroup.push("./features/media.js");
    }

    return [
      dependencyGroup,
      globalFeatureGroup,
      pageFeatureGroup,
      ["./app/init.js"],
    ].filter(function (group) {
      return group.length > 0;
    });
  }

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

  getScriptGroups()
    .reduce(function (chain, group) {
      return chain.then(function () {
        return Promise.all(group.map(loadScript));
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
