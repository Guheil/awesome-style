(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const bindSwipeNavigation =
    app.gestures && typeof app.gestures.bindSwipeNavigation === "function"
      ? app.gestures.bindSwipeNavigation
      : null;

  let resortCarouselTrack;
  let resortCarouselDots = [];
  let resortCarouselIndex;
  let activeResortSlide = 0;

  let amenitiesTrack;
  let amenitiesThumbs = [];
  let amenitiesIndex;
  let activeAmenitiesSlide = 0;

  let diningTrack;
  let diningDots = [];
  let diningIndex;
  let activeDiningSlide = 0;

  let daytourTrack;
  let daytourStops = [];
  let activeDaytourSlide = 0;

  function bindHorizontalSwipe(element, onSwipe, canStart) {
    if (!bindSwipeNavigation || !element) {
      return;
    }

    bindSwipeNavigation(element, {
      canStart,
      ignoreSelector: "button, a",
      onSwipe,
    });
  }

  function updateResortCarousel() {
    if (!resortCarouselTrack || resortCarouselDots.length === 0) {
      return;
    }

    resortCarouselTrack.style.transform = `translateX(-${activeResortSlide * 100}%)`;
    resortCarouselDots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === activeResortSlide);
    });

    if (resortCarouselIndex) {
      resortCarouselIndex.textContent = `${String(activeResortSlide + 1).padStart(2, "0")} / ${String(resortCarouselDots.length).padStart(2, "0")}`;
    }
  }

  function moveResortCarousel(step) {
    if (resortCarouselDots.length === 0) {
      return;
    }

    activeResortSlide =
      (activeResortSlide + step + resortCarouselDots.length) %
      resortCarouselDots.length;
    updateResortCarousel();
  }

  function goToResortSlide(index) {
    if (index < 0 || index >= resortCarouselDots.length) {
      return;
    }

    activeResortSlide = index;
    updateResortCarousel();
  }

  function updateAmenitiesCarousel() {
    if (!amenitiesTrack || amenitiesThumbs.length === 0) {
      return;
    }

    amenitiesTrack.style.transform = `translateX(-${activeAmenitiesSlide * 100}%)`;
    amenitiesThumbs.forEach(function (thumb, index) {
      const isActive = index === activeAmenitiesSlide;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-pressed", String(isActive));
    });

    if (amenitiesIndex) {
      amenitiesIndex.textContent = `${String(activeAmenitiesSlide + 1).padStart(2, "0")} / ${String(amenitiesThumbs.length).padStart(2, "0")}`;
    }
  }

  function moveAmenitiesCarousel(step) {
    if (amenitiesThumbs.length === 0) {
      return;
    }

    activeAmenitiesSlide =
      (activeAmenitiesSlide + step + amenitiesThumbs.length) %
      amenitiesThumbs.length;
    updateAmenitiesCarousel();
  }

  function goToAmenitiesSlide(index) {
    if (index < 0 || index >= amenitiesThumbs.length) {
      return;
    }

    activeAmenitiesSlide = index;
    updateAmenitiesCarousel();
  }

  function updateDiningCarousel() {
    if (!diningTrack || diningDots.length === 0) {
      return;
    }

    diningTrack.style.transform = `translateX(-${activeDiningSlide * 100}%)`;
    diningDots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === activeDiningSlide);
    });

    if (diningIndex) {
      diningIndex.textContent = `${String(activeDiningSlide + 1).padStart(2, "0")} / ${String(diningDots.length).padStart(2, "0")}`;
    }
  }

  function moveDiningCarousel(step) {
    if (diningDots.length === 0) {
      return;
    }

    activeDiningSlide =
      (activeDiningSlide + step + diningDots.length) % diningDots.length;
    updateDiningCarousel();
  }

  function goToDiningSlide(index) {
    if (index < 0 || index >= diningDots.length) {
      return;
    }

    activeDiningSlide = index;
    updateDiningCarousel();
  }

  function updateDaytourCarousel() {
    if (!daytourTrack || daytourStops.length === 0) {
      return;
    }

    daytourTrack.style.transform = `translateX(-${activeDaytourSlide * 100}%)`;
    daytourStops.forEach(function (stop, index) {
      const isActive = index === activeDaytourSlide;
      stop.classList.toggle("is-active", isActive);
      stop.setAttribute("aria-pressed", String(isActive));
    });
  }

  function moveDaytourCarousel(step) {
    if (daytourStops.length === 0) {
      return;
    }

    activeDaytourSlide =
      (activeDaytourSlide + step + daytourStops.length) % daytourStops.length;
    updateDaytourCarousel();
  }

  function goToDaytourSlide(index) {
    if (index < 0 || index >= daytourStops.length) {
      return;
    }

    activeDaytourSlide = index;
    updateDaytourCarousel();
  }

  function init() {
    resortCarouselTrack = document.getElementById("resortCarouselTrack");
    resortCarouselDots = Array.from(
      document.querySelectorAll(".resort-carousel-dot"),
    );
    resortCarouselIndex = document.getElementById("resortCarouselIndex");

    amenitiesTrack = document.getElementById("amenitiesTrack");
    amenitiesThumbs = Array.from(document.querySelectorAll(".amenities-thumb"));
    amenitiesIndex = document.getElementById("amenitiesIndex");

    diningTrack = document.getElementById("diningTrack");
    diningDots = Array.from(document.querySelectorAll(".dining-dot"));
    diningIndex = document.getElementById("diningIndex");

    daytourTrack = document.getElementById("daytourTrack");
    daytourStops = Array.from(document.querySelectorAll(".daytour-stop"));

    bindHorizontalSwipe(
      resortCarouselTrack ? resortCarouselTrack.parentElement : null,
      moveResortCarousel,
      function () {
        return resortCarouselDots.length > 1;
      },
    );

    bindHorizontalSwipe(
      amenitiesTrack ? amenitiesTrack.parentElement : null,
      moveAmenitiesCarousel,
      function () {
        return amenitiesThumbs.length > 1;
      },
    );

    bindHorizontalSwipe(
      diningTrack ? diningTrack.parentElement : null,
      moveDiningCarousel,
      function () {
        return diningDots.length > 1;
      },
    );

    bindHorizontalSwipe(
      daytourTrack ? daytourTrack.parentElement : null,
      moveDaytourCarousel,
      function () {
        return daytourStops.length > 1;
      },
    );

    updateResortCarousel();
    updateAmenitiesCarousel();
    updateDiningCarousel();
    updateDaytourCarousel();
  }

  features.carousels = {
    goToAmenitiesSlide,
    goToDaytourSlide,
    goToDiningSlide,
    goToResortSlide,
    init,
    moveAmenitiesCarousel,
    moveDaytourCarousel,
    moveDiningCarousel,
    moveResortCarousel,
  };
})();
