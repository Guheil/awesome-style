(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  function init() {
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
    const followingPageRoomCount = 6;
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
