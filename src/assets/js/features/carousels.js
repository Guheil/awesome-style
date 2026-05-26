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

  let teamRoomTrack;
  let teamRoomCards = [];
  let teamRoomDotsWrap;
  let teamRoomDots = [];
  let teamRoomPrevButton;
  let teamRoomNextButton;
  let teamRoomPerPage = 4;
  let activeTeamRoomPage = 0;

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

  function syncReelsAfterCarouselUpdate(root) {
    const media = app.features && app.features.media;

    if (!root || !media || typeof media.syncReelVideo !== "function") {
      return;
    }

    const videos = Array.from(root.querySelectorAll("[data-reel-video]"));
    if (videos.length === 0) {
      return;
    }

    function syncVideos() {
      videos.forEach(media.syncReelVideo);
    }

    window.requestAnimationFrame(syncVideos);
    window.setTimeout(syncVideos, 720);
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

    syncReelsAfterCarouselUpdate(diningTrack.children[activeDiningSlide]);
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

  function getTeamRoomPerPage() {
    if (window.innerWidth <= 760) {
      return 1;
    }

    if (window.innerWidth <= 1120) {
      return 2;
    }

    return 4;
  }

  function totalTeamRoomPages() {
    return Math.max(1, Math.ceil(teamRoomCards.length / teamRoomPerPage));
  }

  function renderTeamRoomDots() {
    if (!teamRoomDotsWrap) {
      return;
    }

    teamRoomDotsWrap.innerHTML = "";
    teamRoomDots = [];

    for (let index = 0; index < totalTeamRoomPages(); index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "team-page-room-carousel-dot";
      dot.setAttribute("aria-label", `Go to room card group ${index + 1}`);
      dot.addEventListener("click", function () {
        goToTeamRoomPage(index);
      });
      teamRoomDotsWrap.appendChild(dot);
      teamRoomDots.push(dot);
    }
  }

  function updateTeamRoomCarousel() {
    if (!teamRoomTrack || teamRoomCards.length === 0) {
      return;
    }

    const pageCount = totalTeamRoomPages();
    activeTeamRoomPage = Math.max(0, Math.min(activeTeamRoomPage, pageCount - 1));
    const targetIndex = activeTeamRoomPage * teamRoomPerPage;
    const targetCard = teamRoomCards[targetIndex];
    const offset = targetCard ? targetCard.offsetLeft : 0;
    teamRoomTrack.style.transform = `translateX(-${offset}px)`;

    teamRoomDots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === activeTeamRoomPage);
      dot.setAttribute("aria-pressed", String(index === activeTeamRoomPage));
    });

    if (teamRoomPrevButton) {
      teamRoomPrevButton.disabled = activeTeamRoomPage === 0;
    }

    if (teamRoomNextButton) {
      teamRoomNextButton.disabled = activeTeamRoomPage >= pageCount - 1;
    }
  }

  function goToTeamRoomPage(index) {
    activeTeamRoomPage = index;
    updateTeamRoomCarousel();
  }

  function moveTeamRoomCarousel(step) {
    goToTeamRoomPage(activeTeamRoomPage + step);
  }

  function handleTeamRoomResize() {
    const nextPerPage = getTeamRoomPerPage();

    if (nextPerPage !== teamRoomPerPage) {
      teamRoomPerPage = nextPerPage;
      activeTeamRoomPage = 0;
      renderTeamRoomDots();
    }

    updateTeamRoomCarousel();
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

    teamRoomTrack = document.getElementById("teamRoomTrack");
    teamRoomCards = teamRoomTrack
      ? Array.from(teamRoomTrack.querySelectorAll(".team-page-detail-card"))
      : [];
    teamRoomDotsWrap = document.getElementById("teamRoomDots");
    teamRoomPrevButton = document.querySelector("[data-team-room-prev]");
    teamRoomNextButton = document.querySelector("[data-team-room-next]");

    if (teamRoomTrack && teamRoomCards.length > 0) {
      teamRoomPerPage = getTeamRoomPerPage();
      renderTeamRoomDots();

      if (teamRoomPrevButton) {
        teamRoomPrevButton.addEventListener("click", function () {
          moveTeamRoomCarousel(-1);
        });
      }

      if (teamRoomNextButton) {
        teamRoomNextButton.addEventListener("click", function () {
          moveTeamRoomCarousel(1);
        });
      }

      window.addEventListener("resize", handleTeamRoomResize);
    }

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

    bindHorizontalSwipe(
      teamRoomTrack ? teamRoomTrack.parentElement : null,
      moveTeamRoomCarousel,
      function () {
        return totalTeamRoomPages() > 1;
      },
    );

    updateResortCarousel();
    updateAmenitiesCarousel();
    updateDiningCarousel();
    updateDaytourCarousel();
    updateTeamRoomCarousel();
  }

  features.carousels = {
    goToAmenitiesSlide,
    goToDaytourSlide,
    goToDiningSlide,
    goToResortSlide,
    goToTeamRoomPage,
    init,
    moveAmenitiesCarousel,
    moveDaytourCarousel,
    moveDiningCarousel,
    moveResortCarousel,
    moveTeamRoomCarousel,
  };
})();
