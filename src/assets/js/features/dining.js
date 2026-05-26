(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const catalogs = (app.data && app.data.catalogs) || {};
  const allVenueMenus = catalogs.allVenueMenus || {};
  const diningVenueData = catalogs.diningVenueData || {};
  const venueMenuLabels = catalogs.VENUE_MENU_LABELS || {};

  let diningVenueTabs = [];
  let diningVenueImage;
  let diningVenueVideo;
  let diningVenueVideoSource;
  let diningVenueTitle;
  let diningVenueCuisine;
  let diningVenueDescription;
  let diningVenueHours;
  let activeMenuVenueKey = "restaurant";

  function renderVenueSwitch() {
    const container = document.getElementById("venueMenuSwitch");
    if (!container) {
      return;
    }

    container.innerHTML = Object.keys(allVenueMenus)
      .map(function (key) {
        const isActive = key === activeMenuVenueKey;
        return (
          '<button class="dining-menu-venue-btn' +
          (isActive ? " is-active" : "") +
          '" onclick="setMenuVenue(\'' +
          key +
          "')\">" +
          (venueMenuLabels[key] || key) +
          "</button>"
        );
      })
      .join("");
  }

  function setMenuVenue(key) {
    if (!allVenueMenus[key]) {
      return;
    }

    renderVenueMenuTabs(key);
    setMenuCategory(allVenueMenus[key].defaultCategory);
  }

  function renderVenueMenuTabs(venueKey) {
    activeMenuVenueKey = venueKey;
    const venueMenu = allVenueMenus[venueKey];
    if (!venueMenu) {
      return;
    }

    const tabsContainer = document.getElementById("venueMenuTabs");
    if (!tabsContainer) {
      return;
    }

    const categoryKeys = Object.keys(venueMenu.categories);
    tabsContainer.innerHTML = categoryKeys
      .map(function (catKey, index) {
        return (
          '<button class="dining-menu-tab' +
          (index === 0 ? " is-active" : "") +
          '" data-category="' +
          catKey +
          '" role="tab" aria-selected="' +
          (index === 0 ? "true" : "false") +
          '" onclick="setMenuCategory(\'' +
          catKey +
          "')\">" +
          venueMenu.categories[catKey].label +
          "</button>"
        );
      })
      .join("");

    const viewAllLink = document.getElementById("venueMenuViewAll");
    if (viewAllLink) {
      viewAllLink.href = venueMenu.viewAllUrl;
    }

    renderVenueSwitch();
  }

  function setMenuCategory(key) {
    const tabs = document.querySelectorAll(".dining-menu-tab");
    tabs.forEach(function (tab) {
      const isActive = tab.dataset.category === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    const grid = document.getElementById("diningMenuGrid");
    if (!grid) {
      return;
    }

    const venueMenu = allVenueMenus[activeMenuVenueKey];
    if (!venueMenu) {
      return;
    }

    const data = venueMenu.categories[key];
    if (!data) {
      return;
    }

    const icon = venueMenu.icon;
    const newHtml = data.items
      .map(function (item) {
        const priceHtml = item.price
          ? '<span class="dining-menu-price">' + item.price + "</span>"
          : "";
        const descHtml = item.desc
          ? '<p class="dining-menu-desc">' + item.desc + "</p>"
          : "";

        return (
          '<div class="dining-menu-item">' +
          '<div class="dining-menu-icon">' +
          icon +
          "</div>" +
          '<div class="dining-menu-info">' +
          '<div class="dining-menu-name">' +
          '<span class="dining-menu-dish">' +
          item.name +
          "</span>" +
          priceHtml +
          "</div>" +
          descHtml +
          "</div></div>"
        );
      })
      .join("");

    grid.classList.add("is-fading");
    clearTimeout(grid._fadeTimer);
    grid._fadeTimer = setTimeout(function () {
      grid.innerHTML = newHtml;
      grid.classList.remove("is-fading");
    }, 210);
  }

  function getDiningVenueFromHash() {
    const hash = window.location.hash ? window.location.hash.slice(1) : "";
    return hash && diningVenueData[hash] ? hash : "";
  }

  function shouldSkipMotionMedia() {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    const saveData = Boolean(connection && connection.saveData);
    const reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return saveData || reducedMotion;
  }

  function setDiningVenueVideo(venue) {
    if (!diningVenueVideo || !diningVenueVideoSource) {
      return;
    }

    diningVenueVideo.pause();
    diningVenueVideo.poster = venue.image || "";
    diningVenueVideo.muted = true;
    diningVenueVideo.defaultMuted = true;
    diningVenueVideo.loop = true;
    diningVenueVideo.playsInline = true;
    diningVenueVideo.setAttribute("muted", "");
    diningVenueVideo.setAttribute("loop", "");
    diningVenueVideo.setAttribute("playsinline", "");
    diningVenueVideo.dataset.reelLoaded = "false";

    diningVenueVideoSource.removeAttribute("src");
    delete diningVenueVideoSource.dataset.src;
    delete diningVenueVideoSource.dataset.type;
    diningVenueVideoSource.removeAttribute("type");

    if (!venue.video) {
      diningVenueVideo.load();
      return;
    }

    diningVenueVideoSource.dataset.src = venue.video;

    if (venue.videoType) {
      diningVenueVideoSource.dataset.type = venue.videoType;
      diningVenueVideoSource.type = venue.videoType;
    } else {
      diningVenueVideoSource.removeAttribute("type");
    }

    // Keep the real src unset so the shared media lazy-loader controls fetch timing.
    diningVenueVideo.load();

    if (shouldSkipMotionMedia()) {
      return;
    }

    const media = app.features && app.features.media;
    if (media && typeof media.syncReelVideo === "function") {
      window.requestAnimationFrame(function () {
        media.syncReelVideo(diningVenueVideo);
      });
    }
  }

  function setDiningVenue(key) {
    const venue = diningVenueData[key];
    if (!venue) {
      return;
    }

    diningVenueTabs.forEach(function (tab) {
      const isActive = tab.dataset.venue === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    if (diningVenueImage) {
      diningVenueImage.src = venue.image;
      diningVenueImage.alt = venue.alt;
    }

    setDiningVenueVideo(venue);

    if (diningVenueTitle) {
      diningVenueTitle.textContent = venue.title;
    }

    if (diningVenueCuisine) {
      diningVenueCuisine.textContent = venue.cuisine;
    }

    if (diningVenueDescription) {
      diningVenueDescription.innerHTML = "";
      const paragraph = document.createElement("p");
      paragraph.textContent = venue.description;
      diningVenueDescription.appendChild(paragraph);
    }

    if (diningVenueHours) {
      diningVenueHours.innerHTML = "";
      venue.hours.forEach(function (line) {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        diningVenueHours.appendChild(paragraph);
      });
    }

    const menuSection = document.getElementById("venueMenuSection");
    if (menuSection) {
      const hasMenu = Boolean(allVenueMenus[key]);
      menuSection.classList.toggle("is-visible", hasMenu);
      if (hasMenu) {
        renderVenueMenuTabs(key);
        setMenuCategory(allVenueMenus[key].defaultCategory);
      }
    }
  }

  function init() {
    diningVenueTabs = Array.from(
      document.querySelectorAll(".dining-venue-tab"),
    );
    diningVenueImage = document.getElementById("diningVenueImage");
    diningVenueVideo = document.getElementById("diningVenueVideo");
    diningVenueVideoSource = diningVenueVideo
      ? diningVenueVideo.querySelector("source")
      : null;
    diningVenueTitle = document.getElementById("diningVenueTitle");
    diningVenueCuisine = document.getElementById("diningVenueCuisine");
    diningVenueDescription = document.getElementById("diningVenueDescription");
    diningVenueHours = document.getElementById("diningVenueHours");

    setDiningVenue(getDiningVenueFromHash() || "restaurant");
  }

  features.dining = {
    getDiningVenueFromHash,
    init,
    setDiningVenue,
    setMenuCategory,
    setMenuVenue,
  };
})();
