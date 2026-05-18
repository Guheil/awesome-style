(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  let heroPlayer;
  let heroVideoHasPlayed = false;

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

  function onYouTubeIframeAPIReady() {
    const heroVideoFrame = document.getElementById("heroVideoFrame");
    const videoBackground = document.querySelector(".video-bg");

    if (
      !heroVideoFrame ||
      !videoBackground ||
      !window.YT ||
      !window.YT.Player
    ) {
      return;
    }

    heroPlayer = new window.YT.Player("heroVideoFrame", {
      host: "https://www.youtube-nocookie.com",
      videoId: "u9Cpkz8wD8s",
      playerVars: {
        autoplay: 1,
        cc_load_policy: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        modestbranding: 1,
        mute: 1,
        origin: window.location.origin,
        playsinline: 1,
        playlist: "u9Cpkz8wD8s",
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: function (event) {
          const playerIframe = event.target.getIframe?.();

          if (playerIframe) {
            playerIframe.setAttribute("aria-hidden", "true");
            playerIframe.setAttribute("tabindex", "-1");
            playerIframe.setAttribute("title", "");
          }

          event.target.mute();
          event.target.setPlaybackQuality("hd1080");
          event.target.playVideo();
        },
        onStateChange: function (event) {
          const playerState = window.YT?.PlayerState;

          if (!playerState) {
            return;
          }

          if (event.data === playerState.PLAYING) {
            heroVideoHasPlayed = true;
            videoBackground.classList.add("video-ready");
            return;
          }

          if (event.data === playerState.ENDED) {
            event.target.seekTo(0);
            event.target.playVideo();
            return;
          }

          if (
            event.data === playerState.PAUSED &&
            document.visibilityState === "visible"
          ) {
            event.target.playVideo();
            return;
          }

          if (!heroVideoHasPlayed) {
            videoBackground.classList.remove("video-ready");
          }
        },
        onError: function () {
          videoBackground.classList.remove("video-ready");
        },
      },
    });
  }

  function initYouTubeHero() {
    const heroVideoFrame = document.getElementById("heroVideoFrame");
    const videoBackground = document.querySelector(".video-bg");

    if (!heroVideoFrame || !videoBackground) {
      return;
    }

    if (window.location.protocol === "file:") {
      return;
    }

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
      return;
    }

    if (document.querySelector("script[data-youtube-api='true']")) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.dataset.youtubeApi = "true";
    document.body.appendChild(script);
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
    initYouTubeHero();
    initTransitAccordion();
  }

  features.media = {
    init,
    onYouTubeIframeAPIReady,
  };
})();
