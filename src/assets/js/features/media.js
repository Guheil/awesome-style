(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});
  const leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const leafletScriptUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  let leafletLoadPromise = null;

  function loadStylesheet(url, dataAttribute) {
    if (document.querySelector(`link[${dataAttribute}]`)) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute(dataAttribute, "true");
    document.head.appendChild(link);
  }

  function loadScript(url, dataAttribute) {
    const existingScript = document.querySelector(`script[${dataAttribute}]`);
    if (existingScript) {
      return new Promise(function (resolve, reject) {
        existingScript.addEventListener("load", resolve, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
      });
    }

    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.setAttribute(dataAttribute, "true");
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error(`Unable to load ${url}`));
      };
      document.head.appendChild(script);
    });
  }

  function loadLeafletAssets() {
    if (window.L) {
      return Promise.resolve();
    }

    if (leafletLoadPromise) {
      return leafletLoadPromise;
    }

    loadStylesheet(leafletCssUrl, "data-awesome-leaflet-css");
    leafletLoadPromise = loadScript(
      leafletScriptUrl,
      "data-awesome-leaflet-js",
    );

    return leafletLoadPromise;
  }

  function createLeafletMap(locationMap) {
    if (!locationMap || locationMap.dataset.mapInitialized === "true") {
      return;
    }

    if (typeof window.L === "undefined") {
      return;
    }

    locationMap.dataset.mapInitialized = "true";

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

  function initLeafletMap() {
    const locationMap = document.getElementById("locationMap");
    if (!locationMap) {
      return;
    }

    function loadAndCreateMap() {
      loadLeafletAssets()
        .then(function () {
          createLeafletMap(locationMap);
        })
        .catch(function (error) {
          console.warn(error.message);
        });
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          if (!entries.some((entry) => entry.isIntersecting)) {
            return;
          }

          observer.disconnect();
          loadAndCreateMap();
        },
        { rootMargin: "360px 0px" },
      );

      observer.observe(locationMap);
      return;
    }

    window.addEventListener(
      "load",
      function () {
        window.setTimeout(loadAndCreateMap, 1200);
      },
      { once: true },
    );
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

    function shouldSkipVideo() {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      const saveData = Boolean(connection && connection.saveData);
      const reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport =
        window.matchMedia && window.matchMedia("(max-width: 760px)").matches;

      return saveData || reducedMotion || compactViewport;
    }

    function addSource(src, type) {
      if (!src) {
        return;
      }

      const source = document.createElement("source");
      source.src = src;
      source.type = type;
      heroVideo.appendChild(source);
    }

    function hasSources() {
      return Boolean(heroVideo.querySelector("source"));
    }

    function loadVideoSources() {
      if (hasSources() || shouldSkipVideo()) {
        return;
      }

      addSource(heroVideo.dataset.srcMp4, "video/mp4");
      heroVideo.load();

      const playAttempt = heroVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(hideVideo);
      }
    }

    function deferVideoLoad() {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(loadVideoSources, { timeout: 2400 });
        return;
      }

      window.setTimeout(loadVideoSources, 900);
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

    if (document.readyState === "complete") {
      deferVideoLoad();
      return;
    }

    window.addEventListener("load", deferVideoLoad, { once: true });
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

  function prepareReelVideo(video) {
    if (!video) {
      return false;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");

    return true;
  }

  function loadReelVideo(video) {
    if (
      !prepareReelVideo(video) ||
      video.dataset.reelLoaded === "true" ||
      shouldSkipMotionMedia()
    ) {
      return;
    }

    const sources = Array.from(video.querySelectorAll("source[data-src]"));

    sources.forEach(function (source) {
      source.src = source.dataset.src;

      if (source.dataset.type) {
        source.type = source.dataset.type;
      }
    });

    video.dataset.reelLoaded = "true";
    video.load();
  }

  function playReelVideo(video) {
    if (!prepareReelVideo(video) || shouldSkipMotionMedia()) {
      return;
    }

    if (video.dataset.reelLoaded !== "true") {
      loadReelVideo(video);
    }

    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {});
    }
  }

  function pauseReelVideo(video) {
    if (!video || video.paused) {
      return;
    }

    video.pause();
  }

  function isVideoNearViewport(video) {
    if (!video || typeof video.getBoundingClientRect !== "function") {
      return false;
    }

    const rect = video.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;

    return rect.bottom >= -120 && rect.top <= viewportHeight + 120;
  }

  function syncReelVideo(video) {
    if (!video) {
      return;
    }

    if (document.visibilityState === "hidden") {
      pauseReelVideo(video);
      return;
    }

    if (isVideoNearViewport(video)) {
      playReelVideo(video);
      return;
    }

    pauseReelVideo(video);
  }

  function initReelVideos() {
    const reelVideos = Array.from(
      document.querySelectorAll("[data-reel-video]"),
    );

    if (reelVideos.length === 0 || shouldSkipMotionMedia()) {
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              pauseReelVideo(entry.target);
              return;
            }

            playReelVideo(entry.target);
          });
        },
        {
          rootMargin: "160px 0px",
          threshold: 0.2,
        },
      );

      reelVideos.forEach(function (video) {
        observer.observe(video);
      });

      document.addEventListener("visibilitychange", function () {
        reelVideos.forEach(syncReelVideo);
      });

      return;
    }

    let rafId = 0;

    function syncVisibleVideos() {
      rafId = 0;
      reelVideos.forEach(syncReelVideo);
    }

    function requestSync() {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(syncVisibleVideos);
    }

    if (document.readyState === "complete") {
      requestSync();
    } else {
      window.addEventListener("load", requestSync, { once: true });
    }

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync, { passive: true });
    document.addEventListener("visibilitychange", requestSync);
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
    initReelVideos();
    initTransitAccordion();
  }

  features.media = {
    init,
    onYouTubeIframeAPIReady,
  };
})();
