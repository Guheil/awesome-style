(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  let initialized = false;
  let listenersBound = false;

  function getFeature(name) {
    return app.features && app.features[name] ? app.features[name] : null;
  }

  function exposeGlobals() {
    const booking = getFeature("booking");
    const navigation = getFeature("navigation");
    const carousels = getFeature("carousels");
    const dining = getFeature("dining");
    const events = getFeature("events");
    const reviews = getFeature("reviews");
    const media = getFeature("media");

    if (booking) {
      window.adjustGuests = booking.adjustGuests;
      window.openDateModal = booking.openDateModal;
      window.closeDateModal = booking.closeDateModal;
      window.confirmDate = booking.confirmDate;
      window.handleBook = booking.handleBook;
    }

    if (carousels) {
      window.moveResortCarousel = carousels.moveResortCarousel;
      window.goToResortSlide = carousels.goToResortSlide;
      window.moveAmenitiesCarousel = carousels.moveAmenitiesCarousel;
      window.goToAmenitiesSlide = carousels.goToAmenitiesSlide;
      window.moveDiningCarousel = carousels.moveDiningCarousel;
      window.goToDiningSlide = carousels.goToDiningSlide;
      window.moveDaytourCarousel = carousels.moveDaytourCarousel;
      window.goToDaytourSlide = carousels.goToDaytourSlide;
    }

    if (dining) {
      window.setDiningVenue = dining.setDiningVenue;
      window.setMenuCategory = dining.setMenuCategory;
      window.setMenuVenue = dining.setMenuVenue;
    }

    if (events) {
      window.setEventType = events.setEventType;
    }

    if (reviews) {
      window.shiftReviews = reviews.shiftReviews;
    }

    if (navigation) {
      window.openMobileMenu = navigation.openMobileMenu;
      window.closeMobileMenu = navigation.closeMobileMenu;
    }

    window.onYouTubeIframeAPIReady = media
      ? media.onYouTubeIframeAPIReady
      : function () {};
  }

  function handleDocumentClick(event) {
    const navigation = getFeature("navigation");
    const booking = getFeature("booking");

    if (navigation) {
      navigation.handleDocumentClick(event);
    }

    if (booking) {
      booking.handleDocumentClick(event);
    }
  }

  function handleDocumentKeydown(event) {
    const gallery = getFeature("gallery");
    const booking = getFeature("booking");
    const navigation = getFeature("navigation");

    if (gallery && gallery.handleKeydown(event)) {
      return;
    }

    if (booking && booking.handleKeydown(event)) {
      return;
    }

    if (navigation) {
      navigation.handleKeydown(event);
    }
  }

  function bindListeners() {
    if (listenersBound) {
      return;
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeydown);

    const reviews = getFeature("reviews");
    if (reviews) {
      window.addEventListener("resize", reviews.handleResize);
    }

    listenersBound = true;
  }

  function initFeature(name) {
    const feature = getFeature(name);
    if (feature && typeof feature.init === "function") {
      feature.init();
    }
  }

  function start() {
    if (initialized) {
      return;
    }

    initialized = true;

    exposeGlobals();

    initFeature("navigation");
    initFeature("booking");
    initFeature("carousels");
    initFeature("dining");
    initFeature("events");
    initFeature("gallery");
    initFeature("faq");
    initFeature("reviews");
    initFeature("rooms");
    initFeature("blogs");
    initFeature("media");
    initFeature("smoothScroll");

    bindListeners();
  }

  app.start = start;
})();
