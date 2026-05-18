(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const bindSwipeNavigation =
    app.gestures && typeof app.gestures.bindSwipeNavigation === "function"
      ? app.gestures.bindSwipeNavigation
      : null;

  let reviewsTrack;
  let reviewsDotsWrap;
  let reviewsPrevButton;
  let reviewsNextButton;
  let reviewsCards = [];
  let reviewsPerPage = 3;
  let reviewsPage = 0;

  function getReviewsPerPage() {
    if (window.innerWidth <= 720) {
      return 1;
    }
    if (window.innerWidth <= 1040) {
      return 2;
    }
    return 3;
  }

  function totalReviewPages() {
    return Math.ceil(reviewsCards.length / reviewsPerPage);
  }

  function buildReviewsDots() {
    if (!reviewsDotsWrap) {
      return;
    }

    reviewsDotsWrap.innerHTML = "";
    for (let index = 0; index < totalReviewPages(); index += 1) {
      const button = document.createElement("button");
      button.className = `reviews-dot${index === reviewsPage ? " is-active" : ""}`;
      button.setAttribute("aria-label", `Go to page ${index + 1}`);
      button.addEventListener("click", function () {
        goToReviewPage(index);
      });
      reviewsDotsWrap.appendChild(button);
    }
  }

  function renderReviews() {
    if (!reviewsTrack || !reviewsDotsWrap) {
      return;
    }

    const start = reviewsPage * reviewsPerPage;
    reviewsCards.forEach(function (card, index) {
      const isVisible = index >= start && index < start + reviewsPerPage;
      card.style.display = isVisible ? "" : "none";
    });

    reviewsDotsWrap
      .querySelectorAll(".reviews-dot")
      .forEach(function (dot, index) {
        dot.classList.toggle("is-active", index === reviewsPage);
      });

    if (reviewsPrevButton) {
      reviewsPrevButton.disabled = reviewsPage === 0;
    }
    if (reviewsNextButton) {
      reviewsNextButton.disabled = reviewsPage >= totalReviewPages() - 1;
    }
  }

  function goToReviewPage(index) {
    reviewsPage = Math.max(0, Math.min(index, totalReviewPages() - 1));
    renderReviews();
  }

  function shiftReviews(step) {
    goToReviewPage(reviewsPage + step);
  }

  function handleResize() {
    const nextPerPage = getReviewsPerPage();
    if (nextPerPage !== reviewsPerPage) {
      reviewsPerPage = nextPerPage;
      reviewsPage = 0;
      buildReviewsDots();
    }
    renderReviews();
  }

  function init() {
    reviewsTrack = document.getElementById("reviewsTrack");
    reviewsDotsWrap = document.getElementById("reviewsDots");
    reviewsPrevButton = document.querySelector(".reviews-arrow--prev");
    reviewsNextButton = document.querySelector(".reviews-arrow--next");
    const reviewsTrackWrap = reviewsTrack ? reviewsTrack.parentElement : null;
    reviewsCards = reviewsTrack
      ? Array.from(reviewsTrack.querySelectorAll(".review-card"))
      : [];

    if (reviewsTrackWrap && bindSwipeNavigation) {
      bindSwipeNavigation(reviewsTrackWrap, {
        canStart: function () {
          return totalReviewPages() > 1;
        },
        ignoreSelector: "button, a",
        onSwipe: shiftReviews,
      });
    }

    reviewsPerPage = getReviewsPerPage();
    buildReviewsDots();
    renderReviews();
  }

  features.reviews = {
    handleResize,
    init,
    shiftReviews,
  };
})();
