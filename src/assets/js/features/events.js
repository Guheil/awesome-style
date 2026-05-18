(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const catalogs = (app.data && app.data.catalogs) || {};
  const eventData = catalogs.eventData || {};
  const bindSwipeNavigation =
    app.gestures && typeof app.gestures.bindSwipeNavigation === "function"
      ? app.gestures.bindSwipeNavigation
      : null;

  let eventTabs = [];
  let eventHeading;
  let eventDescription;
  let eventImage;
  let eventGalleries = [];

  function setEventType(key) {
    const event = eventData[key];
    if (!event) {
      return;
    }

    eventTabs.forEach(function (tab) {
      const isActive = tab.dataset.event === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    if (eventHeading) {
      eventHeading.textContent = event.heading;
    }
    if (eventDescription) {
      eventDescription.textContent = event.description;
    }
    if (eventImage) {
      eventImage.src = event.image;
      eventImage.alt = event.alt;
    }
  }

  function setEventGallerySlide(gallery, nextIndex) {
    const slides = Array.from(
      gallery.querySelectorAll(".events-gallery-slide"),
    );
    const thumbs = Array.from(
      gallery.querySelectorAll(".events-gallery-thumb"),
    );
    const dots = Array.from(gallery.querySelectorAll(".events-gallery-dot"));
    if (slides.length === 0) {
      return;
    }

    const slideIndex = (nextIndex + slides.length) % slides.length;
    gallery.eventsGalleryIndex = slideIndex;

    slides.forEach(function (slide, index) {
      slide.classList.toggle("is-active", index === slideIndex);
    });
    thumbs.forEach(function (thumb, index) {
      thumb.classList.toggle("is-active", index === slideIndex);
    });
    dots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === slideIndex);
    });
  }

  function moveEventGallery(gallery, step) {
    const currentIndex = gallery.eventsGalleryIndex || 0;
    setEventGallerySlide(gallery, currentIndex + step);
  }

  function initEventGalleries() {
    eventGalleries = Array.from(
      document.querySelectorAll("[data-events-gallery]"),
    );

    eventGalleries.forEach(function (gallery) {
      const slides = Array.from(
        gallery.querySelectorAll(".events-gallery-slide"),
      );
      const stage = gallery.querySelector(".events-gallery-stage");
      const thumbs = Array.from(
        gallery.querySelectorAll(".events-gallery-thumb"),
      );
      const dotsWrap = gallery.querySelector(".events-gallery-dots");
      const prevButton = gallery.querySelector("[data-events-gallery-prev]");
      const nextButton = gallery.querySelector("[data-events-gallery-next]");

      if (slides.length === 0) {
        return;
      }

      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        slides.forEach(function (_, index) {
          const dot = document.createElement("span");
          dot.className = `events-gallery-dot${index === 0 ? " is-active" : ""}`;
          dotsWrap.appendChild(dot);
        });
      }

      thumbs.forEach(function (thumb, index) {
        thumb.setAttribute("aria-label", `View image ${index + 1}`);
        thumb.addEventListener("click", function () {
          setEventGallerySlide(gallery, index);
        });
      });

      if (prevButton) {
        prevButton.addEventListener("click", function () {
          moveEventGallery(gallery, -1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", function () {
          moveEventGallery(gallery, 1);
        });
      }

      if (stage && bindSwipeNavigation) {
        bindSwipeNavigation(stage, {
          canStart: function () {
            return slides.length > 1;
          },
          ignoreSelector: "button, a",
          onSwipe: function (step) {
            moveEventGallery(gallery, step);
          },
        });
      }

      setEventGallerySlide(gallery, 0);
    });
  }

  function init() {
    eventTabs = Array.from(document.querySelectorAll(".events-tab"));
    eventHeading = document.getElementById("eventHeading");
    eventDescription = document.getElementById("eventDescription");
    eventImage = document.getElementById("eventImage");

    initEventGalleries();
    setEventType("beachfrontWedding");
  }

  features.events = {
    init,
    setEventType,
  };
})();
