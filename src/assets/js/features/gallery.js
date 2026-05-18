(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const bindSwipeNavigation =
    app.gestures && typeof app.gestures.bindSwipeNavigation === "function"
      ? app.gestures.bindSwipeNavigation
      : null;

  let galleryLightbox;
  let galleryLightboxDialog;
  let galleryLightboxLabel;
  let galleryLightboxCount;
  let galleryLightboxImage;
  let galleryLightboxPrev;
  let galleryLightboxNext;
  let galleryLightboxClose;
  let galleryLightboxFullscreenToggle;
  let galleryCollections = [];
  let activeGalleryCollectionIndex = -1;
  let activeGalleryImageIndex = 0;
  let lastGalleryTrigger = null;
  let galleryLightboxPseudoFullscreen = false;

  function isGalleryLightboxOpen() {
    return Boolean(
      galleryLightbox && galleryLightbox.classList.contains("is-open"),
    );
  }

  function getGalleryLightboxFullscreenElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      null
    );
  }

  function supportsGalleryLightboxFullscreen() {
    if (!galleryLightboxDialog) {
      return false;
    }

    return Boolean(
      galleryLightboxDialog.requestFullscreen ||
      galleryLightboxDialog.webkitRequestFullscreen ||
      galleryLightboxDialog.msRequestFullscreen,
    );
  }

  function isGalleryLightboxNativeFullscreen() {
    return Boolean(
      galleryLightboxDialog &&
      getGalleryLightboxFullscreenElement() === galleryLightboxDialog,
    );
  }

  function isGalleryLightboxFullscreen() {
    return (
      galleryLightboxPseudoFullscreen || isGalleryLightboxNativeFullscreen()
    );
  }

  function syncGalleryLightboxFullscreenState() {
    if (
      isGalleryLightboxNativeFullscreen() &&
      galleryLightboxPseudoFullscreen
    ) {
      galleryLightboxPseudoFullscreen = false;
    }

    const fullscreenActive = isGalleryLightboxFullscreen();

    if (galleryLightbox) {
      galleryLightbox.classList.toggle("is-fullscreen", fullscreenActive);
    }

    if (galleryLightboxDialog) {
      galleryLightboxDialog.classList.toggle("is-fullscreen", fullscreenActive);
    }

    if (galleryLightboxFullscreenToggle) {
      galleryLightboxFullscreenToggle.setAttribute(
        "aria-pressed",
        String(fullscreenActive),
      );
    }

    if (galleryLightboxClose) {
      galleryLightboxClose.setAttribute(
        "aria-label",
        fullscreenActive
          ? "Exit fullscreen gallery image viewer"
          : "Close gallery image viewer",
      );
    }
  }

  function setGalleryLightboxPseudoFullscreen(nextState) {
    galleryLightboxPseudoFullscreen = Boolean(nextState);
    syncGalleryLightboxFullscreenState();

    if (galleryLightboxClose && galleryLightboxPseudoFullscreen) {
      galleryLightboxClose.focus();
    }
  }

  function requestGalleryLightboxFullscreen() {
    setGalleryLightboxPseudoFullscreen(true);

    if (!supportsGalleryLightboxFullscreen()) {
      return null;
    }

    const requestFullscreen =
      galleryLightboxDialog.requestFullscreen ||
      galleryLightboxDialog.webkitRequestFullscreen ||
      galleryLightboxDialog.msRequestFullscreen;

    const requestResult = requestFullscreen.call(galleryLightboxDialog);

    if (requestResult && typeof requestResult.then === "function") {
      return requestResult
        .then(function () {
          if (galleryLightboxClose) {
            galleryLightboxClose.focus();
          }
        })
        .catch(function () {
          return null;
        });
    }

    if (galleryLightboxClose) {
      galleryLightboxClose.focus();
    }

    return requestResult;
  }

  function exitGalleryLightboxFullscreen() {
    const nativeFullscreenActive = isGalleryLightboxNativeFullscreen();

    if (galleryLightboxPseudoFullscreen) {
      setGalleryLightboxPseudoFullscreen(false);
    }

    if (!nativeFullscreenActive) {
      return null;
    }

    const exitFullscreen =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;

    if (typeof exitFullscreen !== "function") {
      return null;
    }

    const exitResult = exitFullscreen.call(document);

    if (exitResult && typeof exitResult.then === "function") {
      return exitResult.catch(function () {
        return null;
      });
    }

    return exitResult;
  }

  function handleGalleryLightboxCloseButtonClick() {
    if (isGalleryLightboxFullscreen()) {
      exitGalleryLightboxFullscreen();
      return;
    }

    closeGalleryLightbox();
  }

  function preloadGalleryLightboxImage(src) {
    if (!src) {
      return;
    }

    const image = new Image();
    image.src = src;
  }

  function setGalleryLightboxSlide(nextIndex) {
    const collection = galleryCollections[activeGalleryCollectionIndex];
    if (!collection || collection.items.length === 0 || !galleryLightboxImage) {
      return;
    }

    activeGalleryImageIndex =
      (nextIndex + collection.items.length) % collection.items.length;

    const currentItem = collection.items[activeGalleryImageIndex];
    galleryLightboxImage.src = currentItem.src;
    galleryLightboxImage.alt = currentItem.alt;

    if (galleryLightboxLabel) {
      galleryLightboxLabel.textContent = collection.label;
    }

    if (galleryLightboxCount) {
      galleryLightboxCount.textContent = `${String(activeGalleryImageIndex + 1).padStart(2, "0")} / ${String(collection.items.length).padStart(2, "0")}`;
    }

    const controlsDisabled = collection.items.length <= 1;
    if (galleryLightboxPrev) {
      galleryLightboxPrev.disabled = controlsDisabled;
    }
    if (galleryLightboxNext) {
      galleryLightboxNext.disabled = controlsDisabled;
    }

    if (collection.items.length > 1) {
      preloadGalleryLightboxImage(
        collection.items[
          (activeGalleryImageIndex + 1) % collection.items.length
        ].src,
      );
      preloadGalleryLightboxImage(
        collection.items[
          (activeGalleryImageIndex - 1 + collection.items.length) %
            collection.items.length
        ].src,
      );
    }
  }

  function moveGalleryLightbox(step) {
    if (!isGalleryLightboxOpen()) {
      return;
    }

    setGalleryLightboxSlide(activeGalleryImageIndex + step);
  }

  function openGalleryLightbox(collectionIndex, imageIndex, triggerElement) {
    if (!galleryLightbox) {
      return;
    }

    const collection = galleryCollections[collectionIndex];
    if (!collection || collection.items.length === 0) {
      return;
    }

    activeGalleryCollectionIndex = collectionIndex;
    activeGalleryImageIndex = imageIndex;
    lastGalleryTrigger = triggerElement || null;

    setGalleryLightboxSlide(imageIndex);
    galleryLightbox.scrollTop = 0;
    galleryLightbox.hidden = false;
    galleryLightbox.setAttribute("aria-hidden", "false");
    galleryLightbox.classList.add("is-open");
    galleryLightboxPseudoFullscreen = false;
    syncGalleryLightboxFullscreenState();

    if (galleryLightboxClose) {
      galleryLightboxClose.focus();
    }
  }

  function finishClosingGalleryLightbox() {
    if (!galleryLightbox) {
      return;
    }

    galleryLightbox.classList.remove("is-open", "is-fullscreen");
    galleryLightbox.hidden = true;
    galleryLightbox.setAttribute("aria-hidden", "true");

    if (galleryLightboxDialog) {
      galleryLightboxDialog.classList.remove("is-fullscreen");
    }

    galleryLightboxPseudoFullscreen = false;

    if (galleryLightboxImage) {
      galleryLightboxImage.removeAttribute("src");
      galleryLightboxImage.alt = "";
    }

    activeGalleryCollectionIndex = -1;
    activeGalleryImageIndex = 0;

    if (lastGalleryTrigger && typeof lastGalleryTrigger.focus === "function") {
      lastGalleryTrigger.focus();
    }

    lastGalleryTrigger = null;
  }

  function closeGalleryLightbox() {
    if (!galleryLightbox || !isGalleryLightboxOpen()) {
      return;
    }

    const exitResult = isGalleryLightboxFullscreen()
      ? exitGalleryLightboxFullscreen()
      : null;

    if (exitResult && typeof exitResult.then === "function") {
      exitResult.finally(finishClosingGalleryLightbox);
      return;
    }

    finishClosingGalleryLightbox();
  }

  function handleKeydown(event) {
    if (!isGalleryLightboxOpen()) {
      return false;
    }

    if (event.key === "Escape") {
      if (isGalleryLightboxFullscreen()) {
        event.preventDefault();
        exitGalleryLightboxFullscreen();
        return true;
      }

      closeGalleryLightbox();
      return true;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveGalleryLightbox(-1);
      return true;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveGalleryLightbox(1);
      return true;
    }

    return false;
  }

  function init() {
    galleryLightbox = document.getElementById("galleryLightbox");
    galleryLightboxDialog = document.getElementById("galleryLightboxDialog");
    galleryLightboxLabel = document.getElementById("galleryLightboxLabel");
    galleryLightboxCount = document.getElementById("galleryLightboxCount");
    galleryLightboxImage = document.getElementById("galleryLightboxImage");
    galleryLightboxPrev = document.getElementById("galleryLightboxPrev");
    galleryLightboxNext = document.getElementById("galleryLightboxNext");
    galleryLightboxClose = document.getElementById("galleryLightboxClose");
    galleryLightboxFullscreenToggle = document.getElementById(
      "galleryLightboxFullscreen",
    );
    const galleryLightboxStage = galleryLightboxDialog
      ? galleryLightboxDialog.querySelector(".gallery-lightbox-stage")
      : null;

    if (!galleryLightbox || !galleryLightboxImage) {
      return;
    }

    if (galleryLightboxFullscreenToggle) {
      galleryLightboxFullscreenToggle.hidden = false;
    }

    galleryCollections = Array.from(
      document.querySelectorAll(".gallery-collection"),
    )
      .map(function (section, collectionIndex) {
        const title = section.querySelector(".gallery-collection-heading h2");
        const label = title ? title.textContent.trim() : "Gallery";
        const figures = Array.from(section.querySelectorAll(".gallery-photo"));

        const items = figures
          .map(function (figure, imageIndex) {
            const image = figure.querySelector("img");
            if (!image) {
              return null;
            }

            const fallbackAlt = `${label} image ${imageIndex + 1}`;
            figure.setAttribute("role", "button");
            figure.setAttribute("tabindex", "0");
            figure.setAttribute("aria-label", `Open ${fallbackAlt}`);

            figure.addEventListener("click", function () {
              openGalleryLightbox(collectionIndex, imageIndex, figure);
            });

            figure.addEventListener("keydown", function (event) {
              if (event.key !== "Enter" && event.key !== " ") {
                return;
              }

              event.preventDefault();
              openGalleryLightbox(collectionIndex, imageIndex, figure);
            });

            return {
              src: image.currentSrc || image.getAttribute("src") || "",
              alt: image.alt || fallbackAlt,
            };
          })
          .filter(Boolean);

        return items.length > 0 ? { label, items } : null;
      })
      .filter(Boolean);

    if (galleryLightboxClose) {
      galleryLightboxClose.addEventListener(
        "click",
        handleGalleryLightboxCloseButtonClick,
      );
    }

    if (galleryLightboxFullscreenToggle) {
      galleryLightboxFullscreenToggle.addEventListener("click", function () {
        requestGalleryLightboxFullscreen();
      });
    }

    if (galleryLightboxPrev) {
      galleryLightboxPrev.addEventListener("click", function () {
        moveGalleryLightbox(-1);
      });
    }

    if (galleryLightboxNext) {
      galleryLightboxNext.addEventListener("click", function () {
        moveGalleryLightbox(1);
      });
    }

    if (galleryLightboxStage && bindSwipeNavigation) {
      bindSwipeNavigation(galleryLightboxStage, {
        canStart: function () {
          const activeCollection =
            galleryCollections[activeGalleryCollectionIndex];
          return Boolean(
            isGalleryLightboxOpen() &&
            activeCollection &&
            activeCollection.items.length > 1,
          );
        },
        ignoreSelector: "button, a",
        onSwipe: moveGalleryLightbox,
      });
    }

    galleryLightbox.addEventListener("click", function (event) {
      if (event.target === galleryLightbox) {
        closeGalleryLightbox();
      }
    });

    document.addEventListener(
      "fullscreenchange",
      syncGalleryLightboxFullscreenState,
    );
    document.addEventListener(
      "webkitfullscreenchange",
      syncGalleryLightboxFullscreenState,
    );
    document.addEventListener(
      "MSFullscreenChange",
      syncGalleryLightboxFullscreenState,
    );
  }

  features.gallery = {
    handleKeydown,
    init,
  };
})();
