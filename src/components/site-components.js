(function () {
  function defineSection(name, template) {
    if (customElements.get(name)) {
      return;
    }

    class SectionComponent extends HTMLElement {
      connectedCallback() {
        this.innerHTML = template.trim();
      }
    }

    customElements.define(name, SectionComponent);
  }

  function getCurrentClass(page, target) {
    return page === target ? " is-current" : "";
  }

  function getAriaCurrent(page, target) {
    return page === target ? ' aria-current="page"' : "";
  }

  const pageSlugs = {
    home: "home",
    about: "about",
    events: "events",
    teamBuilding: "team-building",
    dayTourPackages: "day-tour-packages",
    rooms: "rooms",
    dining: "dining",
    restaurant: "restaurant",
    cafe: "cafe",
    bar: "bar",
    breakfast: "breakfast",
    spa: "spa",
    services: "services",
    gallery: "gallery",
    contact: "contact",
  };

  function getPagesRootPrefix() {
    const pathname = window.location.pathname.replace(/\\/g, "/");
    const pagesMarker = "/src/pages/";
    const markerIndex = pathname.indexOf(pagesMarker);
    const pagePath =
      markerIndex >= 0
        ? pathname.slice(markerIndex + pagesMarker.length)
        : pathname.replace(/^\/+/, "");
    const parts = pagePath.split("/").filter(Boolean);

    if (parts.length > 0 && parts[parts.length - 1].includes(".")) {
      parts.pop();
    }

    return parts.length > 0 ? "../".repeat(parts.length) : "./";
  }

  function pageHref(page, hash = "") {
    const prefix = getPagesRootPrefix();
    const slug = pageSlugs[page] || page;

    return `${prefix}${slug}/${hash}`;
  }

  function assetHref(path) {
    const prefix = `${getPagesRootPrefix()}../assets/`;

    return `${prefix}${path}`;
  }

  function renderNavbar(page = "home") {
    return `
      <nav aria-label="Primary navigation">
        <div class="logo-wrap">
          <a href="${pageHref("home")}" aria-label="Awesome Hotel home">
            <img src="${assetHref("images/logo.png")}" alt="Awesome Hotel" class="logo-img" />
          </a>
        </div>

        <ul class="nav-links">
          <li class="nav-item">
            <a class="nav-link${getCurrentClass(page, "home")}" href="${pageHref("home")}"${getAriaCurrent(page, "home")}>Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link${getCurrentClass(page, "about")}" href="${pageHref("about")}"${getAriaCurrent(page, "about")}>About Us</a>
          </li>
          <li class="nav-item nav-item--has-menu">
            <a class="nav-link nav-link--button${getCurrentClass(page, "events")}" href="${pageHref("events")}" aria-haspopup="true" aria-expanded="false"${getAriaCurrent(page, "events")}>
              Events
              <span class="nav-caret" aria-hidden="true"></span>
            </a>
            <div class="nav-dropdown" role="menu" aria-label="Events submenu">
              <a class="nav-dropdown-link" href="${pageHref("teamBuilding")}">Team Building</a>
              <a class="nav-dropdown-link" href="${pageHref("dayTourPackages")}">Day Tour Packages</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link${getCurrentClass(page, "rooms")}" href="${pageHref("rooms")}"${getAriaCurrent(page, "rooms")}>Rooms</a>
          </li>
          <li class="nav-item nav-item--has-menu">
            <a class="nav-link nav-link--button${getCurrentClass(page, "dining")}" href="${pageHref("dining")}" aria-haspopup="true" aria-expanded="false"${getAriaCurrent(page, "dining")}>
              Dining
              <span class="nav-caret" aria-hidden="true"></span>
            </a>
            <div class="nav-dropdown" role="menu" aria-label="Dining submenu">
              <a class="nav-dropdown-link" href="${pageHref("restaurant")}">Restaurant</a>
              <a class="nav-dropdown-link" href="${pageHref("cafe")}">Lobby Cafe</a>
              <a class="nav-dropdown-link" href="${pageHref("bar")}">Sports Bar</a>
              <a class="nav-dropdown-link" href="${pageHref("breakfast")}">Breakfast Buffet</a>
            </div>
          </li>
          <li class="nav-item nav-item--has-menu">
            <button class="nav-link nav-link--button${getCurrentClass(page, "amenities")}" type="button" aria-haspopup="true" aria-expanded="false">
              Amenities
              <span class="nav-caret" aria-hidden="true"></span>
            </button>
            <div class="nav-dropdown" role="menu" aria-label="Amenities submenu">
              <a class="nav-dropdown-link" href="${pageHref("spa")}">Massage and Spa</a>
              <a class="nav-dropdown-link" href="${pageHref("services")}">Services</a>
              <a class="nav-dropdown-link" href="${pageHref("gallery")}">Gallery</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Blogs</a>
          </li>
          <li class="nav-item">
            <a class="nav-link${getCurrentClass(page, "contact")}" href="${pageHref("contact")}"${getAriaCurrent(page, "contact")}>Contact Us</a>
          </li>
        </ul>

        <button class="btn-nav-book" onclick="handleBook()">Book Now</button>
        <button
          class="burger-btn"
          id="burgerBtn"
          aria-label="Open menu"
          aria-expanded="false"
        >
          <span class="burger-line"></span>
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </button>
      </nav>

      <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
        <div class="mobile-menu-header">
          <a href="${pageHref("home")}" aria-label="Awesome Hotel home">
            <img src="${assetHref("images/logo.png")}" alt="Awesome Hotel" class="logo-img" />
          </a>
          <button
            class="mobile-menu-close"
            id="mobileMenuClose"
            aria-label="Close menu"
          ></button>
        </div>
        <div class="mobile-menu-body">
          <ul class="mobile-menu-links">
            <li>
              <a href="${pageHref("home")}" class="${page === "home" ? "is-current" : ""}"${getAriaCurrent(page, "home")} onclick="closeMobileMenu()">Home</a>
            </li>
            <li>
              <a href="${pageHref("about")}" class="${page === "about" ? "is-current" : ""}"${getAriaCurrent(page, "about")} onclick="closeMobileMenu()">About Us</a>
            </li>
            <li class="mobile-menu-group">
              <a href="${pageHref("events")}" class="mobile-menu-group-title${page === "events" ? " is-current" : ""}"${getAriaCurrent(page, "events")} onclick="closeMobileMenu()">Events</a>
              <div class="mobile-menu-submenu">
                <a href="${pageHref("teamBuilding")}" onclick="closeMobileMenu()">Team Building</a>
                <a href="${pageHref("dayTourPackages")}" onclick="closeMobileMenu()">Day Tour Packages</a>
              </div>
            </li>
            <li>
              <a href="${pageHref("rooms")}" class="${page === "rooms" ? "is-current" : ""}"${getAriaCurrent(page, "rooms")} onclick="closeMobileMenu()">Rooms</a>
            </li>
            <li class="mobile-menu-group">
              <span class="mobile-menu-group-title">Dining</span>
              <div class="mobile-menu-submenu">
                <a href="${pageHref("dining")}" onclick="closeMobileMenu()">Dining Overview</a>
                <a href="${pageHref("restaurant")}" onclick="closeMobileMenu()">Restaurant</a>
                <a href="${pageHref("cafe")}" onclick="closeMobileMenu()">Lobby Cafe</a>
                <a href="${pageHref("bar")}" onclick="closeMobileMenu()">Sports Bar</a>
                <a href="${pageHref("breakfast")}" onclick="closeMobileMenu()">Breakfast Buffet</a>
              </div>
            </li>
            <li class="mobile-menu-group">
              <span class="mobile-menu-group-title${page === "amenities" ? " is-current" : ""}">Amenities</span>
              <div class="mobile-menu-submenu">
                <a href="${pageHref("spa")}" onclick="closeMobileMenu()">Massage and Spa</a>
                <a href="${pageHref("services")}" onclick="closeMobileMenu()">Services</a>
                <a href="${pageHref("gallery")}" onclick="closeMobileMenu()">Gallery</a>
              </div>
            </li>
            <li>
              <a href="#" onclick="closeMobileMenu()">Blogs</a>
            </li>
            <li>
              <a href="${pageHref("contact")}" class="${page === "contact" ? "is-current" : ""}"${getAriaCurrent(page, "contact")} onclick="closeMobileMenu()">Contact Us</a>
            </li>
          </ul>
          <button class="mobile-menu-book" onclick="handleBook(); closeMobileMenu();">
            Book Now
          </button>
          <p class="mobile-menu-kicker">Luxury Beachfront Hotel</p>
        </div>
      </div>
    `;
  }

  if (!customElements.get("site-navbar")) {
    class SiteNavbar extends HTMLElement {
      connectedCallback() {
        const page = this.getAttribute("data-page") || "home";
        this.innerHTML = renderNavbar(page).trim();
      }
    }

    customElements.define("site-navbar", SiteNavbar);
  }

  defineSection(
    "site-hero",
    `
      <section class="hero">
        <div class="video-bg" aria-hidden="true">
          <video class="hero-video" autoplay muted loop playsinline preload="auto">
            <source src="${assetHref("vid/Hero_awesome_HD.webm")}" type="video/webm" />
          </video>
        </div>

        <div class="booking-wrap">
          <div class="booking-bar" id="bookingBar">
            <div class="booking-intro">
              <span class="booking-kicker">Signature Stay</span>
              <p class="booking-title">Reserve Your Coastal Escape</p>
              <p class="booking-copy">
                Preferred suite rates, warm breakfast service, and a quieter
                arrival experience.
              </p>
            </div>

            <div
              class="booking-field"
              id="checkInField"
              onclick="openDateModal('checkin', event)"
            >
              <span class="field-label">Check In</span>
              <span class="field-value" id="checkInDate">03 Mar 2026</span>
              <span class="field-value-sub">Saturday</span>
              <span class="booking-field-icon">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
            </div>

            <div
              class="booking-field"
              id="checkOutField"
              onclick="openDateModal('checkout', event)"
            >
              <span class="field-label">Check Out</span>
              <span class="field-value" id="checkOutDate">06 Mar 2026</span>
              <span class="field-value-sub">Tuesday · 3 nights</span>
              <span class="booking-field-icon">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
            </div>

            <div class="booking-field booking-field--guests">
              <span class="field-label">Guests</span>
              <div class="guest-counter">
                <button
                  class="counter-btn"
                  onclick="adjustGuests(-1)"
                  aria-label="Decrease guests"
                >
                  -
                </button>
                <div>
                  <div class="counter-num" id="guestCount">2</div>
                </div>
                <button
                  class="counter-btn"
                  onclick="adjustGuests(1)"
                  aria-label="Increase guests"
                >
                  +
                </button>
                <span class="counter-label">Adults</span>
              </div>
            </div>

            <button class="btn-book-cta" onclick="handleBook()">
              <span class="btn-book-label">Check Availability</span>
              <span class="btn-book-sublabel">Instant Confirmation</span>
            </button>
          </div>

          <div class="date-popup-shell" id="dateModalOverlay">
            <div
              class="date-modal"
              id="dateModal"
              role="dialog"
              aria-modal="false"
              aria-labelledby="modalTitle"
            >
              <p class="modal-title" id="modalTitle">Select Check-In Date</p>
              <p class="modal-sub">Choose your arrival date</p>

              <div class="calendar-grid">
                <div>
                  <p class="calendar-month-title" id="cal1Title">March 2026</p>
                  <div class="cal-days-header">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div class="cal-days" id="cal1"></div>
                </div>
                <div>
                  <p class="calendar-month-title" id="cal2Title">April 2026</p>
                  <div class="cal-days-header">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div class="cal-days" id="cal2"></div>
                </div>
              </div>

              <div class="modal-actions">
                <button class="btn-modal-cancel" onclick="closeDateModal()">
                  Cancel
                </button>
                <button class="btn-modal-confirm" onclick="confirmDate()">
                  Confirm Date
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="date-backdrop" id="dateBgBackdrop" onclick="closeDateModal()"></div>
    `,
  );

  defineSection(
    "site-resort-carousel",
    `
      <section class="resort-carousel" id="rooms">
        <div class="resort-carousel-inner">
          <div class="resort-carousel-copy">
            <h2 class="resort-carousel-title">
              Sunset, sand, pool and seaside luxury getaway in La Union
            </h2>

            <div class="resort-carousel-body">
              <p>
                Your ultimate retreat in San Juan, La Union! Our luxury beach
                resort with pool offers the perfect blend of relaxation and
                recreation for romantic getaways, family vacations, corporate
                accommodations, or solo retreats.
              </p>

              <p>
                Families will find ample space and comfort in our
                <span>Premier Family</span> rooms designed to accommodate up to 6
                adults with ease. For a truly luxurious experience, our
                <span>Premier Suite</span> offers a spacious living area,
                kitchenette, private balcony, and 6-seater dining area to make
                your stay truly special.
              </p>

              <p>
                Beyond the beach, Awesome Hotel offers a range of top-rated
                experiences to enhance your stay. Rejuvenate your senses at our
                tranquil resort spa, embark on an exciting day tour to explore
                the waterfront beauty of La Union, or plan a memorable event in
                our versatile function spaces.
              </p>

              <p>
                Book a stay now to immerse in one of the best beachfront blends
                of elegance and natural beauty.
              </p>

              <a href="${pageHref("rooms")}" class="resort-carousel-cta">Explore Rooms</a>
            </div>
          </div>

          <div class="resort-carousel-stage">
            <div class="resort-carousel-track" id="resortCarouselTrack">
              <article class="resort-carousel-slide">
                <div class="resort-carousel-media">
                  <img
                    src="https://awesomehotel.com/wp-content/uploads/2023/10/Bigger-Photo.jpg"
                    alt="Luxury resort carousel image"
                  />
                </div>
              </article>
              <article class="resort-carousel-slide">
                <div class="resort-carousel-media">
                  <img
                    src="https://awesomehotel.com/wp-content/uploads/2023/08/pool-beach.jpg"
                    alt="Luxury resort carousel image"
                    loading="lazy"
                  />
                </div>
              </article>
              <article class="resort-carousel-slide">
                <div class="resort-carousel-media">
                  <img
                    src="https://awesomehotel.com/wp-content/uploads/2023/09/PS-Bedroom.jpg"
                    alt="Luxury resort carousel image"
                    loading="lazy"
                  />
                </div>
              </article>
            </div>

            <div class="resort-carousel-controls">
              <button
                class="resort-carousel-arrow"
                type="button"
                aria-label="Previous slide"
                onclick="moveResortCarousel(-1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                class="resort-carousel-arrow"
                type="button"
                aria-label="Next slide"
                onclick="moveResortCarousel(1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div class="resort-carousel-meta">
              <div class="resort-carousel-dots">
                <button class="resort-carousel-dot is-active" type="button" aria-label="Go to slide 1" data-resort-dot="0" onclick="goToResortSlide(0)"></button>
                <button class="resort-carousel-dot" type="button" aria-label="Go to slide 2" data-resort-dot="1" onclick="goToResortSlide(1)"></button>
                <button class="resort-carousel-dot" type="button" aria-label="Go to slide 3" data-resort-dot="2" onclick="goToResortSlide(2)"></button>
              </div>
              <div class="resort-carousel-index" id="resortCarouselIndex">01 / 03</div>
            </div>
          </div>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-amenities",
    `
      <section class="amenities-showcase" id="amenities" aria-labelledby="amenitiesTitle">
        <div class="amenities-inner">
          <h2 class="amenities-heading" id="amenitiesTitle">
            Our Amenities and Facilities
          </h2>

          <div class="amenities-shell">
            <div class="amenities-viewport">
              <div class="amenities-track" id="amenitiesTrack">
                <article class="amenity-slide">
                  <div class="amenity-media">
                    <img src="https://awesomehotel.com/wp-content/uploads/2023/10/convent-serv.jpg" alt="Convention center" />
                  </div>
                  <div class="amenity-content">
                    <span class="amenity-number">01</span>
                    <h3 class="amenity-title">Convention Center</h3>
                    <p class="amenity-text">
                      Create lasting memories with our spacious 200-seater
                      convention center perfect for weddings, conferences,
                      seminars, or other special events just meters away from the
                      beach.
                    </p>
                    <a href="${pageHref("services")}" class="amenities-cta">Explore Services</a>
                  </div>
                </article>

                <article class="amenity-slide">
                  <div class="amenity-media">
                    <img src="https://awesomehotel.com/wp-content/uploads/2025/08/tour-packages.jpg" alt="Kayak rental" loading="lazy" />
                  </div>
                  <div class="amenity-content">
                    <span class="amenity-number">02</span>
                    <h3 class="amenity-title">Kayak Rental</h3>
                    <p class="amenity-text">
                      Paddle and explore the coastline of San Juan, La Union with
                      kayak rental either solo or with a tandem.
                    </p>
                    <a href="${pageHref("services")}" class="amenities-cta">Explore Services</a>
                  </div>
                </article>

                <article class="amenity-slide">
                  <div class="amenity-media">
                    <img src="https://awesomehotel.com/wp-content/uploads/2023/08/pool-beach.jpg" alt="Beach volleyball" loading="lazy" />
                  </div>
                  <div class="amenity-content">
                    <span class="amenity-number">03</span>
                    <h3 class="amenity-title">Beach Volleyball</h3>
                    <p class="amenity-text">
                      Experience the thrill of beach volleyball with soft sand and
                      stunning ocean views.
                    </p>
                    <a href="${pageHref("services")}" class="amenities-cta">Explore Services</a>
                  </div>
                </article>

                <article class="amenity-slide">
                  <div class="amenity-media">
                    <img src="https://awesomehotel.com/wp-content/uploads/2023/10/hotel-spa-treatment-illustration-ai-generativexa_118124-27025.jpg" alt="In-room massage" loading="lazy" />
                  </div>
                  <div class="amenity-content">
                    <span class="amenity-number">04</span>
                    <h3 class="amenity-title">In-Room Massage</h3>
                    <p class="amenity-text">
                      Relax and rejuvenate with in-room massage services from our
                      experienced massage therapists.
                    </p>
                    <a href="${pageHref("services")}" class="amenities-cta">Explore Services</a>
                  </div>
                </article>
              </div>
            </div>

            <div class="amenities-controls">
              <button class="amenities-arrow" type="button" aria-label="Previous amenity" onclick="moveAmenitiesCarousel(-1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button class="amenities-arrow" type="button" aria-label="Next amenity" onclick="moveAmenitiesCarousel(1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div class="amenities-footer">
            <div class="amenities-index" id="amenitiesIndex">01 / 04</div>
            <div class="amenities-thumbs">
              <button class="amenities-thumb is-active" type="button" onclick="goToAmenitiesSlide(0)" aria-label="Show Convention Center" aria-pressed="true">
                <span class="amenities-thumb-num">01</span>
                <span class="amenities-thumb-title">Convention Center</span>
              </button>
              <button class="amenities-thumb" type="button" onclick="goToAmenitiesSlide(1)" aria-label="Show Kayak Rental" aria-pressed="false">
                <span class="amenities-thumb-num">02</span>
                <span class="amenities-thumb-title">Kayak Rental</span>
              </button>
              <button class="amenities-thumb" type="button" onclick="goToAmenitiesSlide(2)" aria-label="Show Beach Volleyball" aria-pressed="false">
                <span class="amenities-thumb-num">03</span>
                <span class="amenities-thumb-title">Beach Volleyball</span>
              </button>
              <button class="amenities-thumb" type="button" onclick="goToAmenitiesSlide(3)" aria-label="Show In-Room Massage" aria-pressed="false">
                <span class="amenities-thumb-num">04</span>
                <span class="amenities-thumb-title">In-Room Massage</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-dining",
    `
      <section class="dining-section" id="dining" aria-labelledby="diningTitle">
        <div class="dining-inner">
          <div class="dining-gallery">
            <div class="dining-viewport">
              <div class="dining-track" id="diningTrack">
                <article class="dining-slide">
                  <figure class="dining-image dining-image--wide">
                    <img src="https://awesomehotel.com/wp-content/uploads/2025/09/restaurant-new.jpg" alt="Dining selection" />
                  </figure>
                  <figure class="dining-image dining-image--tall">
                    <img src="https://awesomehotel.com/wp-content/uploads/2023/07/hotel-cocktails.jpg" alt="Signature drink" />
                  </figure>
                </article>

                <article class="dining-slide">
                  <figure class="dining-image dining-image--wide">
                    <img src="https://awesomehotel.com/wp-content/uploads/2025/09/sports-bar.jpg" alt="Poolside dining" loading="lazy" />
                  </figure>
                  <figure class="dining-image dining-image--tall">
                    <img src="https://awesomehotel.com/wp-content/uploads/2023/07/DSC05433.jpg" alt="Dessert plate" loading="lazy" />
                  </figure>
                </article>

                <article class="dining-slide">
                  <figure class="dining-image dining-image--wide">
                    <img src="https://awesomehotel.com/wp-content/uploads/2025/09/breakfast-buffet.jpg" alt="Global cuisine" loading="lazy" />
                  </figure>
                  <figure class="dining-image dining-image--tall">
                    <img src="https://awesomehotel.com/wp-content/uploads/2023/07/hotel-drinks.jpg" alt="Signature offering" loading="lazy" />
                  </figure>
                </article>
              </div>
            </div>

            <div class="dining-controls">
              <div class="dining-arrows">
                <button class="dining-arrow" type="button" aria-label="Previous dining slide" onclick="moveDiningCarousel(-1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button class="dining-arrow" type="button" aria-label="Next dining slide" onclick="moveDiningCarousel(1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div class="dining-dots">
                <button class="dining-dot is-active" type="button" aria-label="Go to dining slide 1" onclick="goToDiningSlide(0)"></button>
                <button class="dining-dot" type="button" aria-label="Go to dining slide 2" onclick="goToDiningSlide(1)"></button>
                <button class="dining-dot" type="button" aria-label="Go to dining slide 3" onclick="goToDiningSlide(2)"></button>
              </div>

              <div class="dining-index" id="diningIndex">01 / 03</div>
            </div>
          </div>

          <div class="dining-panel">
            <h2 class="dining-title" id="diningTitle">
              Gastronomic<br />
              Delight
            </h2>
            <p class="dining-subtitle">with multiple dining options</p>

            <div class="dining-copy">
              <p>
                Indulge in a culinary adventure with multiple dining options to
                choose from. No matter what your dining preference, you are sure
                to find something to your taste at our 4-star hotel in San Juan,
                La Union.
              </p>

              <p>
                Delight in global cuisine and signature offerings at our
                Breakfast Buffet, <span>Lobby Cafe</span>, Restaurant, and Sports
                Bar.
              </p>
            </div>

            <a href="#" class="dining-cta">Explore Dining</a>
          </div>
        </div>
      </section>

      <section class="dining-venues" aria-label="Dining venues">
        <div class="dining-venues-inner">
          <div class="dining-venue-tabs" role="tablist" aria-label="Dining venues">
            <button class="dining-venue-tab is-active" type="button" role="tab" aria-selected="true" data-venue="restaurant" onclick="setDiningVenue('restaurant')">
              Restaurant
            </button>
            <button class="dining-venue-tab" type="button" role="tab" aria-selected="false" data-venue="lobbyCafe" onclick="setDiningVenue('lobbyCafe')">
              Lobby Cafe
            </button>
            <button class="dining-venue-tab" type="button" role="tab" aria-selected="false" data-venue="sportsBar" onclick="setDiningVenue('sportsBar')">
              Sports Bar
            </button>
            <button class="dining-venue-tab" type="button" role="tab" aria-selected="false" data-venue="breakfastBuffet" onclick="setDiningVenue('breakfastBuffet')">
              Breakfast Buffet
            </button>
          </div>

          <div class="dining-venue-stage" role="tabpanel">
            <div class="dining-venue-media">
              <img id="diningVenueImage" src="https://awesomehotel.com/wp-content/uploads/2025/09/restaurant-new.jpg" alt="Restaurant" />
            </div>

            <article class="dining-venue-panel">
              <h2 class="dining-venue-title" id="diningVenueTitle">Restaurant</h2>

              <div class="venue-detail-row">
                <span class="venue-detail-label">Cuisine</span>
                <p class="venue-detail-value" id="diningVenueCuisine">
                  Asian Favorites, Filipino Fusion
                </p>
              </div>

              <div class="venue-detail-row">
                <span class="venue-detail-label">Description</span>
                <div class="venue-detail-copy" id="diningVenueDescription">
                  <p>
                    Experience exquisite dining at Awesome Hotel's restaurant in
                    San Juan, La Union. Indulge in breathtaking ocean views and
                    savor delectable cuisine featuring fresh, local ingredients.
                  </p>
                </div>
              </div>

              <div class="venue-detail-row">
                <span class="venue-detail-label">Operating Hours</span>
                <div class="venue-hours" id="diningVenueHours">
                  <p>Daily: Open 24/7 (Sunday - Saturday)</p>
                </div>
              </div>

              <a href="#" class="dining-venue-cta">Explore More</a>
            </article>
          </div>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-daytour",
    `
      <section class="daytour-section" id="daytour" aria-labelledby="daytourTitle">
        <div class="daytour-inner">
          <div class="daytour-gallery">
            <div class="daytour-viewport">
              <div class="daytour-track" id="daytourTrack">
                <article class="daytour-slide">
                  <img src="https://awesomehotel.com/wp-content/uploads/2025/08/tour-packages.jpg" alt="La Union coastline" />
                  <div class="daytour-caption">
                    <strong>01</strong>
                    <span>Coastline mornings and open water</span>
                  </div>
                </article>

                <article class="daytour-slide">
                  <img src="https://awesomehotel.com/wp-content/uploads/2023/09/DSCF7267.jpg" alt="Surfing in La Union" loading="lazy" />
                  <div class="daytour-caption">
                    <strong>02</strong>
                    <span>Surf culture and golden-hour walks</span>
                  </div>
                </article>

                <article class="daytour-slide">
                  <img src="https://awesomehotel.com/wp-content/uploads/2023/08/pool-beach.jpg" alt="Day tour exploration" loading="lazy" />
                  <div class="daytour-caption">
                    <strong>03</strong>
                    <span>Local stops, scenic routes, and slow afternoons</span>
                  </div>
                </article>
              </div>
            </div>

            <div class="daytour-stops">
              <button class="daytour-stop is-active" type="button" aria-pressed="true" onclick="goToDaytourSlide(0)">
                <strong>01</strong>
                <span>Coastline</span>
              </button>
              <button class="daytour-stop" type="button" aria-pressed="false" onclick="goToDaytourSlide(1)">
                <strong>02</strong>
                <span>Surfing</span>
              </button>
              <button class="daytour-stop" type="button" aria-pressed="false" onclick="goToDaytourSlide(2)">
                <strong>03</strong>
                <span>Explore</span>
              </button>
            </div>
          </div>

          <article class="daytour-card">
            <span class="daytour-kicker">La Union Day Tours</span>
            <h2 class="daytour-title" id="daytourTitle">
              Escape to San Juan&ndash; Relax, Explore, and Enjoy
            </h2>

            <div class="daytour-body">
              <p>
                La Union's beauty goes beyond the toss of sand and surf - and it
                is something that one can see, especially if you embark on La
                Union day tour packages. Most people are drawn to La Union for
                the wondrous waves and surfing. It should not be surprising,
                given that La Union has been dubbed the Surfing Capital of the
                Philippines.
              </p>

              <p>
                Fortunately, thanks to Awesome Hotel's La Union day tours, you
                now have an opportunity to learn more about what makes La Union
                truly special.
              </p>

              <p>
                If you are looking for a day filled with activities and
                exploration, look no further because of Awesome Hotel's package
                deals.
              </p>
            </div>

            <div class="daytour-actions">
              <a href="${pageHref("dayTourPackages")}" class="daytour-cta">Explore Day Tour Package</a>

              <div class="daytour-controls">
                <button class="daytour-arrow" type="button" aria-label="Previous day tour slide" onclick="moveDaytourCarousel(-1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button class="daytour-arrow" type="button" aria-label="Next day tour slide" onclick="moveDaytourCarousel(1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-events",
    `
      <section class="events-section" id="events" aria-labelledby="eventsTitle">
        <div class="events-inner">
          <h2 class="events-title" id="eventsTitle">
            Host the Unforgettable Events
          </h2>

          <div class="events-tabs" role="tablist" aria-label="Event types">
            <button class="events-tab is-active" type="button" role="tab" aria-selected="true" data-event="beachfrontWedding" onclick="setEventType('beachfrontWedding')">
              Beachfront Wedding
            </button>
            <button class="events-tab" type="button" role="tab" aria-selected="false" data-event="teamBuilding" onclick="setEventType('teamBuilding')">
              Team Building Activities
            </button>
            <button class="events-tab" type="button" role="tab" aria-selected="false" data-event="businessFunction" onclick="setEventType('businessFunction')">
              Business Function/ Event
            </button>
            <button class="events-tab" type="button" role="tab" aria-selected="false" data-event="privateEvents" onclick="setEventType('privateEvents')">
              Private Events &amp; Parties
            </button>
          </div>

          <div class="events-stage" role="tabpanel">
            <article class="events-copy">
              <h3 class="events-heading" id="eventHeading">
                Plan Unforgettable Events at Our La Union Beachfront Venue
              </h3>
              <p class="events-description" id="eventDescription">
                Whether it is a dream beach wedding, a milestone celebration,
                or a productive corporate gathering, our versatile venues and
                function rooms are available for rent to suit your specific
                needs. Book your unforgettable event today and experience the
                beauty of San Juan, La Union.
              </p>
              <div class="events-actions">
                <a href="#" class="events-cta">Plan Your Event</a>
                <a href="#" class="events-cta events-cta--outline">Make an Inquiry</a>
              </div>
            </article>

            <div class="events-media">
              <img id="eventImage" src="https://awesomehotel.com/wp-content/uploads/2025/08/Awesome-Hotel-Wedding_1.jpg" alt="Beachfront Wedding" />
            </div>
          </div>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-location",
    `
      <section class="location-section" id="location" aria-labelledby="locationTitle">
        <div class="location-inner">
          <div class="location-layout">
            <div>
              <p class="location-eyebrow">Find Us</p>
              <h2 class="location-name" id="locationTitle">Awesome Hotel</h2>
              <ul class="location-contact-list">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>319 Eagle St. Montemar Village, Ili Norte,<br />San Juan, La Union 2514, Philippines</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.8 19.8 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span>(072) 607 4648 &nbsp;·&nbsp; (072) 607 5462</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>reservations@awesomehotel.com</span>
                </li>
              </ul>
              <hr class="location-divider" />
              <p class="location-hours">
                Open every day &nbsp;·&nbsp; Check-in from 2:00 PM
              </p>
              <a href="https://www.google.com/maps/dir/?api=1&destination=16.678407713843825,120.33690274114296" target="_blank" rel="noopener" class="location-directions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M3 12l9-9 9 9" />
                  <path d="M12 3v18" />
                </svg>
                Get Directions
              </a>
            </div>

            <div class="location-map-wrap">
              <div id="locationMap" aria-label="Awesome Hotel on map"></div>
            </div>
          </div>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-reviews",
    `
      <section class="reviews-section" id="reviews" aria-labelledby="reviewsTitle">
        <div class="reviews-inner">
          <p class="reviews-eyebrow">Guest Voices</p>
          <h2 class="reviews-title" id="reviewsTitle">
            What Our Guests Are Saying
          </h2>
          <div class="reviews-stars-row" aria-label="5 out of 5 stars on Google">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 5.26L18 7.27l-4 4.1.94 5.63L10 14.27l-4.94 2.73.94-5.63-4-4.1 5.61-.01z" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 5.26L18 7.27l-4 4.1.94 5.63L10 14.27l-4.94 2.73.94-5.63-4-4.1 5.61-.01z" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 5.26L18 7.27l-4 4.1.94 5.63L10 14.27l-4.94 2.73.94-5.63-4-4.1 5.61-.01z" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 5.26L18 7.27l-4 4.1.94 5.63L10 14.27l-4.94 2.73.94-5.63-4-4.1 5.61-.01z" /></svg>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.39 5.26L18 7.27l-4 4.1.94 5.63L10 14.27l-4.94 2.73.94-5.63-4-4.1 5.61-.01z" /></svg>
            <span class="reviews-rating-label">4.8 &nbsp;·&nbsp; Google Reviews</span>
          </div>

          <div class="reviews-track-wrap">
            <div class="reviews-track" id="reviewsTrack">
              <article class="review-card">
                <div class="review-card__avatar" aria-hidden="true"></div>
                <div class="review-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote class="review-card__text">
                  &ldquo;Definitely one of the best hotels in La Union and in Luzon island, by far. True to its name, the experience you will have when you stay here will be awesome. Great and modern rooms! The restrooms are also modern.&rdquo;
                </blockquote>
                <p class="review-card__name">Matt Dailisan</p>
                <p class="review-card__source">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png" alt="" width="14" height="14" />
                  Google
                </p>
              </article>

              <article class="review-card">
                <div class="review-card__avatar" aria-hidden="true"></div>
                <div class="review-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote class="review-card__text">
                  &ldquo;They live up to their name, Awesome Hotel. We absolutely had an awesome stay! The infinity pool made our 4-year-old stay in it, infinitely. The beach is awesome as is. Rooms are spacious with a balcony overlooking the infinity pool.&rdquo;
                </blockquote>
                <p class="review-card__name">Ane Fallarme</p>
                <p class="review-card__source">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png" alt="" width="14" height="14" />
                  Google
                </p>
              </article>

              <article class="review-card">
                <div class="review-card__avatar" aria-hidden="true"></div>
                <div class="review-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote class="review-card__text">
                  &ldquo;Location is near town proper which is a plus. Never thought such hotel exists in the province. Rooms are quite spacious and clean. We got the Premium Suite for two nights with a beautiful view of the sea. Food is exceptional.&rdquo;
                </blockquote>
                <p class="review-card__name">M.B. Llarenas</p>
                <p class="review-card__source">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png" alt="" width="14" height="14" />
                  Google
                </p>
              </article>

              <article class="review-card">
                <div class="review-card__avatar" aria-hidden="true"></div>
                <div class="review-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote class="review-card__text">
                  &ldquo;Great stay with family - clean, tidy and rooms were spacious. We could hear the ocean waves from our rooms at night which was so soothing. The pool view was spectacular at sunset looking out onto the beach. Highly recommended!&rdquo;
                </blockquote>
                <p class="review-card__name">Nessa Alpha</p>
                <p class="review-card__source">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png" alt="" width="14" height="14" />
                  Google
                </p>
              </article>

              <article class="review-card">
                <div class="review-card__avatar" aria-hidden="true"></div>
                <div class="review-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <blockquote class="review-card__text">
                  &ldquo;The infinity pool is breathtaking, especially at golden hour. Staff were incredibly warm and attentive throughout our stay. The beachfront access is just steps away. We will definitely be returning for our anniversary.&rdquo;
                </blockquote>
                <p class="review-card__name">Patricia Santos</p>
                <p class="review-card__source">
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_16dp.png" alt="" width="14" height="14" />
                  Google
                </p>
              </article>
            </div>
          </div>

          <div class="reviews-controls">
            <button type="button" class="reviews-arrow reviews-arrow--prev" onclick="shiftReviews(-1)" aria-label="Previous reviews">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div class="reviews-dots" id="reviewsDots"></div>
            <button type="button" class="reviews-arrow reviews-arrow--next" onclick="shiftReviews(1)" aria-label="Next reviews">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          <a href="https://www.google.com/maps/place/Awesome+Hotel/" target="_blank" rel="noopener" class="reviews-cta">Read All Reviews on Google</a>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-stay-cta",
    `
      <section class="stay-cta-section" aria-labelledby="stayCtaTitle">
        <div class="stay-cta-inner">
          <div class="stay-cta-stage">
            <div class="stay-cta-media">
              <img src="${assetHref("images/cta-bigger-photo.jpg")}" alt="Luxury hotel courtyard with pool and balconies" />
            </div>

            <div class="stay-cta-copy">
              <h2 class="stay-cta-title" id="stayCtaTitle">
                <span>Luxury Awaits</span>
                <span>Book Your Stay Today!</span>
              </h2>
            </div>

            <div class="stay-cta-actions">
              <button type="button" class="stay-cta-book" onclick="handleBook()">
                Book Your Stay
              </button>
              <a href="${pageHref("rooms")}" class="stay-cta-explore">Explore Rooms</a>
            </div>
          </div>
        </div>
      </section>
    `,
  );

  defineSection(
    "site-footer",
    `
      <footer class="site-footer" aria-label="Awesome Hotel footer">
        <div class="site-footer__inner">
          <div class="footer-brand">
            <a href="${pageHref("home")}" class="footer-logo" aria-label="Awesome Hotel home">
              <img src="${assetHref("images/logo.png")}" alt="Awesome Hotel" class="footer-logo-image" />
            </a>
          </div>

          <div class="footer-block footer-nav" role="navigation" aria-label="Quick links">
            <h2 class="footer-heading">Quick Links</h2>
            <ul class="footer-links-list">
              <li><a href="${pageHref("rooms")}">Our Rooms</a></li>
              <li><a href="${pageHref("events")}">Events</a></li>
              <li><a href="${pageHref("home", "#dining")}">Dining</a></li>
              <li><a href="${pageHref("services")}">Services</a></li>
              <li><a href="${pageHref("gallery")}">Gallery</a></li>
            </ul>
          </div>

          <div class="footer-block">
            <h2 class="footer-heading">Contact Us</h2>
            <ul class="footer-contact-list">
              <li>
                <span class="footer-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 7.5h16v10H4v-10Z" stroke="currentColor" stroke-width="1.8" />
                    <path d="m5 8 7 5 7-5" stroke="currentColor" stroke-width="1.8" />
                  </svg>
                </span>
                <a href="mailto:reservations@awesomehotel.com">reservations@awesomehotel.com</a>
              </li>
              <li>
                <span class="footer-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8.2 5.5 10 9.4l-1.6 1.2c.9 1.9 2.4 3.4 4.3 4.3l1.2-1.6 3.9 1.8-.5 3.1c-.1.6-.6 1-1.2 1C9.9 19.2 4.8 14.1 4.8 7.9c0-.6.4-1.1 1-1.2l2.4-.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  </svg>
                </span>
                <a href="tel:+63726074648">(072) 607 4648 | (072) 607 5462</a>
              </li>
              <li>
                <span class="footer-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 3.8h8v16.4H8V3.8Z" stroke="currentColor" stroke-width="1.8" />
                    <path d="M10.5 17.2h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  </svg>
                </span>
                <a href="tel:+639175974978">+63 917 5974 978</a>
              </li>
            </ul>
          </div>

          <div class="footer-block">
            <h2 class="footer-heading">Our Newsletter</h2>
            <form class="footer-newsletter" aria-label="Newsletter signup" onsubmit="event.preventDefault()">
              <input type="email" name="email" placeholder="Enter Email" />
              <button type="submit">Send</button>
            </form>

            <div class="footer-follow">
              <h2 class="footer-heading">Follow Us</h2>
              <ul class="footer-social-list">
                <li>
                  <a href="#" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 21v-7h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.4-.1-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.8v7h3.2Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6.2 8.2a1.9 1.9 0 1 1 0-3.8 1.9 1.9 0 0 1 0 3.8ZM4.7 9.8h3v9.5h-3V9.8Zm5 0h2.9v1.3h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7v5.1h-3v-4.5c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4v4.6h-3V9.8Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.4 7.2c-.2-.8-.8-1.4-1.6-1.6C17.4 5.2 12 5.2 12 5.2s-5.4 0-6.8.4c-.8.2-1.4.8-1.6 1.6-.4 1.4-.4 4.3-.4 4.3s0 2.9.4 4.3c.2.8.8 1.4 1.6 1.6 1.4.4 6.8.4 6.8.4s5.4 0 6.8-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-4.3.4-4.3s0-2.9-.4-4.3ZM10 14.8V8.2l5.2 3.3-5.2 3.3Z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    `,
  );
})();
