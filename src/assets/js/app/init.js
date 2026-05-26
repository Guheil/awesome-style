(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  let initialized = false;
  let listenersBound = false;
  let phraseObserver = null;
  const protectedPhraseRules = [
    {
      pattern: /San\s+Juan/g,
      replacement: "San\u00A0Juan",
    },
    {
      pattern: /La\s+Union/g,
      replacement: "La\u00A0Union",
    },
    {
      pattern: /Awesome\s+Hotel/g,
      replacement: "Awesome\u00A0Hotel",
    },
  ];
  const phraseSkipTags = new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEXTAREA",
    "INPUT",
    "OPTION",
    "CODE",
    "PRE",
  ]);

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

  function shouldSkipPhraseNode(textNode) {
    const parent = textNode.parentElement;

    if (!parent) {
      return true;
    }

    return phraseSkipTags.has(parent.tagName);
  }

  function protectPhrasesInTextNode(textNode) {
    if (!textNode || typeof textNode.nodeValue !== "string") {
      return;
    }

    const originalValue = textNode.nodeValue;
    let nextValue = originalValue;

    protectedPhraseRules.forEach(function (rule) {
      nextValue = nextValue.replace(rule.pattern, rule.replacement);
    });

    if (nextValue !== originalValue) {
      textNode.nodeValue = nextValue;
    }
  }

  function protectPhrasesInNode(root) {
    if (!root) {
      return;
    }

    if (root.nodeType === Node.TEXT_NODE) {
      if (!shouldSkipPhraseNode(root)) {
        protectPhrasesInTextNode(root);
      }

      return;
    }

    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
    ) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (textNode) {
        return shouldSkipPhraseNode(textNode)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });

    let currentNode = walker.nextNode();

    while (currentNode) {
      protectPhrasesInTextNode(currentNode);
      currentNode = walker.nextNode();
    }
  }

  function observeProtectedPhrases() {
    if (
      phraseObserver ||
      typeof MutationObserver !== "function" ||
      !document.body
    ) {
      return;
    }

    phraseObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          protectPhrasesInNode(node);
        });
      });
    });

    phraseObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
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

    protectPhrasesInNode(document.body);
    observeProtectedPhrases();

    bindListeners();
  }

  app.start = start;
})();
