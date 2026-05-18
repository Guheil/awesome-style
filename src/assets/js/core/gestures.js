(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const gestures = (app.gestures = app.gestures || {});

  function bindSwipeNavigation(element, options) {
    if (!element || !options || typeof options.onSwipe !== "function") {
      return function () {};
    }

    const threshold = Number.isFinite(options.threshold)
      ? options.threshold
      : 64;
    const lockThreshold = Number.isFinite(options.lockThreshold)
      ? options.lockThreshold
      : 12;
    const ignoreSelector = options.ignoreSelector || "";

    let activeInput = null;
    let activeTouchId = null;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let axisLock = "";
    let suppressClick = false;

    element.classList.add("is-draggable-horizontal");

    if (!element.style.touchAction) {
      element.style.touchAction = "pan-y";
    }

    function shouldIgnoreTarget(target) {
      return Boolean(
        ignoreSelector &&
        target instanceof Element &&
        target.closest(ignoreSelector),
      );
    }

    function resetGestureState() {
      element.classList.remove("is-dragging");
      activeInput = null;
      activeTouchId = null;
      startX = 0;
      startY = 0;
      deltaX = 0;
      deltaY = 0;
      axisLock = "";
    }

    function beginGesture(clientX, clientY, inputType) {
      if (activeInput !== null) {
        return false;
      }

      if (
        typeof options.canStart === "function" &&
        options.canStart() === false
      ) {
        return;
      }

      activeInput = inputType;
      startX = clientX;
      startY = clientY;
      deltaX = 0;
      deltaY = 0;
      axisLock = "";
      suppressClick = false;
      element.classList.add("is-dragging");

      return true;
    }

    function updateGesture(clientX, clientY, event) {
      if (activeInput === null) {
        return;
      }

      deltaX = clientX - startX;
      deltaY = clientY - startY;

      if (!axisLock) {
        if (
          Math.abs(deltaX) < lockThreshold &&
          Math.abs(deltaY) < lockThreshold
        ) {
          return;
        }

        axisLock = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      }

      if (axisLock === "x") {
        suppressClick = true;

        if (event && event.cancelable) {
          event.preventDefault();
        }
      }
    }

    function queueClickReset() {
      window.setTimeout(function () {
        suppressClick = false;
      }, 0);
    }

    function finishGesture(event) {
      if (activeInput === null) {
        return;
      }

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      const shouldSwipe =
        axisLock === "x" && absDeltaX >= threshold && absDeltaX > absDeltaY;

      if (shouldSwipe) {
        options.onSwipe(deltaX < 0 ? 1 : -1, event);
      }

      const shouldSuppressClick = suppressClick;
      resetGestureState();

      if (shouldSuppressClick) {
        suppressClick = true;
        queueClickReset();
      }
    }

    function handleMouseDown(event) {
      if (event.button !== 0 || shouldIgnoreTarget(event.target)) {
        return;
      }

      if (!beginGesture(event.clientX, event.clientY, "mouse")) {
        return;
      }

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(event) {
      if (activeInput !== "mouse") {
        return;
      }

      updateGesture(event.clientX, event.clientY, event);
    }

    function handleMouseUp(event) {
      if (activeInput !== "mouse") {
        return;
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      finishGesture(event);
    }

    function findTouchById(touchList) {
      if (activeTouchId === null) {
        return null;
      }

      for (let index = 0; index < touchList.length; index += 1) {
        if (touchList[index].identifier === activeTouchId) {
          return touchList[index];
        }
      }

      return null;
    }

    function handleTouchStart(event) {
      if (event.touches.length !== 1 || shouldIgnoreTarget(event.target)) {
        return;
      }

      const touch = event.touches[0];
      if (!beginGesture(touch.clientX, touch.clientY, "touch")) {
        return;
      }

      activeTouchId = touch.identifier;
    }

    function handleTouchMove(event) {
      if (activeInput !== "touch") {
        return;
      }

      const touch = findTouchById(event.touches);
      if (!touch) {
        return;
      }

      updateGesture(touch.clientX, touch.clientY, event);
    }

    function handleTouchEnd(event) {
      if (activeInput !== "touch") {
        return;
      }

      const touch = findTouchById(event.changedTouches);
      if (!touch) {
        return;
      }

      finishGesture(event);
    }

    function handleTouchCancel(event) {
      if (activeInput !== "touch") {
        return;
      }

      resetGestureState();
      suppressClick = false;
    }

    function handleClickCapture(event) {
      if (!suppressClick) {
        return;
      }

      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    }

    function preventDragStart(event) {
      event.preventDefault();
    }

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    element.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    element.addEventListener("touchend", handleTouchEnd);
    element.addEventListener("touchcancel", handleTouchCancel);
    element.addEventListener("click", handleClickCapture, true);
    element.addEventListener("dragstart", preventDragStart);

    return function () {
      resetGestureState();
      suppressClick = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      element.classList.remove("is-draggable-horizontal", "is-dragging");
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);
      element.removeEventListener("click", handleClickCapture, true);
      element.removeEventListener("dragstart", preventDragStart);
    };
  }

  gestures.bindSwipeNavigation = bindSwipeNavigation;
})();
