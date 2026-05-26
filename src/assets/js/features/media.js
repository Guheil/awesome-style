(function () {
  const app = (window.AwesomeHotel = window.AwesomeHotel || {});
  const features = (app.features = app.features || {});

  const leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const leafletScriptUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

  let leafletLoadPromise = null;

  // ---------------------------------------------------------------------------
  // FIX #3 — Memoize media/connection checks at module init time.
  // Previously, shouldSkipVideo() and shouldSkipMotionMedia() re-queried
  // navigator.connection and window.matchMedia on every call, which on the
  // reel fallback path meant re-evaluating on every RAF frame × every video.
  // ---------------------------------------------------------------------------
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  const SAVE_DATA = Boolean(connection && connection.saveData);
  const REDUCED_MOTION = Boolean(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const COMPACT_VIEWPORT = Boolean(
    window.matchMedia && window.matchMedia("(max-width: 760px)").matches,
  );

  // Used by hero video (skips on mobile too).
  const SKIP_HERO_VIDEO = SAVE_DATA || REDUCED_MOTION || COMPACT_VIEWPORT;

  // Reels stay lazy-loaded on mobile/iOS instead of being globally disabled.
  // Save-data and reduced-motion users still get the static poster fallback.
  const SKIP_MOTION_MEDIA = SAVE_DATA || REDUCED_MOTION;

  function getVideoTypeFromSrc(src) {
    if (!src) {
      return "";
    }

    const cleanSrc = src.split("?")[0].split("#")[0].toLowerCase();

    if (cleanSrc.endsWith(".mp4")) {
      return "video/mp4";
    }

    if (cleanSrc.endsWith(".mov")) {
      return "video/quicktime";
    }

    if (cleanSrc.endsWith(".webm")) {
      return "video/webm";
    }

    return "";
  }

  // ---------------------------------------------------------------------------
  // Script / stylesheet loading helpers
  // ---------------------------------------------------------------------------

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

  // FIX #1 — loadScript previously returned a never-resolving promise when the
  // <script> tag already existed in the DOM but had already fired its "load"
  // event (i.e. it was already loaded). The new listeners would never fire,
  // leaving every caller awaiting forever.
  //
  // Fix: track load state via data-loaded / data-failed attributes so we can
  // short-circuit synchronously on repeat calls.
  function loadScript(url, dataAttribute) {
    const existingScript = document.querySelector(`script[${dataAttribute}]`);

    if (existingScript) {
      // Already fully loaded — resolve immediately.
      if (existingScript.dataset.loaded === "true") {
        return Promise.resolve();
      }

      // Previously failed — reject immediately so callers can decide whether
      // to surface an error rather than hanging forever.
      if (existingScript.dataset.failed === "true") {
        return Promise.reject(new Error(`Previously failed to load: ${url}`));
      }

      // Still in flight — attach to the existing element.
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

      script.onload = function () {
        script.dataset.loaded = "true";
        resolve();
      };

      script.onerror = function () {
        script.dataset.failed = "true";
        reject(new Error(`Unable to load ${url}`));
      };

      document.head.appendChild(script);
    });
  }

  // ---------------------------------------------------------------------------
  // Leaflet helpers
  // ---------------------------------------------------------------------------

  function loadLeafletAssets() {
    if (window.L) {
      return Promise.resolve();
    }

    if (leafletLoadPromise) {
      return leafletLoadPromise;
    }

    loadStylesheet(leafletCssUrl, "data-awesome-leaflet-css");

    // FIX #2 — Previously a rejected leafletLoadPromise was cached forever.
    // If Leaflet's CDN timed out on first load, every subsequent scroll-into-
    // view attempt would immediately reject without retrying.
    //
    // Fix: clear leafletLoadPromise on failure so the next intersection event
    // triggers a fresh load attempt.
    leafletLoadPromise = loadScript(
      leafletScriptUrl,
      "data-awesome-leaflet-js",
    ).catch(function (err) {
      leafletLoadPromise = null; // allow retry on next intersection
      throw err;
    });

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
          if (
            !entries.some(function (entry) {
              return entry.isIntersecting;
            })
          ) {
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

  // ---------------------------------------------------------------------------
  // Hero video
  // ---------------------------------------------------------------------------

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
      // SKIP_HERO_VIDEO is pre-computed at module init (FIX #3).
      if (hasSources() || SKIP_HERO_VIDEO) {
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

    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("loop", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");

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

  // ---------------------------------------------------------------------------
  // Reel videos
  // ---------------------------------------------------------------------------

  // FIX #4 — prepareReelVideo() previously set muted/loop/playsInline/etc. on
  // every play and pause call. These attributes never change, so writing them
  // repeatedly on every RAF frame was wasteful.
  //
  // Fix: run the one-time attribute setup inside initReelVideos() and replace
  // the runtime calls to prepareReelVideo() with a simple null-guard.
  function setupReelVideo(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }

  function loadReelVideo(video) {
    if (video.dataset.reelLoaded === "true") {
      return;
    }

    const sources = Array.from(video.querySelectorAll("source[data-src]"));

    sources.forEach(function (source) {
      source.src = source.dataset.src;

      const sourceType = source.dataset.type || getVideoTypeFromSrc(source.src);
      if (sourceType) {
        source.type = sourceType;
      }
    });

    video.dataset.reelLoaded = "true";
    video.load();
  }

  function playReelVideo(video) {
    if (!video) {
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

    if (SKIP_MOTION_MEDIA) {
      pauseReelVideo(video);
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

    // SKIP_MOTION_MEDIA is pre-computed at module init (FIX #3, #5).
    if (reelVideos.length === 0 || SKIP_MOTION_MEDIA) {
      return;
    }

    // FIX #4 — Run one-time attribute setup here instead of on every play/pause.
    reelVideos.forEach(setupReelVideo);

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

    // Fallback for browsers without IntersectionObserver.
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

  // ---------------------------------------------------------------------------
  // YouTube API stub
  // Note: if YouTube iFrame embeds are ever added, this must be assigned to
  // window.onYouTubeIframeAPIReady *before* the YouTube script tag loads,
  // otherwise the API fires the callback before this module runs.
  // ---------------------------------------------------------------------------
  function onYouTubeIframeAPIReady() {
    return undefined;
  }

  // ---------------------------------------------------------------------------
  // Transit / breakfast accordion
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Entry point
  // ---------------------------------------------------------------------------

  function init() {
    initLeafletMap();
    initHeroVideo();
    initReelVideos();
    initTransitAccordion();
  }

  features.media = {
    init,
    onYouTubeIframeAPIReady,
    syncReelVideo,
  };
})();
