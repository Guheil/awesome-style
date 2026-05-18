(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  function initRoomGalleries() {
    const galleries = Array.from(document.querySelectorAll("[data-room-gallery]"));

    galleries.forEach(function (gallery) {
      const track = gallery.querySelector("[data-room-gallery-track]");
      let slides = Array.from(gallery.querySelectorAll("[data-room-gallery-slide]"));
      const prevButton = gallery.querySelector("[data-room-gallery-prev]");
      const nextButton = gallery.querySelector("[data-room-gallery-next]");
      let dots = Array.from(gallery.querySelectorAll("[data-room-gallery-dot]"));
      const count = gallery.querySelector("[data-room-gallery-count]");
      let activeIndex = 0;

      if (!track || slides.length === 0) {
        return;
      }

      function renderGallery() {
        if (slides.length === 0) {
          gallery.classList.add("is-empty");
          return;
        }

        gallery.classList.toggle("is-static", slides.length <= 1);
        activeIndex = Math.min(activeIndex, slides.length - 1);
        track.style.transform = `translateX(-${activeIndex * 100}%)`;

        slides.forEach(function (slide, index) {
          slide.classList.toggle("is-active", index === activeIndex);
        });

        dots.forEach(function (dot, index) {
          const isCurrent = index === activeIndex;
          dot.classList.toggle("is-current", isCurrent);
          dot.setAttribute("aria-pressed", String(isCurrent));
        });

        if (count) {
          count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
      }

      function moveGallery(delta) {
        activeIndex = (activeIndex + delta + slides.length) % slides.length;
        renderGallery();
      }

      function removeBrokenSlide(slide) {
        const index = slides.indexOf(slide);

        if (index === -1) {
          return;
        }

        const dot = dots[index];

        slide.remove();

        if (dot) {
          dot.remove();
        }

        slides = slides.filter(function (currentSlide) {
          return currentSlide !== slide;
        });
        dots = Array.from(gallery.querySelectorAll("[data-room-gallery-dot]"));
        activeIndex = Math.max(0, Math.min(activeIndex, slides.length - 1));
        renderGallery();
      }

      slides.forEach(function (slide) {
        const image = slide.querySelector("img");

        if (!image) {
          return;
        }

        image.addEventListener("error", function () {
          removeBrokenSlide(slide);
        });

        if (image.complete && image.naturalWidth === 0) {
          removeBrokenSlide(slide);
        }
      });

      if (prevButton) {
        prevButton.addEventListener("click", function () {
          moveGallery(-1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", function () {
          moveGallery(1);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          activeIndex = index;
          renderGallery();
        });
      });

      renderGallery();
    });
  }

  function init() {
    initRoomGalleries();

    const form = document.getElementById("roomsGuestForm");
    const input = document.getElementById("roomsGuestInput");
    const roomCards = Array.from(document.querySelectorAll("[data-room-card]"));
    const pageButtons = Array.from(
      document.querySelectorAll("[data-room-page]"),
    );
    const decrementButton = document.querySelector("[data-room-guests-dec]");
    const incrementButton = document.querySelector("[data-room-guests-inc]");
    const prevButton = document.querySelector("[data-room-page-prev]");
    const nextButton = document.querySelector("[data-room-page-next]");
    const featuredPageRoomCount = 4;
    const followingPageRoomCount = 4;
    let activePage = 0;
    let requestedGuests = null;

    if (!form || !input || roomCards.length === 0) {
      return;
    }

    function getMatchingRooms() {
      return roomCards.filter(function (card) {
        const capacity = Number.parseInt(card.dataset.guests || "0", 10);
        return !Number.isFinite(requestedGuests) || capacity >= requestedGuests;
      });
    }

    function adjustRoomGuestInput(delta) {
      const currentGuests = Number.parseInt(input.value, 10);
      const nextGuests = Math.max(
        0,
        Math.min(
          12,
          (Number.isFinite(currentGuests) ? currentGuests : 0) + delta,
        ),
      );

      input.value = nextGuests > 0 ? String(nextGuests) : "";
    }

    function renderRooms() {
      const matchingRooms = getMatchingRooms();
      const totalPages = Math.max(
        1,
        matchingRooms.length <= featuredPageRoomCount
          ? 1
          : 1 +
              Math.ceil(
                (matchingRooms.length - featuredPageRoomCount) /
                  followingPageRoomCount,
              ),
      );

      activePage = Math.min(activePage, totalPages - 1);
      const pageStart =
        activePage === 0
          ? 0
          : featuredPageRoomCount + (activePage - 1) * followingPageRoomCount;
      const pageEnd =
        activePage === 0
          ? featuredPageRoomCount
          : pageStart + followingPageRoomCount;

      roomCards.forEach(function (card) {
        const matchingIndex = matchingRooms.indexOf(card);
        card.hidden =
          matchingIndex === -1 ||
          matchingIndex < pageStart ||
          matchingIndex >= pageEnd;
      });

      pageButtons.forEach(function (button) {
        const buttonPage = Number.parseInt(button.dataset.roomPage || "0", 10);
        const isCurrent = buttonPage === activePage;
        button.hidden = buttonPage >= totalPages;
        button.disabled = buttonPage >= totalPages;
        button.classList.toggle("is-current", isCurrent);

        if (isCurrent) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      if (prevButton) {
        prevButton.disabled = activePage === 0;
      }
      if (nextButton) {
        nextButton.disabled = activePage >= totalPages - 1;
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const nextGuests = Number.parseInt(input.value, 10);
      requestedGuests =
        Number.isFinite(nextGuests) && nextGuests > 0 ? nextGuests : null;
      activePage = 0;
      renderRooms();
    });

    pageButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activePage = Number.parseInt(button.dataset.roomPage || "0", 10);
        renderRooms();
      });
    });

    if (decrementButton) {
      decrementButton.addEventListener("click", function () {
        adjustRoomGuestInput(-1);
      });
    }

    if (incrementButton) {
      incrementButton.addEventListener("click", function () {
        adjustRoomGuestInput(1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        activePage = Math.max(0, activePage - 1);
        renderRooms();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        activePage += 1;
        renderRooms();
      });
    }

    renderRooms();
  }

  features.rooms = {
    init,
  };
})();
