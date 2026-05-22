(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const BOOKING_ORIGIN = "https://live.ipms247.com";
  const BOOKING_PATH_PREFIX = "/booking/book-rooms-";
  const BOOKING_HOTEL_ID = "870650";
  const BOOKING_FORM_ID = "awesomeBookingIpmsForm";
  const BOOKING_FORM_NAME = "_resBBBox";
  const BOOKING_DATE_FORMAT = "mm-dd-yy";
  const BOOKING_LANGUAGE = "en";
  const MIN_GUESTS = 1;
  const MAX_GUESTS = 12;
  const DEFAULT_CHILDREN = 0;
  const DEFAULT_ROOMS = 1;

  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);

  const defaultCheckin = new Date(baseToday);

  const defaultCheckout = new Date(defaultCheckin);
  defaultCheckout.setDate(defaultCheckout.getDate() + 1);

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let calendarNavigationBound = false;

  const state = {
    checkin: defaultCheckin,
    checkout: defaultCheckout,
    guests: 2,
    activeModal: null,
    pendingDate: null,
    calendarYear: defaultCheckin.getFullYear(),
    calendarMonth: defaultCheckin.getMonth(),
  };

  function fmtDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    return `${day} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  }

  function clampInteger(value, min, max, fallback) {
    const number = Number.parseInt(value, 10);

    if (!Number.isFinite(number)) {
      return fallback;
    }

    return Math.max(min, Math.min(max, number));
  }

  function nightsDiff(startDate, endDate) {
    return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  }

  function addDays(date, days) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
  }

  function getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  function monthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function formatIpmsDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${date.getFullYear()}`;
  }

  function getMinimumSelectableDate() {
    if (state.activeModal === "checkout") {
      return addDays(state.checkin, 1);
    }

    return getToday();
  }

  function sameDay(left, right) {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  function renderBar() {
    const checkInDate = document.getElementById("checkInDate");
    const checkOutDate = document.getElementById("checkOutDate");
    const checkInField = document.getElementById("checkInField");
    const checkOutField = document.getElementById("checkOutField");
    const guestCount = document.getElementById("guestCount");

    if (
      !checkInDate ||
      !checkOutDate ||
      !checkInField ||
      !checkOutField ||
      !guestCount
    ) {
      return;
    }

    checkInDate.textContent = fmtDate(state.checkin);
    checkOutDate.textContent = fmtDate(state.checkout);
    checkInField.querySelector(".field-label").textContent = "Check In";
    checkInField.querySelector(".field-value-sub").textContent =
      DAYS[state.checkin.getDay()];

    const nights = nightsDiff(state.checkin, state.checkout);
    checkOutField.querySelector(".field-label").textContent = "Check Out";
    checkOutField.querySelector(".field-value-sub").textContent =
      `${DAYS[state.checkout.getDay()]} | ${nights} night${nights !== 1 ? "s" : ""}`;
    guestCount.textContent = state.guests;
  }

  function adjustGuests(delta) {
    state.guests = clampInteger(
      state.guests + delta,
      MIN_GUESTS,
      MAX_GUESTS,
      state.guests,
    );
    renderBar();
  }

  function commitDate(date) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (state.activeModal === "checkin") {
      if (selectedDate < getToday()) {
        return false;
      }

      state.checkin = selectedDate;

      if (state.checkout <= state.checkin) {
        state.checkout = addDays(state.checkin, 1);
      }
    } else if (state.activeModal === "checkout") {
      if (selectedDate <= state.checkin) {
        window.alert("Check-out must be after check-in.");
        return false;
      }

      state.checkout = selectedDate;
    } else {
      return false;
    }

    state.pendingDate = selectedDate;
    renderBar();
    return true;
  }

  function selectDate(date) {
    if (!commitDate(date)) {
      return;
    }

    renderCalendars();
    closeDateModal();
  }

  function renderCalendar(calendarNumber, year, month) {
    const title = document.getElementById(`cal${calendarNumber}Title`);
    const grid = document.getElementById(`cal${calendarNumber}`);
    if (!title || !grid) {
      return;
    }

    title.textContent = `${MONTHS[month]} ${year}`;
    grid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const minimumSelectableDate = getMinimumSelectableDate();

    for (let index = 0; index < firstDay; index += 1) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "cal-day empty";
      grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const cell = document.createElement("div");
      cell.className = "cal-day";
      cell.textContent = String(day);

      if (date < minimumSelectableDate) {
        cell.classList.add("past");
      } else {
        if (state.pendingDate && sameDay(date, state.pendingDate)) {
          cell.classList.add("selected");
        }
        cell.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          selectDate(date);
        });
      }

      grid.appendChild(cell);
    }
  }

  function renderCalendars() {
    renderCalendar(1, state.calendarYear, state.calendarMonth);
    const nextMonth = new Date(state.calendarYear, state.calendarMonth + 1, 1);
    renderCalendar(2, nextMonth.getFullYear(), nextMonth.getMonth());
  }

  function moveCalendar(delta) {
    const requestedMonth = new Date(
      state.calendarYear,
      state.calendarMonth + delta,
      1,
    );
    const earliestMonth = monthStart(getMinimumSelectableDate());

    if (requestedMonth < earliestMonth) {
      return;
    }

    state.calendarYear = requestedMonth.getFullYear();
    state.calendarMonth = requestedMonth.getMonth();
    renderCalendars();
  }

  function bindCalendarNavigation() {
    if (calendarNavigationBound) {
      return;
    }

    document.addEventListener("click", function (event) {
      const target = event.target;

      if (!target || typeof target.closest !== "function") {
        return;
      }

      const previousButton = target.closest("[data-booking-calendar-prev]");
      const nextButton = target.closest("[data-booking-calendar-next]");

      if (!previousButton && !nextButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      moveCalendar(previousButton ? -1 : 1);
    });

    calendarNavigationBound = true;
  }

  function openDateModal(type, event) {
    if (event) {
      event.stopPropagation();
    }

    state.activeModal = type;
    state.pendingDate =
      type === "checkin" ? new Date(state.checkin) : new Date(state.checkout);

    const modalTitle = document.getElementById("modalTitle");
    const overlay = document.getElementById("dateModalOverlay");
    const backdrop = document.getElementById("dateBgBackdrop");
    if (!modalTitle || !overlay || !backdrop) {
      return;
    }

    modalTitle.textContent =
      type === "checkin" ? "Select Check-In Date" : "Select Check-Out Date";
    overlay.classList.add("open");
    backdrop.classList.add("visible");
    document.body.style.overflow = "hidden";

    state.calendarMonth =
      type === "checkin" ? state.checkin.getMonth() : state.checkout.getMonth();
    state.calendarYear =
      type === "checkin"
        ? state.checkin.getFullYear()
        : state.checkout.getFullYear();
    renderCalendars();
  }

  function closeDateModal() {
    const overlay = document.getElementById("dateModalOverlay");
    const backdrop = document.getElementById("dateBgBackdrop");
    if (overlay) {
      overlay.classList.remove("open");
    }
    if (backdrop) {
      backdrop.classList.remove("visible");
    }

    document.body.style.overflow = "";
    state.activeModal = null;
    state.pendingDate = null;
  }

  function confirmDate() {
    if (!state.pendingDate) {
      closeDateModal();
      return;
    }

    if (!commitDate(state.pendingDate)) {
      return;
    }

    closeDateModal();
  }

  function handleDocumentClick(event) {
    if (!state.activeModal) {
      return false;
    }

    const popupShell = document.getElementById("dateModalOverlay");
    const checkInField = document.getElementById("checkInField");
    const checkOutField = document.getElementById("checkOutField");

    if (
      (popupShell && popupShell.contains(event.target)) ||
      (checkInField && checkInField.contains(event.target)) ||
      (checkOutField && checkOutField.contains(event.target))
    ) {
      return false;
    }

    closeDateModal();
    return true;
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && state.activeModal) {
      closeDateModal();
      return true;
    }

    return false;
  }

  function buildBookingUrl() {
    if (!/^\d+$/.test(BOOKING_HOTEL_ID)) {
      throw new Error("Invalid booking hotel id.");
    }

    const url = new URL(
      `${BOOKING_PATH_PREFIX}${BOOKING_HOTEL_ID}`,
      BOOKING_ORIGIN,
    );

    if (url.protocol !== "https:" || url.origin !== BOOKING_ORIGIN) {
      throw new Error("Untrusted booking destination.");
    }

    return url;
  }

  function getRequestedGuestCount() {
    const roomGuestInput = document.getElementById("roomsGuestInput");
    const roomGuestValue = roomGuestInput ? roomGuestInput.value : "";

    if (roomGuestValue !== "") {
      return clampInteger(roomGuestValue, MIN_GUESTS, MAX_GUESTS, state.guests);
    }

    return clampInteger(state.guests, MIN_GUESTS, MAX_GUESTS, 2);
  }

  function getSafeBookingState() {
    const today = getToday();
    const checkin =
      isValidDate(state.checkin) && state.checkin >= today
        ? new Date(state.checkin)
        : today;
    const checkout =
      isValidDate(state.checkout) && state.checkout > checkin
        ? new Date(state.checkout)
        : addDays(checkin, 1);

    checkin.setHours(0, 0, 0, 0);
    checkout.setHours(0, 0, 0, 0);

    return {
      checkin,
      checkout,
      nights: Math.max(1, nightsDiff(checkin, checkout)),
      adults: getRequestedGuestCount(),
      children: DEFAULT_CHILDREN,
      rooms: DEFAULT_ROOMS,
    };
  }

  function ensureHiddenField(form, name, value) {
    let field = form.elements.namedItem(name);

    if (!field) {
      field = document.createElement("input");
      field.type = "hidden";
      field.name = name;
      form.appendChild(field);
    }

    field.value = String(value);
  }

  function getBookingForm(actionUrl) {
    let form = document.getElementById(BOOKING_FORM_ID);

    if (!form || form.tagName !== "FORM") {
      form = document.createElement("form");
      form.id = BOOKING_FORM_ID;
      form.name = BOOKING_FORM_NAME;
      form.style.display = "none";
      form.setAttribute("aria-hidden", "true");
      document.body.appendChild(form);
    }

    form.replaceChildren();
    form.method = "post";
    form.action = actionUrl.toString();
    form.target = "_blank";
    form.referrerPolicy = "no-referrer";
    form.setAttribute("referrerpolicy", "no-referrer");

    return form;
  }

  function submitTrustedBookingForm() {
    const actionUrl = buildBookingUrl();
    const bookingState = getSafeBookingState();
    const form = getBookingForm(actionUrl);
    const arrivalDate = formatIpmsDate(bookingState.checkin);
    const departureDate = formatIpmsDate(bookingState.checkout);

    ensureHiddenField(form, "eZ_chkin", arrivalDate);
    ensureHiddenField(form, "eZ_chkout", departureDate);
    ensureHiddenField(form, "eZ_Nights", bookingState.nights);
    ensureHiddenField(form, "eZ_adult", bookingState.adults);
    ensureHiddenField(form, "eZ_child", bookingState.children);
    ensureHiddenField(form, "eZ_room", bookingState.rooms);
    ensureHiddenField(form, "calformat", BOOKING_DATE_FORMAT);
    ensureHiddenField(form, "hidBodyLanguage", BOOKING_LANGUAGE);
    ensureHiddenField(form, "ArDt", arrivalDate);
    ensureHiddenField(form, "acturl", actionUrl.toString());

    form.submit();
  }

  function handleBook() {
    try {
      submitTrustedBookingForm();
    } catch (error) {
      console.error("Unable to open the booking engine.", error);
    }
  }

  function init() {
    renderBar();
    bindCalendarNavigation();
  }

  features.booking = {
    adjustGuests,
    closeDateModal,
    confirmDate,
    handleBook,
    handleDocumentClick,
    handleKeydown,
    init,
    openDateModal,
  };
})();
