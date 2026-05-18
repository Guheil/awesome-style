(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);

  const defaultCheckin = new Date(baseToday);
  defaultCheckin.setDate(defaultCheckin.getDate() + 7);

  const defaultCheckout = new Date(defaultCheckin);
  defaultCheckout.setDate(defaultCheckout.getDate() + 3);

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

  function nightsDiff(startDate, endDate) {
    return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
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
    state.guests = Math.max(1, Math.min(12, state.guests + delta));
    renderBar();
  }

  function selectDate(date) {
    state.pendingDate = new Date(date);
    renderCalendars();
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

      if (date < today) {
        cell.classList.add("past");
      } else {
        if (state.pendingDate && sameDay(date, state.pendingDate)) {
          cell.classList.add("selected");
        }
        cell.addEventListener("click", function () {
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

    if (state.activeModal === "checkin") {
      state.checkin = new Date(state.pendingDate);
      if (state.checkout <= state.checkin) {
        state.checkout = new Date(state.checkin);
        state.checkout.setDate(state.checkout.getDate() + 1);
      }
    } else {
      if (state.pendingDate <= state.checkin) {
        window.alert("Check-out must be after check-in.");
        return;
      }
      state.checkout = new Date(state.pendingDate);
    }

    renderBar();
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

  function handleBook() {
    const nights = nightsDiff(state.checkin, state.checkout);
    window.alert(
      `Reservation Summary\n\nCheck-in: ${fmtDate(state.checkin)}\nCheck-out: ${fmtDate(state.checkout)}\nNights: ${nights}\nGuests: ${state.guests}\n\nProceeding to secure booking...`,
    );
  }

  function init() {
    renderBar();
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
