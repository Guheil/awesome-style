(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  function initLeafletMap() {
    const locationMap = document.getElementById("locationMap");
    if (!locationMap || typeof window.L === "undefined") {
      return;
    }

    const latitude = 16.678407713843825;
    const longitude = 120.33690274114296;

    const map = window.L.map("locationMap", {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    map.setView([latitude, longitude], 16);
    window.setTimeout(function () {
      map.invalidateSize();
    }, 100);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    const goldIcon = window.L.divIcon({
      className: "",
      html: '<div style="width:20px;height:20px;background:#b78a48;border:3px solid #fbf5ea;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -14],
    });

    window.L.marker([latitude, longitude], { icon: goldIcon })
      .addTo(map)
      .bindPopup(
        "<strong style='font-family:Jost,sans-serif;color:#37291d'>Awesome Hotel</strong><br><span style='font-size:12px;font-family:Jost,sans-serif;color:rgba(55,41,29,0.65)'>319 Eagle St, San Juan, La Union</span>",
      )
      .openPopup();
  }

  function initHeroVideo() {
    const heroVideo = document.querySelector(".video-bg .hero-video");
    const videoBackground = document.querySelector(".video-bg");

    if (!heroVideo || !videoBackground) {
      return;
    }

    function showVideo() {
      videoBackground.classList.add("video-ready");
    }

    function hideVideo() {
      videoBackground.classList.remove("video-ready");
    }

    if (heroVideo.tagName === "IFRAME") {
      heroVideo.addEventListener("load", showVideo, { once: true });
      heroVideo.addEventListener("error", hideVideo);
      return;
    }

    if (heroVideo.readyState >= 2) {
      showVideo();
    } else {
      heroVideo.addEventListener("loadeddata", showVideo, { once: true });
      heroVideo.addEventListener("playing", showVideo, { once: true });
    }

    heroVideo.addEventListener("error", hideVideo);

    const playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(hideVideo);
    }
  }

  function onYouTubeIframeAPIReady() {
    return undefined;
  }

  function initTransitAccordion() {
    document.querySelectorAll(".breakfast-transit").forEach(function (details) {
      const summary = details.querySelector("summary");
      const content = details.querySelector("div");
      if (!summary || !content) {
        return;
      }

      let animation = null;
      let isClosing = false;

      summary.addEventListener("click", function (event) {
        event.preventDefault();

        if (animation) {
          animation.cancel();
          animation = null;
        }

        if (isClosing || details.open) {
          isClosing = true;
          const from = content.scrollHeight;
          animation = content.animate(
            [{ height: `${from}px` }, { height: "0px" }],
            {
              duration: 300,
              easing: "ease",
            },
          );
          animation.onfinish = function () {
            details.open = false;
            content.style.height = "";
            isClosing = false;
            animation = null;
          };
          return;
        }

        details.open = true;
        const to = content.scrollHeight;
        animation = content.animate(
          [{ height: "0px" }, { height: `${to}px` }],
          {
            duration: 300,
            easing: "ease",
          },
        );
        animation.onfinish = function () {
          content.style.height = "";
          animation = null;
        };
      });
    });
  }

  function init() {
    initLeafletMap();
    initHeroVideo();
    initTransitAccordion();
  }

  features.media = {
    init,
    onYouTubeIframeAPIReady,
  };
})();
